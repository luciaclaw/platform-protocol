import type { MessageEnvelope } from './messages.js';
/** Memory categories for classification */
export type MemoryCategory = 'fact' | 'preference' | 'event' | 'decision' | 'relationship' | 'general';
/** A single stored memory entry */
export interface MemoryEntry {
    id: string;
    content: string;
    category: MemoryCategory;
    /** Source conversation ID */
    conversationId?: string;
    createdAt: number;
    lastAccessedAt?: number;
    /** Number of times this memory was retrieved */
    accessCount: number;
}
/** List memories (paginated, optionally filtered) */
export interface MemoryListPayload {
    category?: MemoryCategory;
    limit?: number;
    offset?: number;
}
export type MemoryListMessage = MessageEnvelope<MemoryListPayload> & {
    type: 'memory.list';
};
/** Search memories by text query */
export interface MemorySearchPayload {
    query: string;
    category?: MemoryCategory;
    limit?: number;
}
export type MemorySearchMessage = MessageEnvelope<MemorySearchPayload> & {
    type: 'memory.search';
};
/** Delete a memory */
export interface MemoryDeletePayload {
    memoryId: string;
}
export type MemoryDeleteMessage = MessageEnvelope<MemoryDeletePayload> & {
    type: 'memory.delete';
};
/** Response containing memories */
export interface MemoryResponsePayload {
    memories: MemoryEntry[];
    total?: number;
}
export type MemoryResponseMessage = MessageEnvelope<MemoryResponsePayload> & {
    type: 'memory.response';
};
//# sourceMappingURL=persistent-memory.d.ts.map