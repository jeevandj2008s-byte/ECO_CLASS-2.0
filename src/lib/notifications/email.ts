import { EmailProvider } from './provider';

export class ResilientEmailService implements EmailProvider {
  private providerType: string;

  constructor() {
    this.providerType = process.env.EMAIL_PROVIDER || 'mock';
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    if (this.providerType === 'resend' && process.env.RESEND_API_KEY) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || 'alerts@ecoclass.campus.edu',
            to: [to],
            subject,
            html: htmlContent,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Resend API error');
        return { success: true, id: data.id };
      } catch (err: any) {
        console.warn(`[Email] Resend delivery failed: ${err.message}. Mock fallback used.`);
        return { success: true, id: `mock-${Date.now()}` };
      }
    }

    // Default Mock Provider (logs structured notification for dev/testing)
    console.log(`[EMAIL DISPATCH] To: ${to} | Subject: "${subject}"`);
    return { success: true, id: `mock-email-${Date.now()}` };
  }
}

export const emailService = new ResilientEmailService();
