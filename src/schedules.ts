/**
 * Scheduled task types for cron-based automation.
 *
 * Supports three schedule types:
 * - 'cron': recurring via 5-field cron expression
 * - 'at': one-shot at a specific time (auto-deletes after run)
 * - 'interval': recurring at a fixed millisecond interval
 *
 * Execution modes:
 * - 'main': runs in the schedule's dedicated conversation (shared context)
 * - 'isolated': runs in a fresh conversation each time (no context carry-over)
 *
 * Delivery routing:
 * - 'announce': sends results to a specified channel (telegram, discord, etc.)
 * - 'silent': logs only, no delivery
 * - 'none': no delivery (default — results stay in conversation + push notification)
 */

import type { MessageEnvelope } from './messages.js';

/** Schedule status */
export type ScheduleStatus = 'active' | 'paused';

/** Schedule type — how the schedule fires */
export type ScheduleType = 'cron' | 'at' | 'interval';

/** Execution mode — how the prompt runs */
export type ExecutionMode = 'main' | 'isolated';

/** Delivery mode — where results go */
export type DeliveryMode = 'announce' | 'silent' | 'none';

/** Delivery configuration for routing cron results to channels */
export interface DeliveryConfig {
  /** How to deliver: announce (send to channel), silent (log only), none (default) */
  mode: DeliveryMode;
  /** Target channel type (e.g., 'telegram', 'discord', 'slack', 'gmail') */
  channel?: string;
  /** Target identifier (chat ID, channel ID, email address, etc.) */
  target?: string;
}

/** Full schedule information */
export interface ScheduleInfo {
  /** Unique schedule ID */
  id: string;
  /** Human-readable schedule name */
  name: string;
  /** Schedule type: 'cron' (recurring), 'at' (one-shot), 'interval' (fixed interval) */
  scheduleType: ScheduleType;
  /** 5-field cron expression (null for 'at' and 'interval' types) */
  cronExpression: string | null;
  /** IANA timezone (e.g. 'America/New_York') */
  timezone: string;
  /** Prompt to inject into chat pipeline when schedule fires */
  prompt: string;
  /** Whether the schedule is active or paused */
  status: ScheduleStatus;
  /** Execution mode: 'main' (shared context) or 'isolated' (fresh each time) */
  executionMode: ExecutionMode;
  /** Delivery routing configuration (null = default push notification only) */
  delivery: DeliveryConfig | null;
  /** LLM model override for this job (null = use global default) */
  model: string | null;
  /** Unix timestamp for one-shot 'at' schedules (null for cron/interval) */
  atTime: number | null;
  /** Interval in milliseconds for 'interval' schedules (null for cron/at) */
  intervalMs: number | null;
  /** Whether to auto-delete after execution (default true for 'at', false otherwise) */
  deleteAfterRun: boolean;
  /** Maximum retry attempts on failure (0 = no retry) */
  maxRetries: number;
  /** Initial retry backoff in milliseconds (doubles each retry, caps at 60m) */
  retryBackoffMs: number;
  /** Current retry attempt count (resets to 0 on success) */
  retryCount: number;
  /** Last error message (null if last run succeeded) */
  lastError: string | null;
  /** Conversation ID for storing schedule execution results */
  conversationId: string | null;
  /** Unix timestamp when the schedule was created */
  createdAt: number;
  /** Unix timestamp when the schedule was last modified */
  updatedAt: number;
  /** Unix timestamp of last execution (null if never run) */
  lastRunAt: number | null;
  /** Unix timestamp of next scheduled execution (null if paused) */
  nextRunAt: number | null;
}

/** Create a new scheduled task */
export interface ScheduleCreatePayload {
  /** Human-readable schedule name */
  name: string;
  /** Schedule type (default: 'cron') */
  scheduleType?: ScheduleType;
  /** 5-field cron expression (required for 'cron' type) */
  cronExpression?: string;
  /** IANA timezone */
  timezone: string;
  /** Prompt to run on schedule */
  prompt: string;
  /** Execution mode (default: 'main') */
  executionMode?: ExecutionMode;
  /** Delivery routing configuration */
  delivery?: DeliveryConfig;
  /** LLM model override for this job */
  model?: string;
  /** Unix timestamp for 'at' type */
  atTime?: number;
  /** Relative duration for 'at' type (e.g., '20m', '2h', '1d') — parsed server-side */
  atDuration?: string;
  /** Interval in ms for 'interval' type */
  intervalMs?: number;
  /** Whether to auto-delete after execution */
  deleteAfterRun?: boolean;
  /** Maximum retry attempts on failure (default: 0) */
  maxRetries?: number;
  /** Initial retry backoff in ms (default: 30000) */
  retryBackoffMs?: number;
}

export type ScheduleCreateMessage =
  MessageEnvelope<ScheduleCreatePayload> & {
    type: 'schedule.create';
  };

/** Update an existing scheduled task */
export interface ScheduleUpdatePayload {
  /** Schedule ID to update */
  scheduleId: string;
  /** Updated name */
  name?: string;
  /** Updated cron expression */
  cronExpression?: string;
  /** Updated timezone */
  timezone?: string;
  /** Updated prompt */
  prompt?: string;
  /** Updated status (active/paused) */
  status?: ScheduleStatus;
  /** Updated execution mode */
  executionMode?: ExecutionMode;
  /** Updated delivery config (null to clear) */
  delivery?: DeliveryConfig | null;
  /** Updated model override (null to clear) */
  model?: string | null;
  /** Updated max retries */
  maxRetries?: number;
  /** Updated retry backoff */
  retryBackoffMs?: number;
}

export type ScheduleUpdateMessage =
  MessageEnvelope<ScheduleUpdatePayload> & {
    type: 'schedule.update';
  };

/** Delete a scheduled task */
export interface ScheduleDeletePayload {
  /** Schedule ID to delete */
  scheduleId: string;
}

export type ScheduleDeleteMessage =
  MessageEnvelope<ScheduleDeletePayload> & {
    type: 'schedule.delete';
  };

/** List scheduled tasks */
export interface ScheduleListPayload {
  /** Optional status filter */
  status?: ScheduleStatus;
}

export type ScheduleListMessage =
  MessageEnvelope<ScheduleListPayload> & {
    type: 'schedule.list';
  };

/** Response with schedule data */
export interface ScheduleResponsePayload {
  /** List of schedules */
  schedules: ScheduleInfo[];
}

export type ScheduleResponseMessage =
  MessageEnvelope<ScheduleResponsePayload> & {
    type: 'schedule.response';
  };

/** Server push when a scheduled task executes */
export interface ScheduleExecutedPayload {
  /** Schedule ID that fired */
  scheduleId: string;
  /** Schedule name */
  name: string;
  /** Prompt that was executed */
  prompt: string;
  /** LLM response content */
  responseContent: string;
  /** Conversation ID where results are stored */
  conversationId: string;
  /** Unix timestamp of execution */
  executedAt: number;
  /** Delivery channel used (if any) */
  deliveryChannel?: string;
}

export type ScheduleExecutedMessage =
  MessageEnvelope<ScheduleExecutedPayload> & {
    type: 'schedule.executed';
  };
