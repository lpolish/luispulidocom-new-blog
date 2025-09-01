import { Resend } from 'resend';
import { getSiteUrl } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, name?: string) {
  const siteUrl = getSiteUrl();

  try {
    const { data, error } = await resend.emails.send({
      from: 'Luis Pulido <welcome@luispulido.com>',
      to: email,
      subject: 'Welcome to Luis Pulido\'s Blog!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Welcome${name ? ` ${name}` : ''}!</h1>

          <p style="color: #666; line-height: 1.6;">
            Thank you for joining my blog community! I'm excited to have you here.
          </p>

          <p style="color: #666; line-height: 1.6;">
            You'll receive updates when I publish new content about web development,
            programming, and technology.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${siteUrl}/chess"
               style="background-color: #007bff; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Start Playing Chess
            </a>
          </div>

          <p style="color: #666; line-height: 1.6;">
            If you ever want to unsubscribe, you can do so by clicking the unsubscribe
            link in any of my emails.
          </p>

          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            Luis Pulido
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const siteUrl = getSiteUrl();
  const resetUrl = `${siteUrl}/auth/reset-password?access_token=${resetToken}&type=recovery`;

  try {
    const { data, error } = await resend.emails.send({
      from: 'Luis Pulido <noreply@luispulido.com>',
      to: email,
      subject: 'Reset Your Password - Luis Pulido\'s Blog',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; text-align: center;">Reset Your Password</h1>

          <p style="color: #666; line-height: 1.6;">
            You requested a password reset for your account on Luis Pulido's Blog.
          </p>

          <p style="color: #666; line-height: 1.6;">
            Click the button below to reset your password. This link will expire in 1 hour.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}"
               style="background-color: #28a745; color: white; padding: 12px 24px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color: #666; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email.
            Your password will remain unchanged.
          </p>

          <p style="color: #666; line-height: 1.6;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${resetUrl}" style="color: #007bff; word-break: break-all;">${resetUrl}</a>
          </p>

          <p style="color: #666; line-height: 1.6;">
            Best regards,<br>
            Luis Pulido
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, error };
  }
}