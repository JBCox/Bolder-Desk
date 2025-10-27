import { Injectable, signal, computed } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { Ticket, CustomFieldDefinition, KnowledgeBaseArticle, Agent, Anomaly, ProblemSuggestion } from './models';

interface AgentReport {
    agentName: string;
    resolvedCount: number;
    avgResolutionTime: string;
}

interface TicketAiInsights {
  summary: string;
  suggestions: string[];
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  predictedCsat: number;
}

interface AnalyticsAiInsights {
  anomalies: Anomaly[];
  deflectionOpportunities: string[];
  problemSuggestions: ProblemSuggestion[];
}


@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private readonly COOLDOWN_DURATION_MS = 5 * 60 * 1000; // 5 minutes

  private apiCooldownUntil = signal<number | null>(null);

  isApiOnCooldown = computed(() => {
    const cooldownEnd = this.apiCooldownUntil();
    return cooldownEnd !== null && Date.now() < cooldownEnd;
  });

  cooldownTimeRemaining = computed(() => {
    const cooldownEnd = this.apiCooldownUntil();
    if (cooldownEnd === null || !this.isApiOnCooldown()) {
      return 0;
    }
    return Math.ceil((cooldownEnd - Date.now()) / 1000); // remaining seconds
  });

  constructor() {
    // IMPORTANT: Service is designed to fail gracefully if API_KEY is not set.
    // In a real app, this should be handled with a proper configuration service.
    if (process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }

  private checkCooldown(): void {
    if (this.isApiOnCooldown()) {
      const remainingMinutes = Math.ceil(this.cooldownTimeRemaining() / 60);
      throw new Error(`AI features are temporarily unavailable due to rate limiting. Please try again in about ${remainingMinutes} minute(s).`);
    }
  }

  private handleApiError(error: unknown, context: string): never {
    console.error(`Error in GeminiService.${context}:`, error);
    // A simple way to check for rate limit errors from the Gemini API client
    if (error instanceof Error && (error.message.includes('429') || error.message.includes('RESOURCE_EXHAUSTED'))) {
      this.apiCooldownUntil.set(Date.now() + this.COOLDOWN_DURATION_MS);
      throw new Error('You have exceeded your API quota. Please check your plan and billing details. AI features will be temporarily disabled for 5 minutes.');
    }
    const action = context.replace(/([A-Z])/g, ' $1').toLowerCase();
    throw new Error(`Failed to ${action}.`);
  }

  async getAiTicketInsights(ticket: Ticket, contactName: string, availableTags: string[]): Promise<TicketAiInsights> {
    this.checkCooldown();
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock insights.');
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        summary: `This is a mock summary for ticket #${ticket.id}. The customer, ${contactName}, is experiencing an issue related to "${ticket.subject}".`,
        suggestions: ['Mock suggestion 1', 'Mock suggestion 2'],
        tags: availableTags.slice(0, 2),
        sentiment: 'neutral',
        predictedCsat: 4.5
      };
    }

    try {
      const conversationHistory = ticket.messages
        .map(m => `${m.from} (${m.type}): ${m.content}`)
        .slice(-10)
        .join('\n');
      
      const prompt = `Analyze the following support ticket and provide a comprehensive analysis in JSON format.
      
      Ticket Subject: ${ticket.subject}
      Customer Name: ${contactName}
      Available Tags: ${availableTags.join(', ')}
      Conversation History:
      ---
      ${conversationHistory}
      ---
      
      Perform the following tasks:
      1.  **Summarize** the conversation into a few bullet points, focusing on the customer's problem and the last known status.
      2.  Generate 3 distinct, helpful, and concise **reply suggestions** for the agent to send to the customer in response to the last message.
      3.  Suggest up to 3 relevant **tags** for this ticket from the provided list of available tags.
      4.  Analyze the overall customer **sentiment** from the conversation. Respond with only one word: "positive", "neutral", or "negative".
      5.  Predict the customer satisfaction score (**predictedCsat**) on a scale from 1.0 to 5.0.
      
      Return a single JSON object with the specified structure.`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
              tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              sentiment: { type: Type.STRING },
              predictedCsat: { type: Type.NUMBER }
            }
          }
        }
      });
      
      const result = JSON.parse(response.text);

      return {
        summary: result.summary || 'Summary not available.',
        suggestions: Array.isArray(result.suggestions) ? result.suggestions : [],
        tags: (Array.isArray(result.tags) ? result.tags : []).filter((t: string) => availableTags.includes(t)),
        sentiment: ['positive', 'neutral', 'negative'].includes(result.sentiment) ? result.sentiment : 'neutral',
        predictedCsat: typeof result.predictedCsat === 'number' ? Math.max(1, Math.min(5, result.predictedCsat)) : 0
      };

    } catch (error) {
      this.handleApiError(error, 'getAiTicketInsights');
    }
  }

  async getAiAnalyticsInsights(tickets: Ticket[]): Promise<AnalyticsAiInsights> {
    this.checkCooldown();
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock analytics insights.');
       await new Promise(r => setTimeout(r, 1000));
       return {
         anomalies: [{ topic: 'Mock Anomaly: Login Failures', count: 5, severity: 'high' }],
         deflectionOpportunities: ['How to update billing information'],
         problemSuggestions: []
       };
    }

    try {
      const recentTickets = tickets
        .filter(t => new Date(t.created).getTime() > Date.now() - 24 * 60 * 60 * 1000)
        .map(t => ({ id: t.id, subject: t.subject }));
      
      const resolvedTickets = tickets
        .filter(t => t.status === 'resolved')
        .slice(-50)
        .map(t => ({ subject: t.subject }));

      const openTickets = tickets
        .filter(t => t.status === 'open' && !t.parentId)
        .map(t => ({ id: t.id, subject: t.subject }));

      const prompt = `Analyze the provided ticket data to identify key insights for a support manager.
      
      Current Time: ${new Date().toISOString()}
      
      Recently Created Tickets (last 24h):
      ---
      ${JSON.stringify(recentTickets, null, 2)}
      ---
      
      Recently Resolved Tickets (last 50):
      ---
      ${JSON.stringify(resolvedTickets, null, 2)}
      ---
      
      Currently Open Tickets:
      ---
      ${JSON.stringify(openTickets, null, 2)}
      ---
      
      Perform the following tasks and return a single JSON object:
      1.  **anomalies**: Analyze "Recently Created Tickets". Identify unusual spikes in ticket topics. A spike is a significantly higher number of tickets about a specific topic. Return an array of objects, each with "topic", "count", and "severity" ('high' or 'medium').
      2.  **deflectionOpportunities**: Analyze "Recently Resolved Tickets". Identify common problems that could be solved with a knowledge base article. Return an array of up to 3 suggested article titles.
      3.  **problemSuggestions**: Analyze "Currently Open Tickets". Identify clusters of 3 or more tickets reporting the same underlying problem. Return an array of objects, each with "suggestedTitle" for a new "Problem Ticket" and "incidentTicketIds" (an array of ticket IDs).
      `;

       const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              anomalies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    count: { type: Type.NUMBER },
                    severity: { type: Type.STRING },
                  },
                },
              },
              deflectionOpportunities: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              problemSuggestions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    suggestedTitle: { type: Type.STRING },
                    incidentTicketIds: {
                      type: Type.ARRAY,
                      items: { type: Type.NUMBER }
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      return JSON.parse(response.text);

    } catch (error) {
       this.handleApiError(error, 'getAiAnalyticsInsights');
    }
  }

  async summarizeTicket(ticket: Ticket, contactName: string): Promise<string> {
    this.checkCooldown();
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
      this.handleApiError(error, 'summarizeTicket');
    }
  }

  async generateReplySuggestions(ticket: Ticket, contactName: string): Promise<string[]> {
    this.checkCooldown();
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
      this.handleApiError(error, 'generateReplySuggestions');
    }
  }

  async analyzeSentiment(ticket: Ticket): Promise<'positive' | 'neutral' | 'negative'> {
    this.checkCooldown();
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
      this.handleApiError(error, 'analyzeSentiment');
    }
  }

  async suggestTags(ticket: Ticket, availableTags: string[]): Promise<string[]> {
    this.checkCooldown();
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
      this.handleApiError(error, 'suggestTags');
    }
  }
  
  async extractFieldsFromContent(content: string, customFields: CustomFieldDefinition[]): Promise<{ [key: string]: any }> {
    this.checkCooldown();
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
      this.handleApiError(error, 'extractFieldsFromContent');
    }
  }

  async suggestAgentForTicket(ticket: Ticket, agents: Agent[]): Promise<Agent | null> {
    this.checkCooldown();
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
      this.handleApiError(error, 'suggestAgentForTicket');
    }
  }

  async extractSkillsForTicket(ticket: Ticket, availableSkills: string[]): Promise<string[]> {
    this.checkCooldown();
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
      this.handleApiError(error, 'extractSkillsForTicket');
    }
  }
  
  async analyzeCSATComment(comment: string): Promise<string> {
    this.checkCooldown();
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
      this.handleApiError(error, 'analyzeCSATComment');
    }
  }

  async generateKbArticle(ticket: Ticket): Promise<{ title: string, content: string, tags: string[] }> {
    this.checkCooldown();
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
      this.handleApiError(error, 'generateKbArticle');
    }
  }

  async changeTone(text: string, tone: 'Formal' | 'Friendly'): Promise<string> {
    this.checkCooldown();
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
      this.handleApiError(error, 'changeTone');
    }
  }

  async answerFromKb(query: string, articles: KnowledgeBaseArticle[]): Promise<{ answer: string, sourceIds: number[] }> {
    this.checkCooldown();
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
      this.handleApiError(error, 'answerFromKb');
    }
  }

  async predictCsat(ticket: Ticket): Promise<number> {
    this.checkCooldown();
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock CSAT prediction.');
      return Math.round((Math.random() * 4 + 1) * 10) / 10;
    }
    
    try {
      const conversation = ticket.messages.map(m => `${m.from}: ${m.content}`).join('\n\n');
      const prompt = `Analyze the sentiment and content of the following support ticket conversation. Based on the interaction, predict the customer satisfaction score on a scale from 1.0 to 5.0, where 1 is very dissatisfied and 5 is very satisfied.
      
      Conversation:
      ---
      ${conversation}
      ---
      
      Respond with a JSON object containing a single key "predictedScore" which is a number (it can have one decimal place).`;
      
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              predictedScore: { type: Type.NUMBER }
            }
          }
        }
      });
      
      const result = JSON.parse(response.text);
      const score = Math.max(1, Math.min(5, result.predictedScore || 0));
      return Math.round(score * 10) / 10;
    } catch (error) {
      this.handleApiError(error, 'predictCsat');
    }
  }
  
  async summarizeReportData(reportData: AgentReport[]): Promise<string> {
    this.checkCooldown();
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock report summary.');
      return `This is a mock summary. The top performing agent appears to be ${reportData[0]?.agentName || 'N/A'} with ${reportData[0]?.resolvedCount || 0} resolved tickets.`;
    }
    
    try {
      const prompt = `Analyze the following agent performance report data. Provide a concise executive summary highlighting key insights, such as top performers, potential areas for improvement, and overall team productivity.

      Report Data:
      ---
      ${JSON.stringify(reportData, null, 2)}
      ---
      
      Executive Summary:`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return response.text.trim();
    } catch (error) {
      this.handleApiError(error, 'summarizeReportData');
    }
  }
}