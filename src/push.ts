/**
 * Push notification types for Web Push API integration.
 *
 * The PWA subscribes to push notifications via the browser's Push API
 * and sends the subscription to the CVM over the E2E encrypted channel.
 * The CVM uses the subscription to send notifications when needed
 * (e.g., tool completion, async task updates, confirmation requests).
 */

import type { MessageEnvelope } from './messages.js';

/** Subscribe to push notifications — sends browser Push API subscription to CVM */
export interface PushSubscribePayload {
  /** The Push API subscription object */
  subscription: {
    /** Push service endpoint URL */
    endpoint: string;
    /** Expiration time of the subscription (Unix ms), or null */
    expirationTime: number | null;
    /** Authentication keys */
    keys: {
      /** Base64url-encoded P-256 ECDH public key */
      p256dh: string;
      /** Base64url-encoded authentication secret */
      auth: string;
    };
  };
}

export type PushSubscribeMessage = MessageEnvelope<PushSubscribePayload> & {
  type: 'push.subscribe';
};

/** Unsubscribe from push notifications */
export interface PushUnsubscribePayload {
  /** The endpoint to unsubscribe (matches subscription.endpoint) */
  endpoint: string;
}

export type PushUnsubscribeMessage =
  MessageEnvelope<PushUnsubscribePayload> & {
    type: 'push.unsubscribe';
  };
