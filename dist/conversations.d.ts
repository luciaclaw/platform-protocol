/**
 * Conversation management types for persistent memory.
 *
 * Conversations are stored encrypted in the CVM's SQLite database.
 * The PWA can list, load, and delete conversations via these messages.
 */
import type { MessageEnvelope } from './messages.js';
import type { ChatMessage } from './chat.js';
/** Summary of a conversation (for listing, not full history) */
export interface ConversationSummary {
    /** Unique conversation ID */
    id: string;
    /** Conversation title (auto-generated from first message or user-set) */
    title: string;
    /** Number of messages in the conversation */
    messageCount: number;
    /** Unix timestamp when the conversation was created */
    createdAt: number;
    /** Unix timestamp of the last message */
    updatedAt: number;
}
/** Request a list of conversations */
export interface ConversationsListPayload {
    /** Maximum number of conversations to return (default: 50) */
    limit?: number;
    /** Offset for pagination */
    offset?: number;
}
export type ConversationsListMessage = MessageEnvelope<ConversationsListPayload> & {
    type: 'conversations.list';
};
/** Load full message history for a conversation */
export interface ConversationsLoadPayload {
    /** Conversation ID to load */
    conversationId: string;
    /** Maximum messages to return (default: 100) */
    limit?: number;
    /** Message offset for pagination (0 = most recent) */
    offset?: number;
}
export type ConversationsLoadMessage = MessageEnvelope<ConversationsLoadPayload> & {
    type: 'conversations.load';
};
/** Response with conversation data */
export interface ConversationsResponsePayload {
    /** List of conversation summaries (for list requests) */
    conversations?: ConversationSummary[];
    /** Full message history (for load requests) */
    messages?: ChatMessage[];
    /** The conversation ID these messages belong to */
    conversationId?: string;
    /** Total message count for pagination */
    totalMessages?: number;
}
export type ConversationsResponseMessage = MessageEnvelope<ConversationsResponsePayload> & {
    type: 'conversations.response';
};
/** Delete a conversation and all its messages */
export interface ConversationsDeletePayload {
    /** Conversation ID to delete */
    conversationId: string;
}
export type ConversationsDeleteMessage = MessageEnvelope<ConversationsDeletePayload> & {
    type: 'conversations.delete';
};
//# sourceMappingURL=conversations.d.ts.map