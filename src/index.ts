/**
 * @luciaclaw/protocol — Lucia Agent Protocol v0.1
 *
 * Type definitions for E2E encrypted communication between
 * the PWA client and the Agent CVM.
 */

// Message envelope
export type {
  MessageType,
  MessageEnvelope,
  EncryptedEnvelope,
} from './messages.js';
export { isEncryptedEnvelope } from './messages.js';

// E2E Handshake
export type {
  HandshakeInitPayload,
  HandshakeInitMessage,
  HandshakeResponsePayload,
  HandshakeResponseMessage,
  HandshakeCompletePayload,
  HandshakeCompleteMessage,
} from './handshake.js';
export { PROTOCOL_VERSION } from './handshake.js';

// Chat
export type {
  ChatRole,
  ChatMessage,
  ChatMessagePayload,
  ChatMessageMessage,
  ChatResponsePayload,
  ChatResponseMessage,
  ChatStreamChunkPayload,
  ChatStreamChunkMessage,
  ChatStreamEndPayload,
  ChatStreamEndMessage,
} from './chat.js';

// Tool calls
export type {
  ToolCallPayload,
  ToolCallMessage,
  ToolResultPayload,
  ToolResultMessage,
} from './tools.js';

// Confirmations
export type {
  ConfirmationRisk,
  ToolConfirmRequestPayload,
  ToolConfirmRequestMessage,
  ToolConfirmResponsePayload,
  ToolConfirmResponseMessage,
} from './confirmations.js';

// Errors
export type { ErrorPayload, ErrorMessage } from './errors.js';
export { ErrorCode } from './errors.js';

// Models
export type {
  ModelInfo,
  ModelsListPayload,
  ModelsListMessage,
  ModelsResponsePayload,
  ModelsResponseMessage,
} from './models.js';

// Attestation
export type {
  TdxAttestation,
  NvidiaCcAttestation,
  AttestationReport,
} from './attestation.js';
