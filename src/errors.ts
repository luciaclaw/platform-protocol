/**
 * Error types for the Lucia Agent Protocol.
 */

import type { MessageEnvelope } from './messages.js';

/** Protocol error codes */
export enum ErrorCode {
  /** Generic internal error */
  INTERNAL_ERROR = 1000,
  /** Message failed schema validation */
  INVALID_MESSAGE = 1001,
  /** Unknown message type */
  UNKNOWN_TYPE = 1002,
  /** Handshake failed or not completed */
  HANDSHAKE_FAILED = 2000,
  /** Attestation verification failed */
  ATTESTATION_FAILED = 2001,
  /** Decryption failed (bad key, corrupted ciphertext) */
  DECRYPTION_FAILED = 2002,
  /** Message received before handshake completed */
  NOT_AUTHENTICATED = 2003,
  /** Tool call failed */
  TOOL_ERROR = 3000,
  /** Tool call denied by user */
  TOOL_DENIED = 3001,
  /** Tool call timed out waiting for confirmation */
  TOOL_TIMEOUT = 3002,
  /** LLM inference failed */
  INFERENCE_ERROR = 4000,
  /** Rate limit exceeded */
  RATE_LIMITED = 5000,
}

/** Error message payload */
export interface ErrorPayload {
  /** Machine-readable error code */
  code: ErrorCode;
  /** Human-readable error message */
  message: string;
  /** The message ID that triggered this error (if applicable) */
  relatedMessageId?: string;
}

export type ErrorMessage = MessageEnvelope<ErrorPayload> & {
  type: 'error';
};
