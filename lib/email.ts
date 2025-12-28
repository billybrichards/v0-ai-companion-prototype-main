import { Resend } from 'resend';

const resend = new Resend(process.env.ANPLEXA_RESEND_API_KEY);

const FROM_EMAIL = 'Anplexa <noreply@updates.anplexa.com>';
const SUPPORT_EMAIL = 'support@updates.anplexa.com';

export async function sendWelcomeEmail(to: string, name?: string) {
  const displayName = name || 'there';
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to Anplexa',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #121212; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #121212; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Welcome to Anplexa</h1>
                      <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">The Private Pulse</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Hi ${displayName},
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Welcome to Anplexa — your private AI companion for meaningful conversations. We're glad you're here.
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        This is a safe space where you can talk freely without judgement. Whether you need someone to listen, want to explore your thoughts, or just fancy a chat — we're here for you.
                      </p>
                      <p style="margin: 0 0 30px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        If you have any questions, issues, or feedback, simply reply to this email. We'd love to hear from you.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center">
                            <a href="https://anplexa.com/dash" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">
                              Start Chatting
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; border-top: 1px solid #333; text-align: center;">
                      <p style="margin: 0; color: #888; font-size: 12px;">
                        © 2025 Anplexa. Made with care in the UK 🇬🇧
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      replyTo: SUPPORT_EMAIL,
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error sending welcome email:', err);
    return { success: false, error: err };
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string, name?: string) {
  const displayName = name || 'there';
  const resetUrl = `https://anplexa.com/reset-password?token=${resetToken}`;
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Reset your Anplexa password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #121212; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #121212; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Password Reset</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Hi ${displayName},
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        We received a request to reset your Anplexa password. Click the button below to choose a new password:
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">
                              Reset Password
                            </a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 20px 0 0; color: #888; font-size: 14px; line-height: 1.6;">
                        This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; border-top: 1px solid #333; text-align: center;">
                      <p style="margin: 0; color: #888; font-size: 12px;">
                        © 2025 Anplexa. Made with care in the UK 🇬🇧
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      replyTo: SUPPORT_EMAIL,
    });

    if (error) {
      console.error('Failed to send password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error sending password reset email:', err);
    return { success: false, error: err };
  }
}

export async function sendDataExportEmail(to: string, name?: string) {
  const displayName = name || 'there';
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Your Anplexa data export is ready',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #121212; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #121212; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Data Export Complete</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Hi ${displayName},
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        As requested, we've prepared an export of your personal data from Anplexa. Your download should have started automatically.
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        This export includes your account information, preferences, and conversation history in compliance with GDPR regulations.
                      </p>
                      <p style="margin: 0; color: #888; font-size: 14px; line-height: 1.6;">
                        If you didn't request this export, please contact us immediately by replying to this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; border-top: 1px solid #333; text-align: center;">
                      <p style="margin: 0; color: #888; font-size: 12px;">
                        © 2025 Anplexa. Made with care in the UK 🇬🇧
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      replyTo: SUPPORT_EMAIL,
    });

    if (error) {
      console.error('Failed to send data export email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error sending data export email:', err);
    return { success: false, error: err };
  }
}

export async function sendAccountDeletionEmail(to: string, name?: string) {
  const displayName = name || 'there';
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Your Anplexa account has been deleted',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #121212; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #121212; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Account Deleted</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Hi ${displayName},
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Your Anplexa account has been permanently deleted as requested. All your personal data, including conversation history, has been removed from our systems.
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        We're sorry to see you go. If you ever want to come back, you're always welcome to create a new account.
                      </p>
                      <p style="margin: 0; color: #888; font-size: 14px; line-height: 1.6;">
                        If you didn't request this deletion, please contact us immediately by replying to this email.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; border-top: 1px solid #333; text-align: center;">
                      <p style="margin: 0; color: #888; font-size: 12px;">
                        © 2025 Anplexa. Made with care in the UK 🇬🇧
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      replyTo: SUPPORT_EMAIL,
    });

    if (error) {
      console.error('Failed to send account deletion email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error sending account deletion email:', err);
    return { success: false, error: err };
  }
}

export async function sendSubscriptionConfirmationEmail(to: string, name?: string) {
  const displayName = name || 'there';
  
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Welcome to Anplexa PRO!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #121212; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #121212; padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%);">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">👑 Welcome to PRO!</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Hi ${displayName},
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Thank you for upgrading to Anplexa PRO! You now have unlimited access to your private AI companion.
                      </p>
                      <p style="margin: 0 0 20px; color: #E0E1DD; font-size: 16px; line-height: 1.6;">
                        Your PRO benefits include:
                      </p>
                      <ul style="margin: 0 0 20px; padding-left: 20px; color: #E0E1DD; font-size: 16px; line-height: 1.8;">
                        <li>Unlimited conversations</li>
                        <li>Priority response times</li>
                        <li>Full conversation history</li>
                        <li>Premium support</li>
                      </ul>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="https://anplexa.com/dash" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #7B2CBF 0%, #9D4EDD 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px;">
                              Start Chatting
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; border-top: 1px solid #333; text-align: center;">
                      <p style="margin: 0; color: #888; font-size: 12px;">
                        © 2025 Anplexa. Made with care in the UK 🇬🇧
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      replyTo: SUPPORT_EMAIL,
    });

    if (error) {
      console.error('Failed to send subscription confirmation email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Error sending subscription confirmation email:', err);
    return { success: false, error: err };
  }
}
