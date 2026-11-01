import { IncidentAlertPayload } from './provider';
import { emailService } from './email';
import { smsService } from './sms';
import { pushService } from './push';
import { getAdminClient } from '../supabase/admin';

export async function dispatchIncidentAlerts(
  payload: IncidentAlertPayload,
  recipients: Array<{
    profileId: string;
    email: string;
    fullName?: string;
    phone?: string | null;
    pushSubscription?: unknown;
    notifyEmail: boolean;
    notifyPush: boolean;
    notifySms: boolean;
  }>
) {
  const supabase = getAdminClient();
  const results = [];

  const subject = `[CRITICAL ALERT] Eco Class: ${payload.severity.toUpperCase()} in ${payload.classroomName}`;
  const htmlBody = `
    <div style="font-family: sans-serif; padding: 16px; border: 1px solid #e11d48; border-radius: 8px;">
      <h2 style="color: #e11d48; margin-top: 0;">Emergency Incident Detected</h2>
      <p><strong>Room:</strong> ${payload.classroomName}</p>
      <p><strong>Severity:</strong> <span style="text-transform: uppercase; color: red;">${payload.severity}</span></p>
      <p><strong>Issue:</strong> ${payload.title}</p>
      <p><strong>Description:</strong> ${payload.description}</p>
      <p><strong>Power Cut Action:</strong> ${payload.powerCutApplied ? 'AUTOMATIC POWER CUT TRIPPED' : 'Power intact'}</p>
      <p><strong>Timestamp:</strong> ${payload.occurredAt}</p>
      <hr />
      <p style="font-size: 12px; color: #666;">This alert was automatically routed to department staff and assigned technicians.</p>
    </div>
  `;
  const smsBody = `[ECO CLASS ALERT] ${payload.severity.toUpperCase()}: ${payload.title} in ${payload.classroomName}. Power cut: ${payload.powerCutApplied ? 'YES' : 'NO'}. Check dashboard.`;

  for (const recipient of recipients) {
    if (recipient.notifyEmail && recipient.email) {
      const emailRes = await emailService.sendEmail(recipient.email, subject, htmlBody);
      results.push({ recipientId: recipient.profileId, channel: 'email', ...emailRes });

      try {
        await supabase.from('incident_notifications').insert({
          incident_id: payload.incidentId,
          recipient_id: recipient.profileId,
          channel: 'email',
          status: emailRes.success ? 'sent' : 'failed',
          sent_at: emailRes.success ? new Date().toISOString() : null,
          error_message: emailRes.error || null,
        });
      } catch (err) {
        console.warn('Failed to record incident notification to DB:', err);
      }
    }

    if (recipient.notifyPush && recipient.pushSubscription) {
      const pushRes = await pushService.sendPush(
        recipient.pushSubscription,
        `Emergency Alert: ${payload.classroomName}`,
        payload.title,
        { incidentId: payload.incidentId }
      );
      results.push({ recipientId: recipient.profileId, channel: 'push', ...pushRes });
    }

    if (recipient.notifySms && recipient.phone) {
      const smsRes = await smsService.sendSms(recipient.phone, smsBody);
      results.push({ recipientId: recipient.profileId, channel: 'sms', ...smsRes });
    }
  }

  return results;
}
