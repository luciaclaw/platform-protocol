/**
 * Core message envelope types for the Lucia Agent Protocol.
 *
 * Every message over the WebSocket uses a MessageEnvelope wrapper.
 * After E2E handshake completes, all envelopes are transmitted as
 * EncryptedEnvelope (AES-GCM encrypted ciphertext).
 */
/** Type guard for encrypted envelopes */
export function isEncryptedEnvelope(msg) {
    return msg.type === 'encrypted';
}
//# sourceMappingURL=messages.js.map