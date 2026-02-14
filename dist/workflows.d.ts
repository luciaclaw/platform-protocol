/**
 * Workflow types for the multi-step workflow engine.
 *
 * Workflows are DAGs of steps stored in SQLite with encrypted definitions.
 * Steps execute respecting dependency ordering with natural parallelism.
 */
import type { MessageEnvelope } from './messages.js';
export type WorkflowStatus = 'active' | 'archived';
export type WorkflowExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
export type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
export type WorkflowStepType = 'tool_call' | 'llm_inference' | 'delay' | 'agent_turn';
export type WorkflowTrigger = 'manual' | 'schedule' | 'tool';
interface WorkflowStepBase {
    /** Unique step ID within the workflow */
    id: string;
    /** Human-readable step name */
    name: string;
    /** Step IDs that must complete before this one runs */
    dependsOn?: string[];
    /** Expression evaluated against step outputs — skip if falsy */
    condition?: string;
    /** Max retry attempts (default 0) */
    retryMax?: number;
    /** Backoff between retries in ms (default 1000) */
    retryBackoffMs?: number;
}
export interface ToolCallStep extends WorkflowStepBase {
    type: 'tool_call';
    /** Registered tool name (e.g. 'gmail.send') */
    toolName: string;
    /** Tool arguments — supports {{steps.stepId.output.field}} templates */
    arguments: Record<string, unknown>;
}
export interface LlmInferenceStep extends WorkflowStepBase {
    type: 'llm_inference';
    /** Prompt text — supports {{steps.stepId.output.field}} templates */
    prompt: string;
    /** Optional model override */
    model?: string;
}
export interface DelayStep extends WorkflowStepBase {
    type: 'delay';
    /** Wait duration in milliseconds */
    durationMs: number;
}
export interface AgentTurnStep extends WorkflowStepBase {
    type: 'agent_turn';
    /** Goal prompt for the sub-agent — supports {{}} templates */
    prompt: string;
    /** Optional model override */
    model?: string;
    /** Tool name patterns the sub-agent may use (e.g. ['gmail.*', 'web.search']). Empty = all tools. */
    allowedTools?: string[];
    /** Max inference turns before forcing stop (default 5) */
    maxTurns?: number;
}
export type WorkflowStep = ToolCallStep | LlmInferenceStep | DelayStep | AgentTurnStep;
export interface WorkflowInfo {
    id: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    status: WorkflowStatus;
    createdAt: number;
    updatedAt: number;
}
export interface WorkflowStepExecutionInfo {
    stepId: string;
    name: string;
    type: WorkflowStepType;
    status: WorkflowStepStatus;
    output?: unknown;
    error?: string;
    attempts: number;
    startedAt?: number;
    completedAt?: number;
}
export interface WorkflowExecutionInfo {
    id: string;
    workflowId: string;
    workflowName: string;
    status: WorkflowExecutionStatus;
    trigger: WorkflowTrigger;
    steps: WorkflowStepExecutionInfo[];
    startedAt?: number;
    completedAt?: number;
    error?: string;
}
export interface WorkflowCreatePayload {
    name: string;
    description: string;
    steps: WorkflowStep[];
}
export type WorkflowCreateMessage = MessageEnvelope<WorkflowCreatePayload> & {
    type: 'workflow.create';
};
export interface WorkflowUpdatePayload {
    workflowId: string;
    name?: string;
    description?: string;
    steps?: WorkflowStep[];
    status?: WorkflowStatus;
}
export type WorkflowUpdateMessage = MessageEnvelope<WorkflowUpdatePayload> & {
    type: 'workflow.update';
};
export interface WorkflowDeletePayload {
    workflowId: string;
}
export type WorkflowDeleteMessage = MessageEnvelope<WorkflowDeletePayload> & {
    type: 'workflow.delete';
};
export interface WorkflowListPayload {
    status?: WorkflowStatus;
}
export type WorkflowListMessage = MessageEnvelope<WorkflowListPayload> & {
    type: 'workflow.list';
};
export interface WorkflowExecutePayload {
    workflowId: string;
    /** Runtime variables injected into step templates */
    variables?: Record<string, unknown>;
}
export type WorkflowExecuteMessage = MessageEnvelope<WorkflowExecutePayload> & {
    type: 'workflow.execute';
};
export interface WorkflowResponsePayload {
    workflows?: WorkflowInfo[];
    execution?: WorkflowExecutionInfo;
}
export type WorkflowResponseMessage = MessageEnvelope<WorkflowResponsePayload> & {
    type: 'workflow.response';
};
export interface WorkflowStatusPayload {
    execution: WorkflowExecutionInfo;
}
export type WorkflowStatusMessage = MessageEnvelope<WorkflowStatusPayload> & {
    type: 'workflow.status';
};
export {};
//# sourceMappingURL=workflows.d.ts.map