/**
 * Lightweight tracking utility for Feedback Hub engagement events.
 * Sends events to POST /api/track-event. Stubs cleanly if backend is unavailable.
 */

export type TrackEventName =
  | 'page_open'
  | 'feedback_submitted'
  | 'rating_value'
  | 'click_google'
  | 'click_facebook'
  | 'click_yelp'
  | 'click_social_share';

export interface TrackEventPayload {
  event: TrackEventName;
  token?: string;
  timestamp?: string;
  rating?: number;
  comment?: string;
  issue_category?: string;
  follow_up_request?: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

export async function trackEvent(payload: TrackEventPayload): Promise<void> {
  const body = {
    ...payload,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE}/api/track-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // Stub: log in dev only, don't throw
      if (import.meta.env.DEV) {
        console.debug('[track]', body);
      }
    }
  } catch {
    // Backend may not exist — stub cleanly
    if (import.meta.env.DEV) {
      console.debug('[track] (stub)', body);
    }
  }
}
