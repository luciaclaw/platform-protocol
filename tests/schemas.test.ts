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
ajv.addSchema(toolCallSchema);

const validateEnvelope = ajv.compile(envelopeSchema);

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
  const chatSchema = loadSchema('chat-message.json');
  const validateChat = ajv.compile(chatSchema);

  it('validates chat.message with model field', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: { content: 'Hello', model: 'deepseek/deepseek-chat-v3-0324' },
    };
    expect(validateChat(msg)).toBe(true);
  });

  it('validates chat.message without model field', () => {
    const msg = {
      id: uuid(),
      type: 'chat.message',
      timestamp: Date.now(),
      payload: { content: 'Hello' },
    };
    expect(validateChat(msg)).toBe(true);
  });

  it('validates chat.response with model field', () => {
    const msg = {
      id: uuid(),
      type: 'chat.response',
      timestamp: Date.now(),
      payload: { content: 'Hi there', model: 'qwen/qwq-32b' },
    };
    expect(validateChat(msg)).toBe(true);
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

  it('PROTOCOL_VERSION matches expected format', async () => {
    const { PROTOCOL_VERSION } = await import('../src/handshake.js');
    expect(PROTOCOL_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    expect(PROTOCOL_VERSION).toBe('0.1.0');
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
});
