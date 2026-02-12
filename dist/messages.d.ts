/**
 * Core message envelope types for the Lucia Agent Protocol.
 *
 * Every message over the WebSocket uses a MessageEnvelope wrapper.
 * After E2E handshake completes, all envelopes are transmitted as
 * EncryptedEnvelope (AES-GCM encrypted ciphertext).
 */
/** All valid message type strings */
export type MessageType = 'handshake.init' | 'handshake.response' | 'handshake.complete' | 'chat.message' | 'chat.response' | 'chat.stream.chunk' | 'chat.stream.end' | 'tool.call' | 'tool.result' | 'tool.confirm.request' | 'tool.confirm.response' | 'credentials.set' | 'credentials.delete' | 'credentials.list' | 'credentials.response' | 'conversations.list' | 'conversations.load' | 'conversations.response' | 'conversations.delete' | 'oauth.init' | 'oauth.callback' | 'oauth.status' | 'push.subscribe' | 'push.unsubscribe' | 'integrations.list' | 'integrations.response' | 'schedule.create' | 'schedule.update' | 'schedule.delete' | 'schedule.list' | 'schedule.response' | 'schedule.executed' | 'models.list' | 'models.response' | 'memory.list' | 'memory.search' | 'memory.delete' | 'memory.response' | 'encrypted' | 'error';
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
export declare function isEncryptedEnvelope(msg: MessageEnvelope): msg is EncryptedEnvelope;
//# sourceMappingURL=messages.d.ts.map