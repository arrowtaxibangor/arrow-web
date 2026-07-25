import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { generateText } from 'ai';
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

  const { title, content, type } = await req.json();

  if (!title && !content) {
    return NextResponse.json({ error: 'title or content is required' }, { status: 400 });
  }

  const context = type === 'blog' ? 'blog post' : 'web page';

  const prompt = `You are an SEO specialist for Arrow Taxi, a taxi company in Bangor, North Wales (UK).

Generate SEO metadata for this ${context}.

Title: ${title ?? '(not provided)'}
Content summary: ${content ? content.replace(/<[^>]+>/g, '').slice(0, 600) : '(not provided)'}

Respond with ONLY valid JSON in this exact shape:
{
  "meta_title": "...",
  "meta_description": "...",
  "meta_keywords": "..."
}

Rules:
- meta_title: max 60 characters, include "Arrow Taxi" naturally
- meta_description: 140–160 characters, include a call to action
- meta_keywords: 5–8 comma-separated keywords relevant to North Wales taxi services
- No markdown, no explanation, just the JSON object`;

  const result = await generateText({
    model: anthropic('claude-haiku-4-5-20251001'),
    prompt,
  });

  try {
    const json = JSON.parse(result.text.trim());
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ error: 'AI returned invalid JSON' }, { status: 500 });
  }
}
