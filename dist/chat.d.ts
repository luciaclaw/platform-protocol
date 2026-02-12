/**
 * Chat message types for user ↔ agent conversation.
 */
import type { MessageEnvelope } from './messages.js';
import type { ToolCallPayload } from './tools.js';
/** Role of the message sender */
export type ChatRole = 'user' | 'assistant' | 'system';
/** MIME types allowed for attachments */
export type AttachmentMimeType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' | 'application/pdf' | 'text/plain';
/** A file attachment on a chat message */
export interface Attachment {
    /** Original filename */
    filename: string;
    /** MIME type of the file */
    mimeType: AttachmentMimeType;
    /** Base64-encoded file content */
    data: string;
    /** File size in bytes (before base64 encoding) */
    size: number;
}
/** A single chat message in conversation history */
export interface ChatMessage {
    /** Unique message ID (matches envelope ID for the originating message) */
    messageId: string;
    /** Who sent this message */
    role: ChatRole;
    /** Text content */
    content: string;
    /** Tool calls included in this message (assistant only) */
    toolCalls?: ToolCallPayload[];
    /** File attachments (user only) */
    attachments?: Attachment[];
    /** Unix timestamp in milliseconds */
    timestamp: number;
}
/** User sends a chat message */
export interface ChatMessagePayload {
    /** The text content from the user */
    content: string;
    /** Model ID to use for this message (optional, uses current default if omitted) */
    model?: string;
    /** Conversation ID to send this message in (optional, uses current conversation if omitted) */
    conversationId?: string;
    /** File attachments (images, PDFs, text files) */
    attachments?: Attachment[];
}
export type ChatMessageMessage = MessageEnvelope<ChatMessagePayload> & {
    type: 'chat.message';
};
/** Agent sends a complete response */
export interface ChatResponsePayload {
    /** The full response content */
    content: string;
    /** Tool calls the agent wants to execute (if any) */
    toolCalls?: ToolCallPayload[];
    /** Model ID that generated this response */
    model?: string;
}
export type ChatResponseMessage = MessageEnvelope<ChatResponsePayload> & {
    type: 'chat.response';
};
/** Streaming chunk from agent */
export interface ChatStreamChunkPayload {
    /** The ID of the response this chunk belongs to */
    responseId: string;
    /** Partial content delta */
    delta: string;
    /** Chunk sequence number (0-indexed) */
    index: number;
}
export type ChatStreamChunkMessage = MessageEnvelope<ChatStreamChunkPayload> & {
    type: 'chat.stream.chunk';
};
/** End of streaming response */
export interface ChatStreamEndPayload {
    /** The ID of the response that completed */
    responseId: string;
    /** Full accumulated content */
    content: string;
    /** Tool calls included in the final response (if any) */
    toolCalls?: ToolCallPayload[];
}
export type ChatStreamEndMessage = MessageEnvelope<ChatStreamEndPayload> & {
    type: 'chat.stream.end';
};
//# sourceMappingURL=chat.d.ts.map