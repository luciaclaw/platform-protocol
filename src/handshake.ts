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

import type { MessageEnvelope } from './messages.js';
import type { AttestationReport } from './attestation.js';

/** Step 1: Client sends its ECDH public key */
export interface HandshakeInitPayload {
  /** ECDH P-256 public key in SPKI format, base64-encoded */
  clientPublicKey: string;
  /** Protocol version the client supports */
  protocolVersion: string;
}

export type HandshakeInitMessage = MessageEnvelope<HandshakeInitPayload> & {
  type: 'handshake.init';
};

/** Step 2: Server responds with its public key and attestation */
export interface HandshakeResponsePayload {
  /** ECDH P-256 public key in SPKI format, base64-encoded */
  serverPublicKey: string;
  /** Protocol version the server supports */
  protocolVersion: string;
  /** TEE attestation report proving server identity */
  attestation: AttestationReport;
}

export type HandshakeResponseMessage =
  MessageEnvelope<HandshakeResponsePayload> & {
    type: 'handshake.response';
  };

/** Step 3: Client confirms handshake (sent encrypted with derived AES-GCM key) */
export interface HandshakeCompletePayload {
  /** Confirmation that the client has derived the shared key */
  status: 'ok';
}

export type HandshakeCompleteMessage =
  MessageEnvelope<HandshakeCompletePayload> & {
    type: 'handshake.complete';
  };

/** Current protocol version */
export const PROTOCOL_VERSION = '0.2.0';
