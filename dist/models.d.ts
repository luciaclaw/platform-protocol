/**
 * Model listing types for available LLM models.
 *
 * The PWA requests available models from the CVM after handshake.
 * The CVM fetches available models from the Phala Confidential AI API
 * and returns them filtered to only TEE-enabled models.
 */
import type { MessageEnvelope } from './messages.js';
/** Information about a single available model */
export interface ModelInfo {
    /** Model identifier (e.g., "deepseek/deepseek-chat-v3-0324") */
    id: string;
    /** Human-readable name (e.g., "DeepSeek V3 0324") */
    name: string;
    /** Model provider (e.g., "phala", "nearai", "tinfoil") */
    provider: string;
    /** Maximum context window in tokens */
    contextLength: number;
    /** Pricing per 1M input tokens in USD */
    inputPrice: number;
    /** Pricing per 1M output tokens in USD */
    outputPrice: number;
}
/** Client requests list of available models */
export interface ModelsListPayload {
    /** Optional filter: only return models from this provider */
    provider?: string;
}
export type ModelsListMessage = MessageEnvelope<ModelsListPayload> & {
    type: 'models.list';
};
/** Server responds with available models */
export interface ModelsResponsePayload {
    /** Available models */
    models: ModelInfo[];
    /** Currently selected model ID */
    currentModel: string;
}
export type ModelsResponseMessage = MessageEnvelope<ModelsResponsePayload> & {
    type: 'models.response';
};
//# sourceMappingURL=models.d.ts.map