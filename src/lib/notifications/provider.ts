export interface NotificationRecipient {
  profileId: string;
  email: string;
  fullName?: string;
  phone?: string | null;
  pushSubscription?: unknown;
}

export interface IncidentAlertPayload {
  incidentId: string;
  classroomName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  powerCutApplied: boolean;
  occurredAt: string;
}

export interface EmailProvider {
  sendEmail(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; id?: string; error?: string }>;
}

export interface SmsProvider {
  sendSms(to: string, body: string): Promise<{ success: boolean; id?: string; error?: string }>;
}

export interface PushProvider {
  sendPush(subscription: unknown, title: string, body: string, data?: Record<string, unknown>): Promise<{ success: boolean; error?: string }>;
}
