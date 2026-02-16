import type { MessageEnvelope } from './messages.js';

/** Memory categories for classification */
export type MemoryCategory =
  | 'fact'        // "User's name is Alex"
  | 'preference'  // "Prefers concise replies"
  | 'event'       // "Had a job interview on Jan 15"
  | 'decision'    // "Decided to use React for the project"
  | 'relationship' // "Works with Sarah on the marketing team"
  | 'general';    // Uncategorized

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
export type MemoryListMessage = MessageEnvelope<MemoryListPayload> & { type: 'memory.list' };

/** Search memories by text query */
export interface MemorySearchPayload {
  query: string;
  category?: MemoryCategory;
  limit?: number;
}
export type MemorySearchMessage = MessageEnvelope<MemorySearchPayload> & { type: 'memory.search' };

/** Delete a memory */
export interface MemoryDeletePayload {
  memoryId: string;
}
export type MemoryDeleteMessage = MessageEnvelope<MemoryDeletePayload> & { type: 'memory.delete' };

/** Export all memories (and optionally preferences) */
export interface MemoryExportPayload {
  includePreferences?: boolean;
}
export type MemoryExportMessage = MessageEnvelope<MemoryExportPayload> & { type: 'memory.export' };

/** Export response with full memory dump */
export interface MemoryExportResponsePayload {
  memories: MemoryEntry[];
  preferences?: Record<string, string>;
  exportedAt: number;
  version: string;
}
export type MemoryExportResponseMessage = MessageEnvelope<MemoryExportResponsePayload> & { type: 'memory.export.response' };

/** Import memories (and optionally preferences) */
export interface MemoryImportPayload {
  data: {
    memories: Array<{ content: string; category: MemoryCategory }>;
    preferences?: Record<string, string>;
  };
  mode: 'merge' | 'replace';
}
export type MemoryImportMessage = MessageEnvelope<MemoryImportPayload> & { type: 'memory.import' };

/** Import response with counts */
export interface MemoryImportResponsePayload {
  imported: number;
  skipped: number;
  total: number;
}
export type MemoryImportResponseMessage = MessageEnvelope<MemoryImportResponsePayload> & { type: 'memory.import.response' };

/** Response containing memories */
export interface MemoryResponsePayload {
  memories: MemoryEntry[];
  total?: number;
}
export type MemoryResponseMessage = MessageEnvelope<MemoryResponsePayload> & { type: 'memory.response' };
