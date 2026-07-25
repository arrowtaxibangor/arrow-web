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

  const { topic, tone, length } = await req.json();

  if (!topic) {
    return NextResponse.json({ error: 'topic is required' }, { status: 400 });
  }

  const wordTarget =
    length === 'short' ? '150–250 words' : length === 'long' ? '500–700 words' : '300–450 words';

  const toneDesc =
    tone === 'formal'
      ? 'formal and authoritative'
      : tone === 'casual'
        ? 'friendly and conversational'
        : 'professional yet approachable';

  const prompt = `Write a blog section for Arrow Taxi, a taxi and private-hire company based in Bangor, North Wales.

Topic: ${topic}
Tone: ${toneDesc}
Length: ${wordTarget}

Output ONLY the HTML content (one or more <p>, <h2>, <h3>, <ul>, <ol> tags — no <html>, <head>, <body> wrappers). Do not include markdown fences. Make it relevant to local travel, North Wales, Snowdonia, and airport transfers where natural. Start directly with the content.`;

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    prompt,
  });

  return result.toTextStreamResponse();
}
