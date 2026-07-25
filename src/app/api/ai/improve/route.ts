import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { streamText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { sessionOptions, type SessionData } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) throw new Error('Unauthorized');
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { html } = await req.json();

  if (!html) {
    return NextResponse.json({ error: 'html is required' }, { status: 400 });
  }

  const prompt = `You are an editor for Arrow Taxi, a taxi and private-hire company in Bangor, North Wales.

Improve the following HTML content: fix grammar, improve clarity, tighten the prose, and ensure a professional yet friendly tone. Keep the same structure and HTML tags. Do NOT change the meaning or add new topics.

Output ONLY the improved HTML — no explanation, no markdown fences.

Content:
${html}`;

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    prompt,
  });

  return result.toTextStreamResponse();
}
