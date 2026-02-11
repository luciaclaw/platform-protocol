# Lucia Agent Protocol v0.1

## Overview

The Lucia Agent Protocol defines the communication interface between the PWA client and the Agent CVM (Confidential Virtual Machine). All communication occurs over WebSocket with end-to-end encryption using ECDH P-256 key agreement and AES-256-GCM symmetric encryption.

## Transport

- **Protocol**: WebSocket (wss://)
- **Endpoint**: `wss://<cvm-host>/ws`
- **Encoding**: JSON (UTF-8) for all messages
- **Encryption**: AES-256-GCM after handshake completion

## Message Envelope

Every WebSocket frame contains a JSON-encoded `MessageEnvelope`:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "chat.message",
  "timestamp": 1707500000000,
  "payload": { ... }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID v4) | Unique message identifier |
| `type` | string | Message type discriminator |
| `timestamp` | number | Unix timestamp in milliseconds |
| `payload` | object | Type-specific payload |

## Connection Lifecycle

```
Client                              Server (Agent CVM)
  |                                      |
  |--- WebSocket connect --------------->|
  |                                      |
  |--- handshake.init ------------------>|  (client ECDH public key)
  |                                      |
  |<-- handshake.response ---------------|  (server ECDH public key + attestation)
  |                                      |
  |    [Client verifies attestation]     |
  |    [Both derive AES-256-GCM key]     |
  |                                      |
  |--- handshake.complete (encrypted) -->|  (confirms key derivation)
  |                                      |
  |=== All subsequent messages encrypted =|
  |                                      |
  |--- encrypted { chat.message } ------>|
  |<-- encrypted { chat.response } ------|
  |    ...                               |
```

## E2E Handshake

### Step 1: Client Init

Client generates an ECDH P-256 key pair using Web Crypto API with `extractable: false` for the private key. Sends the public key in SPKI format (base64-encoded).

```json
{
  "id": "...",
  "type": "handshake.init",
  "timestamp": 1707500000000,
  "payload": {
    "clientPublicKey": "<base64 SPKI>",
    "protocolVersion": "0.1.0"
  }
}
```

### Step 2: Server Response

Server generates its own ECDH P-256 key pair and responds with the public key plus a TEE attestation report proving it's running inside a genuine Intel TDX CVM.

```json
{
  "id": "...",
  "type": "handshake.response",
  "timestamp": 1707500000001,
  "payload": {
    "serverPublicKey": "<base64 SPKI>",
    "protocolVersion": "0.1.0",
    "attestation": {
      "tdx": {
        "quote": "<base64 TDX quote>",
        "measurements": {
          "mrtd": "<hex>",
          "rtmr0": "<hex>",
          "rtmr1": "<hex>",
          "rtmr2": "<hex>",
          "rtmr3": "<hex>"
        }
      },
      "generatedAt": 1707500000001,
      "imageHash": "sha256:<hex>"
    }
  }
}
```

### Step 3: Client Complete

Both sides derive the shared secret using ECDH, then derive an AES-256-GCM key. The client sends a confirmation message **encrypted** with the derived key to prove key agreement succeeded.

The inner (decrypted) message:
```json
{
  "id": "...",
  "type": "handshake.complete",
  "timestamp": 1707500000002,
  "payload": { "status": "ok" }
}
```

Sent as:
```json
{
  "id": "...",
  "type": "encrypted",
  "timestamp": 1707500000002,
  "payload": {
    "iv": "<base64 12-byte IV>",
    "ciphertext": "<base64 AES-GCM ciphertext>"
  }
}
```

### Key Derivation

1. ECDH key agreement: `deriveBits()` with peer's public key → 256 bits of shared secret
2. AES-GCM key: `deriveKey()` from shared bits → AES-GCM 256-bit key, non-extractable

## Encrypted Messages

After handshake, all messages are wrapped in an `encrypted` envelope:

```json
{
  "id": "<UUID>",
  "type": "encrypted",
  "timestamp": 1707500000100,
  "payload": {
    "iv": "<base64 12-byte random IV>",
    "ciphertext": "<base64 AES-GCM ciphertext>"
  }
}
```

The `ciphertext` decrypts to the JSON of the inner `MessageEnvelope`.

- Each message MUST use a fresh random 12-byte IV
- AES-GCM provides both confidentiality and integrity

## Chat Messages

### User Message (`chat.message`)

```json
{
  "type": "chat.message",
  "payload": {
    "content": "What's on my calendar today?"
  }
}
```

### Agent Response (`chat.response`)

```json
{
  "type": "chat.response",
  "payload": {
    "content": "You have 3 meetings today...",
    "toolCalls": [
      {
        "callId": "tc_001",
        "name": "calendar.list",
        "arguments": { "date": "2026-02-11" }
      }
    ]
  }
}
```

### Streaming Response

For long responses, the server streams chunks:

```json
{ "type": "chat.stream.chunk", "payload": { "responseId": "...", "delta": "You have ", "index": 0 } }
{ "type": "chat.stream.chunk", "payload": { "responseId": "...", "delta": "3 meetings", "index": 1 } }
{ "type": "chat.stream.end", "payload": { "responseId": "...", "content": "You have 3 meetings..." } }
```

## Tool Calls

### Tool Call (`tool.call`)

Agent announces a tool it wants to execute:

```json
{
  "type": "tool.call",
  "payload": {
    "callId": "tc_001",
    "name": "gmail.send",
    "arguments": { "to": "user@example.com", "subject": "...", "body": "..." }
  }
}
```

### Tool Result (`tool.result`)

```json
{
  "type": "tool.result",
  "payload": {
    "callId": "tc_001",
    "success": true,
    "result": { "messageId": "msg_abc123" }
  }
}
```

## User Confirmations

High-risk actions require explicit user approval.

### Confirmation Request (`tool.confirm.request`)

```json
{
  "type": "tool.confirm.request",
  "payload": {
    "toolCall": {
      "callId": "tc_002",
      "name": "gmail.send",
      "arguments": { "to": "boss@company.com", "subject": "Resignation" }
    },
    "description": "Send email to boss@company.com with subject 'Resignation'",
    "risk": "high",
    "timeoutMs": 60000
  }
}
```

### Confirmation Response (`tool.confirm.response`)

```json
{
  "type": "tool.confirm.response",
  "payload": {
    "callId": "tc_002",
    "approved": false,
    "note": "Don't send that!"
  }
}
```

## Error Messages

```json
{
  "type": "error",
  "payload": {
    "code": 2002,
    "message": "Decryption failed: invalid ciphertext",
    "relatedMessageId": "550e8400-..."
  }
}
```

See `ErrorCode` enum for all error codes.

## Security Requirements

1. The handshake MUST complete before any chat/tool messages are accepted
2. All post-handshake messages MUST be encrypted (server rejects plaintext)
3. Each AES-GCM encryption MUST use a fresh random 12-byte IV
4. ECDH private keys MUST be non-extractable (Web Crypto API)
5. The client SHOULD verify the attestation report before sending `handshake.complete`
6. Origin validation: server MUST reject WebSocket connections from unexpected origins
