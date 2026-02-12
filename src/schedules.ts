/**
 * Scheduled task types for cron-based automation.
 *
 * Schedules fire prompts into the chat pipeline on a cron expression.
 * Results are stored in a dedicated conversation per schedule and
 * delivered via push notification.
 */

import type { MessageEnvelope } from './messages.js';

/** Schedule status */
export type ScheduleStatus = 'active' | 'paused';

/** Full schedule information */
export interface ScheduleInfo {
  /** Unique schedule ID */
  id: string;
  /** Human-readable schedule name */
  name: string;
  /** 5-field cron expression (minute hour dom month dow) */
  cronExpression: string;
  /** IANA timezone (e.g. 'America/New_York') */
  timezone: string;
  /** Prompt to inject into chat pipeline when schedule fires */
  prompt: string;
  /** Whether the schedule is active or paused */
  status: ScheduleStatus;
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
  /** 5-field cron expression */
  cronExpression: string;
  /** IANA timezone */
  timezone: string;
  /** Prompt to run on schedule */
  prompt: string;
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
}

export type ScheduleExecutedMessage =
  MessageEnvelope<ScheduleExecutedPayload> & {
    type: 'schedule.executed';
  };
