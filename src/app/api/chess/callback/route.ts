import { NextRequest, NextResponse } from 'next/server';

// This route handles the OAuth redirect from chess.com
// You will need to implement token exchange and user session logic here

export async function GET(request: NextRequest) {
  // Example: parse code and state from query params
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // TODO: Exchange code for access token with chess.com
  // TODO: Authenticate user/session, redirect or respond as needed

  if (!code) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
  }

  // For now, just return a success message for validation
  return NextResponse.json({ success: true, code, state });
}
