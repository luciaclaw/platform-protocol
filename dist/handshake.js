/**
 * E2E ECDH Handshake message types.
 *
 * 3-step handshake:
 * 1. Client → Server: handshake.init (client ECDH P-256 public key)
 * 2. Server → Client: handshake.response (server ECDH public key + attestation)
 * 3. Client → Server: handshake.complete (encrypted confirmation with derived key)
 *
 * After step 3, all further messages use EncryptedEnvelope.
 */
/** Current protocol version */
export const PROTOCOL_VERSION = '0.2.0';
//# sourceMappingURL=handshake.js.map