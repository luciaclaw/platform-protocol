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
export {};
//# sourceMappingURL=schedules.js.map