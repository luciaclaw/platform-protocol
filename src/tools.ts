/**
 * Tool call and result types.
 *
 * Tools represent actions the agent can take (e.g., send email, search web).
 * Tool calls may require user confirmation before execution.
 */

import type { MessageEnvelope } from './messages.js';

/** A tool call the agent wants to execute */
export interface ToolCallPayload {
  /** Unique ID for this tool call */
  callId: string;
  /** Tool name (e.g., "gmail.send", "calendar.create") */
  name: string;
  /** Tool arguments as a JSON-serializable object */
  arguments: Record<string, unknown>;
}

export type ToolCallMessage = MessageEnvelope<ToolCallPayload> & {
  type: 'tool.call';
};

/** Result of a tool call execution */
export interface ToolResultPayload {
  /** The callId this result corresponds to */
  callId: string;
  /** Whether the tool call succeeded */
  success: boolean;
  /** Result data (on success) */
  result?: unknown;
  /** Error message (on failure) */
  error?: string;
}

export type ToolResultMessage = MessageEnvelope<ToolResultPayload> & {
  type: 'tool.result';
};
