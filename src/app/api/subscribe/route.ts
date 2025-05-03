import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyRecaptcha(token: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });

  const data = await response.json();
  return data.success && data.score >= 0.5;
}

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA token
    const isValid = await verifyRecaptcha(token);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid reCAPTCHA token' },
        { status: 400 }
      );
    }

    // Add contact to Resend audience
    const { data, error } = await resend.contacts.create({
      email,
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      unsubscribed: false,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Send welcome email
    await resend.emails.send({
      from: 'Luis Pulido <updates@luispulido.com>',
      to: email,
      subject: 'Welcome to my newsletter!',
      html: `
        <h2>Thanks for subscribing!</h2>
        <p>You've been added to my newsletter list. You'll receive updates when I publish new content.</p>
        <p>If you ever want to unsubscribe, you can do so by clicking the unsubscribe link in any of my emails.</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 