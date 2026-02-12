/**
 * Credential management types for secure credential storage in the CVM vault.
 *
 * Credentials are stored encrypted inside the TEE — never on the client device.
 * The PWA sends credential data over the E2E encrypted channel; the CVM
 * encrypts at rest with TDX-sealed keys.
 */

import type { MessageEnvelope } from './messages.js';

/** Metadata about a stored credential (never includes the secret value) */
export interface CredentialInfo {
  /** Service identifier (e.g., 'gmail', 'slack', 'openai') */
  service: string;
  /** Human-readable label (e.g., 'Work Gmail', 'Personal Slack') */
  label: string;
  /** Credential type */
  credentialType: 'oauth' | 'api_key' | 'token';
  /** Whether the credential is currently valid/connected */
  connected: boolean;
  /** Unix timestamp when the credential was stored */
  createdAt: number;
  /** Unix timestamp of last successful use */
  lastUsedAt?: number;
  /** OAuth scopes granted (for OAuth credentials) */
  scopes?: string[];
}

/** Store or update a credential in the CVM vault */
export interface CredentialSetPayload {
  /** Service identifier */
  service: string;
  /** Human-readable label */
  label: string;
  /** Credential type */
  credentialType: 'oauth' | 'api_key' | 'token';
  /** The secret value (API key, token, etc.) — encrypted in transit via E2E channel */
  value: string;
  /** OAuth scopes (for OAuth credentials) */
  scopes?: string[];
}

export type CredentialSetMessage = MessageEnvelope<CredentialSetPayload> & {
  type: 'credentials.set';
};

/** Delete a credential from the CVM vault */
export interface CredentialDeletePayload {
  /** Service identifier of the credential to delete */
  service: string;
}

export type CredentialDeleteMessage =
  MessageEnvelope<CredentialDeletePayload> & {
    type: 'credentials.delete';
  };

/** Request a list of stored credentials (metadata only, no secret values) */
export interface CredentialListPayload {
  /** Optional filter by service */
  service?: string;
}

export type CredentialListMessage = MessageEnvelope<CredentialListPayload> & {
  type: 'credentials.list';
};

/** Response with credential metadata */
export interface CredentialResponsePayload {
  /** List of credential metadata entries */
  credentials: CredentialInfo[];
}

export type CredentialResponseMessage =
  MessageEnvelope<CredentialResponsePayload> & {
    type: 'credentials.response';
  };
