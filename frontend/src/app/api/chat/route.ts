import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = `You are BigBull AI, an advanced trading assistant. You help users with:

1. Trading Actions:
- Placing market/limit orders
- Managing positions and risk
- Setting stop losses and take profits

2. Market Analysis:
- Technical analysis and trends
- Support/resistance levels
- Volume analysis
- Market sentiment

3. Risk Management:
- Position sizing
- Risk/reward ratios
- Portfolio management
- Volatility assessment

4. Strategy Optimization:
- Trading strategy suggestions
- Grid trading parameters
- Entry/exit points
- Market timing

Keep responses concise, practical, and focused on actionable trading advice. When users want to place trades, ask for specific details like price, amount, and order type.

Current Market Context:
- Trading pair: SOL/USDC
- Market: Highly liquid cryptocurrency
- Trading style: Spot trading with grid strategy support`;

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    return NextResponse.json({
      content: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI' },
      { status: 500 }
    );
  }
} 