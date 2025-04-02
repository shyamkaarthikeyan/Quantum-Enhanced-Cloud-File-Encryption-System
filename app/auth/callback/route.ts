import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code'); // Get the confirmation code from the URL

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Email verification failed:', error.message);
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=${error.message}`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`); // Redirect to dashboard after successful verification
}
