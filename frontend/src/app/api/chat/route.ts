import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI with server-side API key
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

5. Special Commands:
- When users mention "transfer" or ask about transferring tokens, include the word "transfer" in your response
- When users mention "swap" or ask about swapping tokens, include the word "swap" in your response

Keep responses concise, practical, and focused on actionable trading advice.
For transfer/swap requests, acknowledge the request and guide them to use the form that will appear.

Current Market Context:
- Trading pair: EGLD/USDC
- Current price: Around $45
- Market: Highly liquid cryptocurrency
- Trading style: Spot trading with grid strategy support`;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

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
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from AI',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 