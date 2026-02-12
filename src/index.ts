/**
 * @luciaclaw/protocol — Lucia Agent Protocol v0.2
 *
 * Type definitions for E2E encrypted communication between
 * the PWA client and the Agent CVM.
 */

// Message envelope
export type {
  MessageType,
  MessageEnvelope,
  EncryptedEnvelope,
} from './messages.js';
export { isEncryptedEnvelope } from './messages.js';

// E2E Handshake
export type {
  HandshakeInitPayload,
  HandshakeInitMessage,
  HandshakeResponsePayload,
  HandshakeResponseMessage,
  HandshakeCompletePayload,
  HandshakeCompleteMessage,
} from './handshake.js';
export { PROTOCOL_VERSION } from './handshake.js';

// Chat
export type {
  ChatRole,
  AttachmentMimeType,
  Attachment,
  ChatMessage,
  ChatMessagePayload,
  ChatMessageMessage,
  ChatResponsePayload,
  ChatResponseMessage,
  ChatStreamChunkPayload,
  ChatStreamChunkMessage,
  ChatStreamEndPayload,
  ChatStreamEndMessage,
} from './chat.js';

// Tool calls
export type {
  ToolCallPayload,
  ToolCallMessage,
  ToolResultPayload,
  ToolResultMessage,
} from './tools.js';

// Confirmations
export type {
  ConfirmationRisk,
  ToolConfirmRequestPayload,
  ToolConfirmRequestMessage,
  ToolConfirmResponsePayload,
  ToolConfirmResponseMessage,
} from './confirmations.js';

// Credentials
export type {
  CredentialInfo,
  CredentialSetPayload,
  CredentialSetMessage,
  CredentialDeletePayload,
  CredentialDeleteMessage,
  CredentialListPayload,
  CredentialListMessage,
  CredentialResponsePayload,
  CredentialResponseMessage,
} from './credentials.js';

// Conversations
export type {
  ConversationSummary,
  ConversationsListPayload,
  ConversationsListMessage,
  ConversationsLoadPayload,
  ConversationsLoadMessage,
  ConversationsResponsePayload,
  ConversationsResponseMessage,
  ConversationsDeletePayload,
  ConversationsDeleteMessage,
} from './conversations.js';

// OAuth
export type {
  OAuthInitPayload,
  OAuthInitMessage,
  OAuthCallbackPayload,
  OAuthCallbackMessage,
  OAuthStatusPayload,
  OAuthStatusMessage,
} from './oauth.js';

// Push notifications
export type {
  PushSubscribePayload,
  PushSubscribeMessage,
  PushUnsubscribePayload,
  PushUnsubscribeMessage,
} from './push.js';

// Integrations
export type {
  IntegrationInfo,
  IntegrationsListPayload,
  IntegrationsListMessage,
  IntegrationsResponsePayload,
  IntegrationsResponseMessage,
} from './integrations.js';

// Schedules
export type {
  ScheduleStatus,
  ScheduleInfo,
  ScheduleCreatePayload,
  ScheduleCreateMessage,
  ScheduleUpdatePayload,
  ScheduleUpdateMessage,
  ScheduleDeletePayload,
  ScheduleDeleteMessage,
  ScheduleListPayload,
  ScheduleListMessage,
  ScheduleResponsePayload,
  ScheduleResponseMessage,
  ScheduleExecutedPayload,
  ScheduleExecutedMessage,
} from './schedules.js';

// Workflows
export type {
  WorkflowStatus,
  WorkflowExecutionStatus,
  WorkflowStepStatus,
  WorkflowStepType,
  WorkflowTrigger,
  ToolCallStep,
  LlmInferenceStep,
  DelayStep,
  WorkflowStep,
  WorkflowInfo,
  WorkflowStepExecutionInfo,
  WorkflowExecutionInfo,
  WorkflowCreatePayload,
  WorkflowCreateMessage,
  WorkflowUpdatePayload,
  WorkflowUpdateMessage,
  WorkflowDeletePayload,
  WorkflowDeleteMessage,
  WorkflowListPayload,
  WorkflowListMessage,
  WorkflowExecutePayload,
  WorkflowExecuteMessage,
  WorkflowResponsePayload,
  WorkflowResponseMessage,
  WorkflowStatusPayload,
  WorkflowStatusMessage,
} from './workflows.js';

// Persistent memory
export type {
  MemoryCategory,
  MemoryEntry,
  MemoryListPayload,
  MemoryListMessage,
  MemorySearchPayload,
  MemorySearchMessage,
  MemoryDeletePayload,
  MemoryDeleteMessage,
  MemoryResponsePayload,
  MemoryResponseMessage,
} from './persistent-memory.js';

// Preferences
export type {
  PreferencesSetPayload,
  PreferencesSetMessage,
  PreferencesListPayload,
  PreferencesListMessage,
  PreferencesResponsePayload,
  PreferencesResponseMessage,
} from './preferences.js';

// Errors
export type { ErrorPayload, ErrorMessage } from './errors.js';
export { ErrorCode } from './errors.js';

// Models
export type {
  ModelInfo,
  ModelsListPayload,
  ModelsListMessage,
  ModelsResponsePayload,
  ModelsResponseMessage,
} from './models.js';

// Attestation
export type {
  TdxAttestation,
  NvidiaCcAttestation,
  AttestationReport,
} from './attestation.js';
