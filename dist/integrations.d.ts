/**
 * Integration registry types for supported third-party services.
 *
 * The CVM maintains a static registry of integrations it supports.
 * The PWA queries this to render the settings UI with available
 * services, their auth requirements, and capabilities.
 */
import type { MessageEnvelope } from './messages.js';
/** Information about a supported integration */
export interface IntegrationInfo {
    /** Service identifier (e.g., 'gmail', 'google_calendar', 'slack') */
    service: string;
    /** Human-readable display name */
    name: string;
    /** Short description of what this integration does */
    description: string;
    /** Authentication method required */
    authType: 'oauth' | 'api_key' | 'token';
    /** OAuth scopes required (for OAuth integrations) */
    requiredScopes?: string[];
    /** List of tool capabilities this integration provides */
    capabilities: string[];
    /** Whether this integration is currently connected/authenticated */
    connected: boolean;
    /** Icon identifier for the PWA to render */
    icon?: string;
}
/** Request the list of available integrations */
export interface IntegrationsListPayload {
    /** Optional: only return integrations matching this filter */
    filter?: 'all' | 'connected' | 'available';
}
export type IntegrationsListMessage = MessageEnvelope<IntegrationsListPayload> & {
    type: 'integrations.list';
};
/** Response with the list of integrations */
export interface IntegrationsResponsePayload {
    /** Available integrations and their status */
    integrations: IntegrationInfo[];
}
export type IntegrationsResponseMessage = MessageEnvelope<IntegrationsResponsePayload> & {
    type: 'integrations.response';
};
//# sourceMappingURL=integrations.d.ts.map