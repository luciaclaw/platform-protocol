/**
 * User confirmation types for high-risk tool actions.
 *
 * When the agent wants to perform an action that requires user approval
 * (e.g., sending an email, making a purchase), it sends a confirmation
 * request. The user approves or denies via the PWA.
 */
import type { MessageEnvelope } from './messages.js';
import type { ToolCallPayload } from './tools.js';
/** Risk level for a confirmation request */
export type ConfirmationRisk = 'low' | 'medium' | 'high';
/** Agent requests user confirmation for a tool action */
export interface ToolConfirmRequestPayload {
    /** The tool call that needs approval */
    toolCall: ToolCallPayload;
    /** Human-readable description of what the action will do */
    description: string;
    /** Risk level assessment */
    risk: ConfirmationRisk;
    /** Timeout in milliseconds (action cancelled if user doesn't respond) */
    timeoutMs: number;
}
export type ToolConfirmRequestMessage = MessageEnvelope<ToolConfirmRequestPayload> & {
    type: 'tool.confirm.request';
};
/** User responds to a confirmation request */
export interface ToolConfirmResponsePayload {
    /** The callId being approved or denied */
    callId: string;
    /** Whether the user approved the action */
    approved: boolean;
    /** Optional user note (e.g., "go ahead" or reason for denial) */
    note?: string;
}
export type ToolConfirmResponseMessage = MessageEnvelope<ToolConfirmResponsePayload> & {
    type: 'tool.confirm.response';
};
//# sourceMappingURL=confirmations.d.ts.map