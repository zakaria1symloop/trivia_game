import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const categoryPrompts = {
  food: "traditional Aleppo cuisine, famous dishes like kibbeh Halabiya, kebab Halabi, muhammara, shanklish, fattoush, hummus, falafel, shawarma, and Aleppo's unique cooking techniques",
  sweets: "Aleppo's famous sweets and desserts like mamouniyeh, sbiseh, halawet el jibn, baklava, kunafa, maamoul, and traditional Aleppian pastries",
  culture: "Aleppo's rich culture, traditions, customs, hospitality, traditional crafts like soap-making and textile weaving, music, and daily life in this ancient city",
  history: "Aleppo's ancient history as one of the oldest continuously inhabited cities, the Citadel of Aleppo, the Great Mosque, ancient souks, the Silk Road, and its role as a trading hub",
  spices: "Aleppo's famous spices especially Aleppo pepper (biber), za'atar, cumin, sumac, seven spice blend, and the city's historic spice markets",
  religion: "Islamic traditions in Aleppo, beautiful mosques, Ramadan and Eid celebrations, interfaith harmony, and the spiritual heritage of this ancient city",
  mixed: "a mix of Aleppo's food, sweets, culture, history, spices, and traditions - celebrating this beautiful ancient city",
};

export async function POST(request: NextRequest) {
  try {
    const { category, audience, language, count = 10 } = await request.json();

    // Initialize OpenAI client at runtime, not build time
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const categoryContext = categoryPrompts[category as keyof typeof categoryPrompts] || categoryPrompts.mixed;
    const audienceLevel = audience === 'kids' ? 'children aged 6-12, using simple words and fun facts' : 'adults, with more detailed and interesting information';
    const languageInstruction = language === 'ar'
      ? 'Write everything in Arabic (العربية). All questions, options, and fun facts must be in Arabic.'
      : 'Write everything in English.';

    const prompt = `Generate ${count} fun trivia questions about ${categoryContext} for ${audienceLevel}.

${languageInstruction}

Each question should:
- Be educational and fun
- Have 4 multiple choice options
- Include a brief fun fact related to the answer
- Focus on Aleppo's beautiful heritage, food, culture, and history
- STRICTLY NO politics, war, government, or anything controversial - only positive, fun, educational content
- IMPORTANT: Never mention pork, alcohol, or anything forbidden (haram) in Islam. Only halal food and drinks.

Return as JSON array with this exact structure:
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "funFact": "An interesting fact about the correct answer"
  }
]

Only return the JSON array, no other text.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a friendly trivia game host who creates fun, educational questions about Aleppo, Syria - its amazing food, rich culture, ancient history, and traditions. You always generate valid JSON responses. You NEVER mention politics, war, government, or anything controversial. You never mention pork, alcohol, or anything haram. All content is positive, fun, and educational about this beautiful ancient city.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    const questions = JSON.parse(jsonMatch[0]);

    // Add unique IDs to each question
    const questionsWithIds = questions.map((q: Record<string, unknown>, index: number) => ({
      ...q,
      id: `${Date.now()}-${index}`,
    }));

    return NextResponse.json({ questions: questionsWithIds });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
