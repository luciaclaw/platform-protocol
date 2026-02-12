/**
 * OAuth flow types for third-party service authentication.
 *
 * OAuth tokens are captured and stored inside the CVM — they never
 * touch the browser. The PWA initiates the flow and receives status
 * updates, but the token exchange happens server-side.
 */
import type { MessageEnvelope } from './messages.js';
/** Initiate an OAuth flow for a service */
export interface OAuthInitPayload {
    /** Service to authenticate (e.g., 'google', 'slack') */
    service: string;
    /** Requested OAuth scopes */
    scopes: string[];
}
export type OAuthInitMessage = MessageEnvelope<OAuthInitPayload> & {
    type: 'oauth.init';
};
/** OAuth callback data — CVM sends this after receiving the OAuth redirect */
export interface OAuthCallbackPayload {
    /** Service that completed authentication */
    service: string;
    /** Whether the OAuth flow succeeded */
    success: boolean;
    /** Error message if flow failed */
    error?: string;
    /** Scopes that were actually granted */
    grantedScopes?: string[];
}
export type OAuthCallbackMessage = MessageEnvelope<OAuthCallbackPayload> & {
    type: 'oauth.callback';
};
/** OAuth status response — current auth state for a service */
export interface OAuthStatusPayload {
    /** Service identifier */
    service: string;
    /** Whether the service is currently authenticated */
    authenticated: boolean;
    /** URL to redirect user to for OAuth authorization */
    authUrl?: string;
    /** Scopes currently authorized */
    scopes?: string[];
    /** When the token expires (Unix ms), if known */
    expiresAt?: number;
}
export type OAuthStatusMessage = MessageEnvelope<OAuthStatusPayload> & {
    type: 'oauth.status';
};
//# sourceMappingURL=oauth.d.ts.map