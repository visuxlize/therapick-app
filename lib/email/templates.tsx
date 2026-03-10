import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface WelcomeEmailProps {
  email: string;
  name: string;
  position: number;
  referralCode: string;
}

export async function sendWelcomeEmail({
  email,
  name,
  position,
  referralCode,
}: WelcomeEmailProps) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping welcome email");
    return;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://therapick.com";

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Therapick <onboarding@resend.dev>",
    to: email,
    subject: "You're on the Therapick waitlist",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          h1 { color: #4CAF50; font-size: 28px; margin-bottom: 8px; }
          .position-card { background: #F7FAF7; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; }
          .position-number { font-size: 48px; font-weight: bold; color: #4CAF50; }
          .info-box { background: #FFF8E1; border-radius: 16px; padding: 20px; margin: 30px 0; }
          .footer { color: #666; font-size: 14px; text-align: center; margin-top: 40px; padding-top: 40px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Therapick</h1>
            <p style="color: #666; font-size: 18px;">You're officially on the waitlist</p>
          </div>
          <div class="position-card">
            <p style="color: #666; margin-bottom: 10px;">Your position in line:</p>
            <div class="position-number">#${position}</div>
          </div>
          <div class="info-box">
            <h3 style="margin-top: 0;">What happens next?</h3>
            <ul style="color: #666; line-height: 1.8; padding-left: 20px;">
              <li>We'll send you updates as we build Therapick</li>
              <li>You'll be first to know when we launch</li>
              <li>Early access to the iOS app (Q3 2026)</li>
              <li>3 months of Premium features free</li>
            </ul>
          </div>
          <p style="text-align: center; color: #666;">Questions? Just reply to this email anytime.</p>
          <div class="footer">
            <p><strong>Therapick</strong> - Mental Health Discovery Made Easy</p>
            <p>Designed to give you back your time.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
