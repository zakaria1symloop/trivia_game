import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const categoryPrompts = {
  food: "traditional Middle Eastern and Syrian/Aleppo cuisine, famous dishes like hummus, falafel, kibbeh, shawarma, kebabs, mezze, and cooking techniques",
  sweets: "Arabic and Middle Eastern sweets and desserts like baklava, kunafa, maamoul, halva, Turkish delight, and traditional pastries",
  culture: "Middle Eastern and Syrian culture, traditions, customs, hospitality, art, music, dance, and daily life",
  history: "Middle Eastern history, ancient civilizations, the Silk Road, famous cities like Damascus and Aleppo, architecture, and historical figures",
  spices: "Middle Eastern spices like za'atar, sumac, cumin, cardamom, saffron, baharat, and their uses in cooking",
  religion: "Islamic traditions, practices, holidays like Ramadan and Eid, the significance of mosques, and interfaith aspects of Middle Eastern culture",
  mixed: "a mix of Middle Eastern food, sweets, culture, history, spices, and traditions",
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
- Be appropriate for all audiences (no politics, nothing controversial)
- Focus on positive, interesting aspects of Middle Eastern culture
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
          content: 'You are a friendly trivia game host who creates fun, educational questions about Middle Eastern culture, food, and history. You always generate valid JSON responses. You never mention pork, alcohol, or anything haram (forbidden in Islam). All food references must be halal.',
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
