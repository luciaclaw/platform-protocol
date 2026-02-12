/**
 * Preferences message types — get/set user preferences from the PWA.
 */

import type { MessageEnvelope } from './messages.js';

/** Set a preference key-value pair */
export interface PreferencesSetPayload {
  key: string;
  value: string;
}

/** Request all preferences (empty payload) */
export interface PreferencesListPayload {}

/** Response with all preferences */
export interface PreferencesResponsePayload {
  preferences: Record<string, string>;
}

export type PreferencesSetMessage = MessageEnvelope<PreferencesSetPayload>;
export type PreferencesListMessage = MessageEnvelope<PreferencesListPayload>;
export type PreferencesResponseMessage = MessageEnvelope<PreferencesResponsePayload>;
