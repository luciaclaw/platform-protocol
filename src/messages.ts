/**
 * Core message envelope types for the Lucia Agent Protocol.
 *
 * Every message over the WebSocket uses a MessageEnvelope wrapper.
 * After E2E handshake completes, all envelopes are transmitted as
 * EncryptedEnvelope (AES-GCM encrypted ciphertext).
 */

/** All valid message type strings */
export type MessageType =
  // Handshake
  | 'handshake.init'
  | 'handshake.response'
  | 'handshake.complete'
  // Chat
  | 'chat.message'
  | 'chat.response'
  | 'chat.stream.chunk'
  | 'chat.stream.end'
  // Tool calls
  | 'tool.call'
  | 'tool.result'
  | 'tool.confirm.request'
  | 'tool.confirm.response'
  // Credentials
  | 'credentials.set'
  | 'credentials.delete'
  | 'credentials.list'
  | 'credentials.response'
  // Conversations
  | 'conversations.list'
  | 'conversations.load'
  | 'conversations.response'
  | 'conversations.delete'
  // OAuth
  | 'oauth.init'
  | 'oauth.callback'
  | 'oauth.status'
  // Push notifications
  | 'push.subscribe'
  | 'push.unsubscribe'
  // Integrations
  | 'integrations.list'
  | 'integrations.response'
  // Schedules
  | 'schedule.create'
  | 'schedule.update'
  | 'schedule.delete'
  | 'schedule.list'
  | 'schedule.response'
  | 'schedule.executed'
  // Models
  | 'models.list'
  | 'models.response'
  // Encrypted wrapper
  | 'encrypted'
  // Errors
  | 'error';

/** Base message envelope — every WebSocket message uses this shape */
export interface MessageEnvelope<T = unknown> {
  /** UUID v4 message identifier */
  id: string;
  /** Message type discriminator */
  type: MessageType;
  /** Unix timestamp in milliseconds */
  timestamp: number;
  /** Type-specific payload */
  payload: T;
}

/** Encrypted envelope — wraps any MessageEnvelope after E2E handshake */
export interface EncryptedEnvelope {
  id: string;
  type: 'encrypted';
  timestamp: number;
  payload: {
    /** Base64-encoded 12-byte AES-GCM initialization vector */
    iv: string;
    /** Base64-encoded AES-GCM ciphertext of the inner MessageEnvelope JSON */
    ciphertext: string;
  };
}

/** Type guard for encrypted envelopes */
export function isEncryptedEnvelope(
  msg: MessageEnvelope
): msg is EncryptedEnvelope {
  return msg.type === 'encrypted';
}
