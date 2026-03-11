import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineString } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();

const notifyEmail = defineString('FEEDBACK_NOTIFY_EMAIL', { default: 'micah@hvconcierge.com' });

const MAIL_COLLECTION = 'mail';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function buildEmailHtml(data) {
  const rating = data.rating ?? 0;
  const name = data.name || 'Anonymous';
  const comment = data.comment || data.initial_comment || '';
  const issueCategory = data.issue_category || '';
  const followUp = data.follow_up_request === true;
  const stars = '★'.repeat(Math.min(5, Math.max(0, rating))) + '☆'.repeat(5 - Math.min(5, Math.max(0, rating)));

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 28px; color: #1a1a1a; margin-bottom: 24px; }
    .section { margin: 24px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #333; }
    .label { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 8px; }
    .value { font-size: 18px; line-height: 1.6; }
    .stars { font-size: 24px; color: #f59e0b; margin: 8px 0; }
    .footer { margin-top: 32px; font-size: 14px; color: #666; }
  </style>
</head>
<body>
  <h1>New Feedback Received</h1>
  <p style="font-size: 16px; color: #666;">A customer has submitted feedback through the HVCS Feedback Hub.</p>

  <div class="section">
    <div class="label">Customer Name</div>
    <div class="value">${escapeHtml(name)}</div>
  </div>

  <div class="section">
    <div class="label">Rating</div>
    <div class="stars">${stars}</div>
    <div class="value">${rating} out of 5 stars</div>
  </div>

  ${comment ? `
  <div class="section">
    <div class="label">Comment / Feedback</div>
    <div class="value">${escapeHtml(comment)}</div>
  </div>
  ` : ''}

  ${issueCategory ? `
  <div class="section">
    <div class="label">Issue Category</div>
    <div class="value">${escapeHtml(issueCategory)}</div>
  </div>
  ` : ''}

  ${followUp ? `
  <div class="section">
    <div class="label">Follow-up Requested</div>
    <div class="value">Yes — please reach out to this customer.</div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Submitted via HVCS Feedback Hub</p>
  </div>
</body>
</html>
  `.trim();
}

export const onFeedbackCreated = onDocumentCreated(
  { document: 'feedback/{feedbackId}', region: 'us-central1' },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;

    try {
      const data = snapshot.data();
      const to = notifyEmail.value();
      if (!to) {
        console.warn('FEEDBACK_NOTIFY_EMAIL not set. Skipping email.');
        return;
      }

      const html = buildEmailHtml(data);
      const name = data.name || 'Anonymous';
      const rating = data.rating ?? 0;

      await getFirestore().collection(MAIL_COLLECTION).add({
        to: [to],
        message: {
          subject: `New feedback: ${name} - ${rating} stars`,
          html,
        },
      });
      console.log('Feedback email queued for', to);
    } catch (err) {
      console.error('Failed to queue feedback email:', err);
      throw err;
    }
  }
);
