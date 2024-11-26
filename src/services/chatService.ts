import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const systemPrompt = `You are a helpful assistant for CanStart, a platform that helps people immigrate and settle in Canada.
Your role is to provide accurate information about:
- Immigration processes and requirements
- Job searching in Canada
- Housing and accommodation
- Healthcare system
- Administrative procedures
- Cultural integration

Always be professional, concise, and provide accurate information based on official Canadian sources.`;

export async function generateChatResponse(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[]
): Promise<string> {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.data.choices[0].message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
}