import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { Ticket, CustomFieldDefinition, KnowledgeBaseArticle, Agent } from './models';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    // IMPORTANT: Service is designed to fail gracefully if API_KEY is not set.
    // In a real app, this should be handled with a proper configuration service.
    if (process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }

  async summarizeTicket(ticket: Ticket, contactName: string): Promise<string> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock summary.');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
      return `This is a mock summary for ticket #${ticket.id}. The customer, ${contactName}, is experiencing an issue related to "${ticket.subject}". The last message was: "${ticket.messages[ticket.messages.length - 1].content}".`;
    }

    try {
      const conversationHistory = ticket.messages
        .map(m => `${m.from} (${m.type}): ${m.content}`)
        .join('\n');
      
      const prompt = `Summarize the following support ticket conversation into a few bullet points. Focus on the customer's problem and the last known status.
      
      Ticket Subject: ${ticket.subject}
      Customer: ${contactName}
      Conversation:
      ---
      ${conversationHistory}
      ---
      Summary:`;

      const response = await this.ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error('Error summarizing ticket:', error);
      return 'Error: Could not generate summary.';
    }
  }

  async generateReplySuggestions(ticket: Ticket, contactName: string): Promise<string[]> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock replies.');
       await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency
       return [
        'Mock reply 1: Have you tried turning it off and on again?',
        'Mock reply 2: Can you please provide a screenshot of the issue?',
        'Mock reply 3: We are looking into this and will get back to you shortly.'
       ];
    }
    
    try {
      const conversationHistory = ticket.messages
        .map(m => `${m.from} (${m.type}): ${m.content}`)
        .slice(-10) // Get last 10 messages for context
        .join('\n');

      const lastCustomerMessage = ticket.messages.filter(m => m.type === 'customer').pop()?.content || '';

      const prompt = `Based on the following support ticket conversation, generate 3 distinct, helpful, and concise reply suggestions for the agent to send to the customer (${contactName}). The agent needs to respond to the last customer message.

      Ticket Subject: ${ticket.subject}
      Last Customer Message: "${lastCustomerMessage}"

      Conversation History (for context):
      ---
      ${conversationHistory}
      ---
      
      Provide your response as a JSON object with a single key "suggestions" which is an array of 3 strings.`;
      
       const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.STRING
                            }
                        }
                    }
                }
            }
       });

       const json = JSON.parse(response.text);
       return json.suggestions || [];
    } catch (error) {
      console.error('Error generating replies:', error);
      return ['Error: Could not generate suggestions.'];
    }
  }

  async analyzeSentiment(ticket: Ticket): Promise<'positive' | 'neutral' | 'negative'> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock sentiment.');
      const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative'];
      return sentiments[Math.floor(Math.random() * sentiments.length)];
    }
    
    try {
      const content = ticket.messages.filter(m => m.type === 'customer').map(m => m.content).join('\n');
      const prompt = `Analyze the sentiment of the following customer messages from a support ticket. Respond with only one word: "positive", "neutral", or "negative".
      
      Messages:
      ---
      ${content}
      ---
      
      Sentiment:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const sentiment = response.text.trim().toLowerCase();
      if (sentiment === 'positive' || sentiment === 'neutral' || sentiment === 'negative') {
        return sentiment;
      }
      return 'neutral';
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return 'neutral';
    }
  }

  async suggestTags(ticket: Ticket, availableTags: string[]): Promise<string[]> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock tags.');
      return availableTags.length > 2 ? [availableTags[0], availableTags[1]] : [];
    }
    
    try {
      const content = ticket.messages.map(m => m.content).join('\n');
      const prompt = `Based on the content of this support ticket, suggest up to 3 relevant tags from the provided list.
      
      Available Tags: ${availableTags.join(', ')}
      
      Ticket Subject: ${ticket.subject}
      Ticket Content:
      ---
      ${content}
      ---
      
      Respond with a JSON object containing a single key "tags" which is an array of suggested tag strings. The suggested tags must be from the available tags list.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tags: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING
                        }
                    }
                }
            }
        }
      });
      
      const json = JSON.parse(response.text);
      // Filter to ensure AI only returns valid tags
      return (json.tags || []).filter((tag: string) => availableTags.includes(tag));
    } catch (error) {
      console.error('Error suggesting tags:', error);
      return [];
    }
  }
  
  async extractFieldsFromContent(content: string, customFields: CustomFieldDefinition[]): Promise<{ [key: string]: any }> {
    if (!this.ai || customFields.length === 0) {
      console.warn('Gemini API key not configured or no custom fields defined. Skipping field extraction.');
      return {};
    }

    try {
      const schemaProperties: { [key: string]: any } = {};
      customFields.forEach(field => {
        schemaProperties[field.id] = { type: Type.STRING, description: `The value for the field "${field.name}"` };
      });

      const prompt = `Analyze the following text and extract the values for the defined fields. Only extract values that are explicitly mentioned in the text.

      Text to analyze:
      ---
      ${content}
      ---
      
      Fields to extract: ${customFields.map(f => `"${f.name}" (ID: ${f.id})`).join(', ')}
      
      Return the result as a JSON object where keys are the field IDs.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: schemaProperties
            }
        }
      });
      
      return JSON.parse(response.text);
    } catch (error) {
      console.error('Error extracting fields:', error);
      return {};
    }
  }

  async suggestAgentForTicket(ticket: Ticket, agents: Agent[]): Promise<Agent | null> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Mocking agent suggestion.');
      // Return a random agent for mock purposes
      const onlineAgents = agents.filter(a => a.onlineStatus === 'online');
      return onlineAgents.length > 0 ? onlineAgents[Math.floor(Math.random() * onlineAgents.length)] : null;
    }

    try {
      const ticketContent = `${ticket.subject}\n\n${ticket.messages.map(m => m.content).join('\n')}`;
      const availableAgents = agents
        .filter(a => a.onlineStatus === 'online')
        .map(a => ({ name: a.name, skills: a.skills }));

      if (availableAgents.length === 0) {
        return null; // No agents available to assign
      }

      const prompt = `Based on the content of the following support ticket, choose the single best agent to assign it to from the list of available agents. Consider the agent's skills.
      
      Available Agents and their skills:
      ---
      ${JSON.stringify(availableAgents, null, 2)}
      ---
      
      Ticket Content:
      ---
      ${ticketContent}
      ---
      
      Respond with a JSON object containing a single key "agentName" with the name of the chosen agent. The name must be an exact match from the list. If no agent is a good fit, return null for the agentName.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              agentName: { 
                type: Type.STRING,
              }
            },
            nullableProperties: ["agentName"]
          }
        }
      });
      
      const result = JSON.parse(response.text);
      if (result.agentName) {
        return agents.find(a => a.name === result.agentName) || null;
      }
      return null;
    } catch (error) {
      console.error('Error suggesting agent:', error);
      return null;
    }
  }

  async extractSkillsForTicket(ticket: Ticket, availableSkills: string[]): Promise<string[]> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock skills.');
      return availableSkills.length > 1 ? [availableSkills[0]] : [];
    }

    try {
      const content = `${ticket.subject}\n${ticket.messages.map(m => m.content).join('\n')}`;
      const prompt = `Based on the following support ticket, identify which of the available skills are most relevant to resolving the issue. Suggest a maximum of two skills.

      Available skills: ${availableSkills.join(', ')}

      Ticket content:
      ---
      ${content}
      ---
      
      Respond with a JSON object with a single key "skills" which is an array of the most relevant skill strings from the available list.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    skills: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                }
            }
        }
      });
      
      const json = JSON.parse(response.text);
      return (json.skills || []).filter((skill: string) => availableSkills.includes(skill));
    } catch (error) {
      console.error('Error extracting skills:', error);
      return [];
    }
  }
  
  async analyzeCSATComment(comment: string): Promise<string> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock CSAT driver.');
      return 'Other';
    }
    
    const drivers = ['Product Quality', 'Customer Service', 'Pricing', 'Ease of Use', 'Other'];

    try {
      const prompt = `Analyze the following customer feedback comment and classify it into one of these categories: ${drivers.join(', ')}. Respond with only the category name.

      Comment: "${comment}"
      
      Category:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const driver = response.text.trim();
      return drivers.includes(driver) ? driver : 'Other';
    } catch (error) {
      console.error('Error analyzing CSAT comment:', error);
      return 'Other';
    }
  }

  async generateKbArticle(ticket: Ticket): Promise<{ title: string, content: string, tags: string[] }> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock KB article.');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        title: `How to resolve: ${ticket.subject}`,
        content: `This is a mock knowledge base article based on the resolution of ticket #${ticket.id}. The main solution was discussed in the final messages.`,
        tags: [...ticket.tags, 'generated']
      };
    }
    
    try {
      const conversation = ticket.messages.map(m => `${m.type === 'agent' ? 'Support Agent' : 'Customer'}: ${m.content}`).join('\n');
      const prompt = `Analyze the following support ticket conversation, which has been marked as resolved. Generate a concise knowledge base article that explains the customer's problem and provides the solution.

      Ticket Subject: ${ticket.subject}
      Conversation:
      ---
      ${conversation}
      ---
      
      Based on this, generate a JSON object with three keys:
      1. "title": A clear, action-oriented title for the article.
      2. "content": The article body, written clearly for other customers to understand. Explain the problem and the steps to solve it.
      3. "tags": An array of 1-3 relevant keyword tags for the article.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            }
          }
        }
      });
      
      return JSON.parse(response.text);
    } catch (error) {
      console.error('Error generating KB article:', error);
      throw new Error('Could not generate KB article.');
    }
  }

  async changeTone(text: string, tone: 'Formal' | 'Friendly'): Promise<string> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning modified mock text.');
      return `(${tone}) ${text}`;
    }

    try {
      const prompt = `Rewrite the following text to have a more ${tone.toLowerCase()} tone. Respond only with the rewritten text.

      Original text:
      ---
      ${text}
      ---
      
      Rewritten text:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text.trim();
    } catch (error) {
      console.error('Error changing tone:', error);
      return 'Error: Could not rewrite text.';
    }
  }

  async answerFromKb(query: string, articles: KnowledgeBaseArticle[]): Promise<{ answer: string, sourceIds: number[] }> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock KB answer.');
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        answer: `This is a mock answer for your question about "${query}". The most relevant article is "${articles[0].title}".`,
        sourceIds: [articles[0].id]
      };
    }

    try {
      const context = articles.map(a => `
        <article>
          <id>${a.id}</id>
          <title>${a.title}</title>
          <content>${a.content}</content>
        </article>
      `).join('\n');

      const prompt = `You are a helpful support assistant. Answer the user's question based *only* on the provided knowledge base articles. 
      Your answer should be concise and directly address the question.
      After the answer, you MUST cite the article IDs you used.

      Available Articles:
      ---
      ${context}
      ---
      
      User's Question: "${query}"

      Respond with a JSON object with two keys:
      1. "answer": A string containing the helpful answer.
      2. "sourceIds": An array of numbers representing the IDs of the articles you used to formulate the answer.
      `;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              sourceIds: { type: Type.ARRAY, items: { type: Type.NUMBER } }
            }
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error('Error answering from KB:', error);
      return {
        answer: 'Sorry, I was unable to find an answer in the knowledge base.',
        sourceIds: []
      };
    }
  }
}