import { Injectable } from '@angular/core';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { Ticket } from './models';

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

  async summarizeTicket(ticket: Ticket): Promise<string> {
    if (!this.ai) {
      console.warn('Gemini API key not configured. Returning mock summary.');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
      return `This is a mock summary for ticket #${ticket.id}. The customer, ${ticket.customer}, is experiencing an issue related to "${ticket.subject}". The last message was: "${ticket.messages[ticket.messages.length - 1].content}".`;
    }

    try {
      const conversationHistory = ticket.messages
        .map(m => `${m.from} (${m.type}): ${m.content}`)
        .join('\n');
      
      const prompt = `Summarize the following support ticket conversation into a few bullet points. Focus on the customer's problem and the last known status.
      
      Ticket Subject: ${ticket.subject}
      Customer: ${ticket.customer}
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

  async generateReplySuggestions(ticket: Ticket): Promise<string[]> {
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

      const prompt = `Based on the following support ticket conversation, generate 3 distinct, helpful, and concise reply suggestions for the agent to send to the customer. The agent needs to respond to the last customer message.

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
}