/**
 * Usage tracking types for token consumption and credit system.
 *
 * The CVM tracks per-model token usage with daily/monthly aggregation.
 * Credits are computed from token costs: CREDITS_PER_DOLLAR = 1000.
 */
import type { MessageEnvelope } from './messages.js';
/** Per-model usage breakdown */
export interface ModelUsage {
    /** Model identifier */
    model: string;
    /** Model role (default, reasoning, uncensored, coding, vision) */
    role: string;
    /** Total prompt/input tokens consumed */
    promptTokens: number;
    /** Total completion/output tokens consumed */
    completionTokens: number;
    /** Total credits consumed */
    credits: number;
    /** Number of inference calls */
    callCount: number;
}
/** Aggregated usage summary for a time period */
export interface UsageSummary {
    /** Time period for this summary */
    period: 'day' | 'month';
    /** Total credits consumed in the period */
    totalCredits: number;
    /** Total prompt tokens across all models */
    totalPromptTokens: number;
    /** Total completion tokens across all models */
    totalCompletionTokens: number;
    /** Breakdown by model */
    byModel: ModelUsage[];
    /** Current usage limits */
    limits: {
        daily: number | null;
        monthly: number | null;
    };
    /** Whether any limit is currently exceeded */
    limitExceeded: boolean;
}
/** Client requests usage summary */
export interface UsageListPayload {
    /** Time period to query */
    period: 'day' | 'month';
}
export type UsageListMessage = MessageEnvelope<UsageListPayload> & {
    type: 'usage.list';
};
/** Client sets usage limits */
export interface UsageSetLimitsPayload {
    /** Daily credit limit (null to remove) */
    daily?: number | null;
    /** Monthly credit limit (null to remove) */
    monthly?: number | null;
}
export type UsageSetLimitsMessage = MessageEnvelope<UsageSetLimitsPayload> & {
    type: 'usage.set_limits';
};
/** Server responds with usage data */
export interface UsageResponsePayload extends UsageSummary {
}
export type UsageResponseMessage = MessageEnvelope<UsageResponsePayload> & {
    type: 'usage.response';
};
//# sourceMappingURL=usage.d.ts.map