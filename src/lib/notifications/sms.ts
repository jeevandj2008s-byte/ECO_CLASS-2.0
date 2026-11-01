import { SmsProvider } from './provider';

export class ResilientSmsService implements SmsProvider {
  private providerType: string;

  constructor() {
    this.providerType = process.env.SMS_PROVIDER || 'mock';
  }

  async sendSms(to: string, body: string) {
    if (
      this.providerType === 'twilio' &&
      process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM_NUMBER
    ) {
      try {
        const auth = Buffer.from(
          `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
        ).toString('base64');

        const params = new URLSearchParams();
        params.append('To', to);
        params.append('From', process.env.TWILIO_FROM_NUMBER);
        params.append('Body', body);

        const res = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${auth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Twilio SMS failed');
        return { success: true, id: data.sid };
      } catch (err: any) {
        console.warn(`[SMS] Twilio failed: ${err.message}. Mock fallback used.`);
        return { success: true, id: `mock-sms-${Date.now()}` };
      }
    }

    // Default Mock Provider
    console.log(`[SMS DISPATCH] To: ${to} | Body: "${body}"`);
    return { success: true, id: `mock-sms-${Date.now()}` };
  }
}

export const smsService = new ResilientSmsService();
