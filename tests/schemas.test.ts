import { describe, it, expect } from 'vitest';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemasDir = resolve(__dirname, '../schemas');

function loadSchema(name: string) {
  return JSON.parse(readFileSync(resolve(schemasDir, name), 'utf-8'));
}

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Register all schemas so $ref works
const envelopeSchema = loadSchema('message-envelope.json');
const toolCallSchema = loadSchema('tool-call.json');
const credentialsSchema = loadSchema('credentials.json');
const conversationsSchema = loadSchema('conversations.json');
const oauthSchema = loadSchema('oauth.json');
const pushSchema = loadSchema('push.json');
const integrationsSchema = loadSchema('integrations.json');
const schedulesSchema = loadSchema('schedules.json');
const persistentMemorySchema = loadSchema('persistent-memory.json');

ajv.addSchema(toolCallSchema);
ajv.addSchema(credentialsSchema);
ajv.addSchema(conversationsSchema);
ajv.addSchema(oauthSchema);
ajv.addSchema(pushSchema);
ajv.addSchema(integrationsSchema);
ajv.addSchema(schedulesSchema);
ajv.addSchema(persistentMemorySchema);

const validateEnvelope = ajv.compile(envelopeSchema);

const chatMessageSchema = loadSchema('chat-message.json');
const validateChatMessage = ajv.compile(chatMessageSchema);

function uuid() {
  return '550e8400-e29b-41d4-a716-446655440000';
}

describe('MessageEnvelope schema', () => {
  it('validates a chat.message envelope', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: { content: 'Hello' },
    };
    expect(validateEnvelope(msg)).toBe(true);
  });

  it('validates an encrypted envelope', () => {
    const msg = {
      id: uuid(),
      type: 'encrypted',
      timestamp: Date.now(),
      payload: {
        iv: 'dGVzdGl2MTIzNDU2',
        ciphertext: 'ZW5jcnlwdGVkZGF0YQ==',
      },
    };
    expect(validateEnvelope(msg)).toBe(true);
  });

  it('rejects envelope with missing id', () => {
    const msg = {
      type: 'chat.message',
      timestamp: Date.now(),
      payload: { content: 'Hello' },
    };
    expect(validateEnvelope(msg)).toBe(false);
  });

  it('rejects envelope with invalid type', () => {
    const msg = {
      id: uuid(),
      type: 'invalid.type',
      timestamp: Date.now(),
      payload: {},
    };
    expect(validateEnvelope(msg)).toBe(false);
  });

  it('rejects envelope with extra properties', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: {},
      extra: 'not allowed',
    };
    expect(validateEnvelope(msg)).toBe(false);
  });

  it('validates encrypted envelope requires iv and ciphertext', () => {
    const msg = {
      id: uuid(),
      type: 'encrypted',
      timestamp: Date.now(),
      payload: { iv: 'abc' },
    };
    expect(validateEnvelope(msg)).toBe(false);
  });

  it('validates new credential message types in envelope', () => {
    for (const type of ['credentials.set', 'credentials.delete', 'credentials.list', 'credentials.response']) {
      const msg = { id: uuid(), type, timestamp: Date.now(), payload: {} };
      expect(validateEnvelope(msg)).toBe(true);
    }
  });

  it('validates new conversation message types in envelope', () => {
    for (const type of ['conversations.list', 'conversations.load', 'conversations.response', 'conversations.delete']) {
      const msg = { id: uuid(), type, timestamp: Date.now(), payload: {} };
      expect(validateEnvelope(msg)).toBe(true);
    }
  });

  it('validates new oauth message types in envelope', () => {
    for (const type of ['oauth.init', 'oauth.callback', 'oauth.status']) {
      const msg = { id: uuid(), type, timestamp: Date.now(), payload: {} };
      expect(validateEnvelope(msg)).toBe(true);
    }
  });

  it('validates new push message types in envelope', () => {
    for (const type of ['push.subscribe', 'push.unsubscribe']) {
      const msg = { id: uuid(), type, timestamp: Date.now(), payload: {} };
      expect(validateEnvelope(msg)).toBe(true);
    }
  });

  it('validates new integrations message types in envelope', () => {
    for (const type of ['integrations.list', 'integrations.response']) {
      const msg = { id: uuid(), type, timestamp: Date.now(), payload: {} };
      expect(validateEnvelope(msg)).toBe(true);
    }
  });
});

describe('ToolCall schema', () => {
  const toolCallOneOf = ajv.compile(toolCallSchema);

  it('validates a tool.call message', () => {
    const msg = {
      id: uuid(),
      type: 'tool.call',
      timestamp: Date.now(),
      payload: {
        callId: 'tc_001',
        name: 'gmail.send',
        arguments: { to: 'test@test.com' },
      },
    };
    expect(toolCallOneOf(msg)).toBe(true);
  });

  it('validates a tool.result message', () => {
    const msg = {
      id: uuid(),
      type: 'tool.result',
      timestamp: Date.now(),
      payload: {
        callId: 'tc_001',
        success: true,
        result: { messageId: 'msg_123' },
      },
    };
    expect(toolCallOneOf(msg)).toBe(true);
  });

  it('validates a tool.confirm.request message', () => {
    const msg = {
      id: uuid(),
      type: 'tool.confirm.request',
      timestamp: Date.now(),
      payload: {
        toolCall: {
          callId: 'tc_002',
          name: 'gmail.send',
          arguments: { to: 'boss@company.com' },
        },
        description: 'Send email to boss',
        risk: 'high',
        timeoutMs: 60000,
      },
    };
    expect(toolCallOneOf(msg)).toBe(true);
  });

  it('validates a tool.confirm.response message', () => {
    const msg = {
      id: uuid(),
      type: 'tool.confirm.response',
      timestamp: Date.now(),
      payload: {
        callId: 'tc_002',
        approved: false,
        note: 'Not now',
      },
    };
    expect(toolCallOneOf(msg)).toBe(true);
  });

  it('rejects tool.call with missing name', () => {
    const msg = {
      id: uuid(),
      type: 'tool.call',
      timestamp: Date.now(),
      payload: {
        callId: 'tc_001',
        arguments: {},
      },
    };
    expect(toolCallOneOf(msg)).toBe(false);
  });

  it('rejects tool.confirm.request with invalid risk level', () => {
    const msg = {
      id: uuid(),
      type: 'tool.confirm.request',
      timestamp: Date.now(),
      payload: {
        toolCall: {
          callId: 'tc_003',
          name: 'calendar.delete',
          arguments: {},
        },
        description: 'Delete all events',
        risk: 'extreme',
        timeoutMs: 30000,
      },
    };
    expect(toolCallOneOf(msg)).toBe(false);
  });
});

describe('Credentials schema', () => {
  const validateCredentials = ajv.compile(credentialsSchema);

  it('validates credentials.set message', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.set',
      timestamp: Date.now(),
      payload: {
        service: 'gmail',
        label: 'Work Gmail',
        credentialType: 'oauth',
        value: 'ya29.access-token-here',
        scopes: ['gmail.send', 'gmail.readonly'],
      },
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('validates credentials.delete message', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.delete',
      timestamp: Date.now(),
      payload: { service: 'slack' },
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('validates credentials.list with optional filter', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.list',
      timestamp: Date.now(),
      payload: { service: 'gmail' },
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('validates credentials.list with empty payload', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.list',
      timestamp: Date.now(),
      payload: {},
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('validates credentials.response message', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.response',
      timestamp: Date.now(),
      payload: {
        credentials: [
          {
            service: 'gmail',
            label: 'Work Gmail',
            credentialType: 'oauth',
            connected: true,
            createdAt: Date.now(),
            lastUsedAt: Date.now(),
            scopes: ['gmail.send'],
          },
        ],
      },
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('rejects credentials.set with missing value', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.set',
      timestamp: Date.now(),
      payload: {
        service: 'gmail',
        label: 'Work Gmail',
        credentialType: 'api_key',
      },
    };
    expect(validateCredentials(msg)).toBe(false);
  });

  it('rejects credentials.set with invalid credentialType', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.set',
      timestamp: Date.now(),
      payload: {
        service: 'gmail',
        label: 'Work Gmail',
        credentialType: 'password',
        value: 'secret',
      },
    };
    expect(validateCredentials(msg)).toBe(false);
  });

  it('validates credentials.set with account field', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.set',
      timestamp: Date.now(),
      payload: {
        service: 'google',
        account: 'work',
        label: 'Work Google',
        credentialType: 'oauth',
        value: 'ya29.token',
        scopes: ['gmail.send'],
      },
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('validates credentials.set without account (backwards compat)', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.set',
      timestamp: Date.now(),
      payload: {
        service: 'slack',
        label: 'Slack',
        credentialType: 'oauth',
        value: 'xoxb-token',
      },
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('validates credentials.delete with account', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.delete',
      timestamp: Date.now(),
      payload: { service: 'google', account: 'personal' },
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('validates credentials.response with account in credentialInfo', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.response',
      timestamp: Date.now(),
      payload: {
        credentials: [
          {
            service: 'google',
            account: 'work',
            label: 'Work Google',
            credentialType: 'oauth',
            connected: true,
            createdAt: Date.now(),
          },
        ],
      },
    };
    expect(validateCredentials(msg)).toBe(true);
  });

  it('validates credentials.list with account filter', () => {
    const msg = {
      id: uuid(),
      type: 'credentials.list',
      timestamp: Date.now(),
      payload: { service: 'google', account: 'work' },
    };
    expect(validateCredentials(msg)).toBe(true);
  });
});

describe('Conversations schema', () => {
  const validateConversations = ajv.compile(conversationsSchema);

  it('validates conversations.list message', () => {
    const msg = {
      id: uuid(),
      type: 'conversations.list',
      timestamp: Date.now(),
      payload: { limit: 20, offset: 0 },
    };
    expect(validateConversations(msg)).toBe(true);
  });

  it('validates conversations.load message', () => {
    const msg = {
      id: uuid(),
      type: 'conversations.load',
      timestamp: Date.now(),
      payload: { conversationId: 'conv_001', limit: 50 },
    };
    expect(validateConversations(msg)).toBe(true);
  });

  it('validates conversations.response with summaries', () => {
    const msg = {
      id: uuid(),
      type: 'conversations.response',
      timestamp: Date.now(),
      payload: {
        conversations: [
          {
            id: 'conv_001',
            title: 'About TDX attestation',
            messageCount: 5,
            createdAt: Date.now() - 86400000,
            updatedAt: Date.now(),
          },
        ],
      },
    };
    expect(validateConversations(msg)).toBe(true);
  });

  it('validates conversations.response with messages', () => {
    const msg = {
      id: uuid(),
      type: 'conversations.response',
      timestamp: Date.now(),
      payload: {
        conversationId: 'conv_001',
        messages: [
          { messageId: 'msg_001', role: 'user', content: 'Hello', timestamp: Date.now() },
          { messageId: 'msg_002', role: 'assistant', content: 'Hi there!', timestamp: Date.now() },
        ],
        totalMessages: 2,
      },
    };
    expect(validateConversations(msg)).toBe(true);
  });

  it('validates conversations.delete message', () => {
    const msg = {
      id: uuid(),
      type: 'conversations.delete',
      timestamp: Date.now(),
      payload: { conversationId: 'conv_001' },
    };
    expect(validateConversations(msg)).toBe(true);
  });

  it('rejects conversations.load without conversationId', () => {
    const msg = {
      id: uuid(),
      type: 'conversations.load',
      timestamp: Date.now(),
      payload: { limit: 50 },
    };
    expect(validateConversations(msg)).toBe(false);
  });
});

describe('OAuth schema', () => {
  const validateOAuth = ajv.compile(oauthSchema);

  it('validates oauth.init message', () => {
    const msg = {
      id: uuid(),
      type: 'oauth.init',
      timestamp: Date.now(),
      payload: {
        service: 'google',
        scopes: ['gmail.send', 'gmail.readonly', 'calendar'],
      },
    };
    expect(validateOAuth(msg)).toBe(true);
  });

  it('validates oauth.callback success', () => {
    const msg = {
      id: uuid(),
      type: 'oauth.callback',
      timestamp: Date.now(),
      payload: {
        service: 'google',
        success: true,
        grantedScopes: ['gmail.send', 'gmail.readonly'],
      },
    };
    expect(validateOAuth(msg)).toBe(true);
  });

  it('validates oauth.callback failure', () => {
    const msg = {
      id: uuid(),
      type: 'oauth.callback',
      timestamp: Date.now(),
      payload: {
        service: 'slack',
        success: false,
        error: 'User denied consent',
      },
    };
    expect(validateOAuth(msg)).toBe(true);
  });

  it('validates oauth.status with auth URL', () => {
    const msg = {
      id: uuid(),
      type: 'oauth.status',
      timestamp: Date.now(),
      payload: {
        service: 'google',
        authenticated: false,
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...',
      },
    };
    expect(validateOAuth(msg)).toBe(true);
  });

  it('rejects oauth.init with empty scopes', () => {
    const msg = {
      id: uuid(),
      type: 'oauth.init',
      timestamp: Date.now(),
      payload: {
        service: 'google',
        scopes: [],
      },
    };
    expect(validateOAuth(msg)).toBe(false);
  });
});

describe('Push notification schema', () => {
  const validatePush = ajv.compile(pushSchema);

  it('validates push.subscribe message', () => {
    const msg = {
      id: uuid(),
      type: 'push.subscribe',
      timestamp: Date.now(),
      payload: {
        subscription: {
          endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
          expirationTime: null,
          keys: {
            p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8p8REfXPo',
            auth: 'tBHItJI5svbpC7Dq6Q5X8Q',
          },
        },
      },
    };
    expect(validatePush(msg)).toBe(true);
  });

  it('validates push.unsubscribe message', () => {
    const msg = {
      id: uuid(),
      type: 'push.unsubscribe',
      timestamp: Date.now(),
      payload: {
        endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
      },
    };
    expect(validatePush(msg)).toBe(true);
  });

  it('rejects push.subscribe without keys', () => {
    const msg = {
      id: uuid(),
      type: 'push.subscribe',
      timestamp: Date.now(),
      payload: {
        subscription: {
          endpoint: 'https://fcm.googleapis.com/fcm/send/abc123',
          expirationTime: null,
        },
      },
    };
    expect(validatePush(msg)).toBe(false);
  });
});

describe('Integrations schema', () => {
  const validateIntegrations = ajv.compile(integrationsSchema);

  it('validates integrations.list message', () => {
    const msg = {
      id: uuid(),
      type: 'integrations.list',
      timestamp: Date.now(),
      payload: { filter: 'all' },
    };
    expect(validateIntegrations(msg)).toBe(true);
  });

  it('validates integrations.list with empty payload', () => {
    const msg = {
      id: uuid(),
      type: 'integrations.list',
      timestamp: Date.now(),
      payload: {},
    };
    expect(validateIntegrations(msg)).toBe(true);
  });

  it('validates integrations.response message', () => {
    const msg = {
      id: uuid(),
      type: 'integrations.response',
      timestamp: Date.now(),
      payload: {
        integrations: [
          {
            service: 'gmail',
            name: 'Gmail',
            description: 'Send and read emails',
            authType: 'oauth',
            requiredScopes: ['gmail.send', 'gmail.readonly'],
            capabilities: ['gmail.send', 'gmail.read', 'gmail.search'],
            connected: true,
            icon: 'gmail',
          },
          {
            service: 'slack',
            name: 'Slack',
            description: 'Send messages and read channels',
            authType: 'oauth',
            requiredScopes: ['chat:write', 'channels:read'],
            capabilities: ['slack.send', 'slack.read'],
            connected: false,
          },
        ],
      },
    };
    expect(validateIntegrations(msg)).toBe(true);
  });

  it('rejects integrations.list with invalid filter', () => {
    const msg = {
      id: uuid(),
      type: 'integrations.list',
      timestamp: Date.now(),
      payload: { filter: 'invalid' },
    };
    expect(validateIntegrations(msg)).toBe(false);
  });
});

describe('Models message types', () => {
  it('validates a models.list envelope', () => {
    const msg = {
      id: uuid(),
      type: 'models.list',
      timestamp: Date.now(),
      payload: {},
    };
    expect(validateEnvelope(msg)).toBe(true);
  });

  it('validates a models.response envelope', () => {
    const msg = {
      id: uuid(),
      type: 'models.response',
      timestamp: Date.now(),
      payload: {
        models: [
          { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek V3', provider: 'deepseek', contextLength: 65536, inputPrice: 0.5, outputPrice: 1.5 },
        ],
        currentModel: 'deepseek/deepseek-chat-v3-0324',
      },
    };
    expect(validateEnvelope(msg)).toBe(true);
  });
});

describe('Chat message model field', () => {
  it('validates chat.message with model field', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: { content: 'Hello', model: 'deepseek/deepseek-chat-v3-0324' },
    };
    expect(validateChatMessage(msg)).toBe(true);
  });

  it('validates chat.message without model field', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: { content: 'Hello' },
    };
    expect(validateChatMessage(msg)).toBe(true);
  });

  it('validates chat.response with model field', () => {
    const msg = {
      id: uuid(),
      type: 'chat.response',
      timestamp: Date.now(),
      payload: { content: 'Hi there', model: 'qwen/qwq-32b' },
    };
    expect(validateChatMessage(msg)).toBe(true);
  });

  it('validates chat.message with conversationId', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: { content: 'Hello', conversationId: 'conv_001' },
    };
    expect(validateChatMessage(msg)).toBe(true);
  });
});

describe('TypeScript types match schema expectations', () => {
  it('ErrorCode enum values are numbers', async () => {
    const { ErrorCode } = await import('../src/errors.js');
    expect(typeof ErrorCode.INTERNAL_ERROR).toBe('number');
    expect(ErrorCode.INTERNAL_ERROR).toBe(1000);
    expect(ErrorCode.HANDSHAKE_FAILED).toBe(2000);
    expect(ErrorCode.TOOL_ERROR).toBe(3000);
    expect(ErrorCode.INFERENCE_ERROR).toBe(4000);
    expect(ErrorCode.RATE_LIMITED).toBe(5000);
  });

  it('ModelInfo type has expected shape', async () => {
    const { } = await import('../src/models.js');
    // Verify the type exists and can be used at runtime
    const model: import('../src/models.js').ModelInfo = {
      id: 'test/model',
      name: 'Test Model',
      provider: 'test',
      contextLength: 8192,
      inputPrice: 1.0,
      outputPrice: 2.0,
    };
    expect(model.id).toBe('test/model');
    expect(model.provider).toBe('test');
    expect(model.contextLength).toBe(8192);
  });

  it('PROTOCOL_VERSION is 0.2.0', async () => {
    const { PROTOCOL_VERSION } = await import('../src/handshake.js');
    expect(PROTOCOL_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(PROTOCOL_VERSION).toBe('0.2.0');
  });

  it('isEncryptedEnvelope type guard works', async () => {
    const { isEncryptedEnvelope } = await import('../src/messages.js');
    const encrypted = {
      id: uuid(),
      type: 'encrypted' as const,
      timestamp: Date.now(),
      payload: { iv: 'abc', ciphertext: 'def' },
    };
    const plain = {
      id: uuid(),
      type: 'chat.message' as const,
      timestamp: Date.now(),
      payload: { content: 'hello' },
    };
    expect(isEncryptedEnvelope(encrypted)).toBe(true);
    expect(isEncryptedEnvelope(plain)).toBe(false);
  });

  it('new v0.2 types are exported from index', async () => {
    const protocol = await import('../src/index.js');
    // Verify the module exports the new type-only exports by checking the module has no runtime errors
    expect(protocol.PROTOCOL_VERSION).toBe('0.2.0');
    expect(protocol.isEncryptedEnvelope).toBeTypeOf('function');
    expect(protocol.ErrorCode).toBeDefined();
  });

  it('ErrorCode includes schedule error codes', async () => {
    const { ErrorCode } = await import('../src/errors.js');
    expect(ErrorCode.SCHEDULE_ERROR).toBe(6000);
    expect(ErrorCode.SCHEDULE_NOT_FOUND).toBe(6001);
  });

  it('ErrorCode includes CREDENTIAL_NOT_FOUND', async () => {
    const { ErrorCode } = await import('../src/errors.js');
    expect(ErrorCode.CREDENTIAL_NOT_FOUND).toBe(7000);
  });
});

describe('Chat message attachments', () => {
  it('validates chat.message with attachments', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: {
        content: 'Check this image',
        attachments: [
          {
            filename: 'photo.jpg',
            mimeType: 'image/jpeg',
            data: 'aGVsbG8=',
            size: 5,
          },
        ],
      },
    };
    expect(validateChatMessage(msg)).toBe(true);
  });

  it('validates chat.message with multiple attachments', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: {
        content: 'Multiple files',
        attachments: [
          { filename: 'photo.jpg', mimeType: 'image/jpeg', data: 'aGVsbG8=', size: 5 },
          { filename: 'doc.pdf', mimeType: 'application/pdf', data: 'cGRm', size: 3 },
          { filename: 'note.txt', mimeType: 'text/plain', data: 'dGV4dA==', size: 4 },
        ],
      },
    };
    expect(validateChatMessage(msg)).toBe(true);
  });

  it('validates chat.message without attachments', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: { content: 'Just text' },
    };
    expect(validateChatMessage(msg)).toBe(true);
  });

  it('rejects attachment with invalid mimeType', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: {
        content: 'Bad mime',
        attachments: [
          { filename: 'virus.exe', mimeType: 'application/octet-stream', data: 'abc', size: 3 },
        ],
      },
    };
    expect(validateChatMessage(msg)).toBe(false);
  });

  it('rejects attachment with missing filename', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: {
        content: 'No filename',
        attachments: [
          { mimeType: 'image/png', data: 'abc', size: 3 },
        ],
      },
    };
    expect(validateChatMessage(msg)).toBe(false);
  });

  it('rejects more than 5 attachments', () => {
    const attachment = { filename: 'f.jpg', mimeType: 'image/jpeg', data: 'abc', size: 3 };
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: {
        content: 'Too many',
        attachments: [attachment, attachment, attachment, attachment, attachment, attachment],
      },
    };
    expect(validateChatMessage(msg)).toBe(false);
  });

  it('rejects attachment with zero size', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: {
        content: 'Zero size',
        attachments: [
          { filename: 'empty.png', mimeType: 'image/png', data: 'abc', size: 0 },
        ],
      },
    };
    expect(validateChatMessage(msg)).toBe(false);
  });

  it('rejects attachment with empty data', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: {
        content: 'Empty data',
        attachments: [
          { filename: 'f.png', mimeType: 'image/png', data: '', size: 100 },
        ],
      },
    };
    expect(validateChatMessage(msg)).toBe(false);
  });

  it('validates all supported MIME types', () => {
    const mimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain'];
    for (const mimeType of mimeTypes) {
      const msg = {
        id: uuid(),
        type: 'chat.message',
        timestamp: Date.now(),
        payload: {
          content: 'Test',
          attachments: [{ filename: 'file', mimeType, data: 'abc', size: 3 }],
        },
      };
      expect(validateChatMessage(msg)).toBe(true);
    }
  });
});

describe('Schedules schema', () => {
  const validateSchedules = ajv.compile(schedulesSchema);

  it('validates schedule message types in envelope', () => {
    for (const type of ['schedule.create', 'schedule.update', 'schedule.delete', 'schedule.list', 'schedule.response', 'schedule.executed']) {
      const msg = { id: uuid(), type, timestamp: Date.now(), payload: {} };
      expect(validateEnvelope(msg)).toBe(true);
    }
  });

  it('validates schedule.create with all required fields', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.create',
      timestamp: Date.now(),
      payload: {
        name: 'Morning briefing',
        cronExpression: '0 8 * * *',
        timezone: 'America/New_York',
        prompt: 'Give me a morning briefing with weather, calendar, and email summary.',
      },
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('validates schedule.update with just scheduleId', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.update',
      timestamp: Date.now(),
      payload: { scheduleId: 'sched_001' },
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('validates schedule.update with all optional fields', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.update',
      timestamp: Date.now(),
      payload: {
        scheduleId: 'sched_001',
        name: 'Updated briefing',
        cronExpression: '0 9 * * 1-5',
        timezone: 'Europe/London',
        prompt: 'Updated prompt',
        status: 'paused',
      },
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('validates schedule.delete message', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.delete',
      timestamp: Date.now(),
      payload: { scheduleId: 'sched_001' },
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('validates schedule.list with empty payload', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.list',
      timestamp: Date.now(),
      payload: {},
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('validates schedule.list with status filter', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.list',
      timestamp: Date.now(),
      payload: { status: 'active' },
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('validates schedule.response with scheduleInfo array', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.response',
      timestamp: Date.now(),
      payload: {
        schedules: [
          {
            id: 'sched_001',
            name: 'Morning briefing',
            cronExpression: '0 8 * * *',
            timezone: 'America/New_York',
            prompt: 'Morning briefing please',
            status: 'active',
            conversationId: 'conv_001',
            createdAt: Date.now() - 86400000,
            updatedAt: Date.now(),
            lastRunAt: Date.now() - 3600000,
            nextRunAt: Date.now() + 3600000,
          },
        ],
      },
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('validates schedule.response with null optional fields', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.response',
      timestamp: Date.now(),
      payload: {
        schedules: [
          {
            id: 'sched_002',
            name: 'New schedule',
            cronExpression: '*/30 * * * *',
            timezone: 'UTC',
            prompt: 'Check emails',
            status: 'paused',
            conversationId: null,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            lastRunAt: null,
            nextRunAt: null,
          },
        ],
      },
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('validates schedule.executed with all fields', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.executed',
      timestamp: Date.now(),
      payload: {
        scheduleId: 'sched_001',
        name: 'Morning briefing',
        prompt: 'Give me a morning briefing',
        responseContent: 'Good morning! Here is your briefing...',
        conversationId: 'conv_001',
        executedAt: Date.now(),
      },
    };
    expect(validateSchedules(msg)).toBe(true);
  });

  it('rejects schedule.create without required name', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.create',
      timestamp: Date.now(),
      payload: {
        cronExpression: '0 8 * * *',
        timezone: 'UTC',
        prompt: 'Do something',
      },
    };
    expect(validateSchedules(msg)).toBe(false);
  });

  it('rejects schedule.create without required cronExpression', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.create',
      timestamp: Date.now(),
      payload: {
        name: 'Test',
        timezone: 'UTC',
        prompt: 'Do something',
      },
    };
    expect(validateSchedules(msg)).toBe(false);
  });

  it('rejects schedule.create without required timezone', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.create',
      timestamp: Date.now(),
      payload: {
        name: 'Test',
        cronExpression: '0 8 * * *',
        prompt: 'Do something',
      },
    };
    expect(validateSchedules(msg)).toBe(false);
  });

  it('rejects schedule.create without required prompt', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.create',
      timestamp: Date.now(),
      payload: {
        name: 'Test',
        cronExpression: '0 8 * * *',
        timezone: 'UTC',
      },
    };
    expect(validateSchedules(msg)).toBe(false);
  });

  it('rejects schedule.update without scheduleId', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.update',
      timestamp: Date.now(),
      payload: { name: 'Updated' },
    };
    expect(validateSchedules(msg)).toBe(false);
  });

  it('rejects invalid status values', () => {
    const msg = {
      id: uuid(),
      type: 'schedule.list',
      timestamp: Date.now(),
      payload: { status: 'invalid' },
    };
    expect(validateSchedules(msg)).toBe(false);
  });
});

describe('Persistent memory schema', () => {
  const validateMemory = ajv.compile(persistentMemorySchema);

  it('validates memory message types in envelope', () => {
    for (const type of ['memory.list', 'memory.search', 'memory.delete', 'memory.response']) {
      const msg = { id: uuid(), type, timestamp: Date.now(), payload: {} };
      expect(validateEnvelope(msg)).toBe(true);
    }
  });

  it('validates memory.list with no filters', () => {
    const msg = {
      id: uuid(),
      type: 'memory.list',
      timestamp: Date.now(),
      payload: {},
    };
    expect(validateMemory(msg)).toBe(true);
  });

  it('validates memory.list with category filter', () => {
    const msg = {
      id: uuid(),
      type: 'memory.list',
      timestamp: Date.now(),
      payload: { category: 'fact', limit: 20, offset: 0 },
    };
    expect(validateMemory(msg)).toBe(true);
  });

  it('validates memory.search with query', () => {
    const msg = {
      id: uuid(),
      type: 'memory.search',
      timestamp: Date.now(),
      payload: { query: 'project deadline', limit: 10 },
    };
    expect(validateMemory(msg)).toBe(true);
  });

  it('validates memory.search with category filter', () => {
    const msg = {
      id: uuid(),
      type: 'memory.search',
      timestamp: Date.now(),
      payload: { query: 'meeting', category: 'event' },
    };
    expect(validateMemory(msg)).toBe(true);
  });

  it('validates memory.delete with memoryId', () => {
    const msg = {
      id: uuid(),
      type: 'memory.delete',
      timestamp: Date.now(),
      payload: { memoryId: 'mem_001' },
    };
    expect(validateMemory(msg)).toBe(true);
  });

  it('validates memory.response with memories array', () => {
    const msg = {
      id: uuid(),
      type: 'memory.response',
      timestamp: Date.now(),
      payload: {
        memories: [
          {
            id: 'mem_001',
            content: "User's name is Alex",
            category: 'fact',
            conversationId: 'conv_001',
            createdAt: Date.now() - 86400000,
            lastAccessedAt: Date.now(),
            accessCount: 5,
          },
          {
            id: 'mem_002',
            content: 'Prefers concise replies',
            category: 'preference',
            createdAt: Date.now(),
            lastAccessedAt: null,
            accessCount: 0,
          },
        ],
        total: 2,
      },
    };
    expect(validateMemory(msg)).toBe(true);
  });

  it('validates all MemoryCategory values', () => {
    const categories = ['fact', 'preference', 'event', 'decision', 'relationship', 'general'];
    for (const category of categories) {
      const msg = {
        id: uuid(),
        type: 'memory.list',
        timestamp: Date.now(),
        payload: { category },
      };
      expect(validateMemory(msg)).toBe(true);
    }
  });

  it('rejects memory.list with invalid category', () => {
    const msg = {
      id: uuid(),
      type: 'memory.list',
      timestamp: Date.now(),
      payload: { category: 'invalid' },
    };
    expect(validateMemory(msg)).toBe(false);
  });

  it('rejects memory.search without query', () => {
    const msg = {
      id: uuid(),
      type: 'memory.search',
      timestamp: Date.now(),
      payload: { category: 'fact' },
    };
    expect(validateMemory(msg)).toBe(false);
  });

  it('rejects memory.delete without memoryId', () => {
    const msg = {
      id: uuid(),
      type: 'memory.delete',
      timestamp: Date.now(),
      payload: {},
    };
    expect(validateMemory(msg)).toBe(false);
  });
});
