/**
 * Error types for the Lucia Agent Protocol.
 */
/** Protocol error codes */
export var ErrorCode;
(function (ErrorCode) {
    /** Generic internal error */
    ErrorCode[ErrorCode["INTERNAL_ERROR"] = 1000] = "INTERNAL_ERROR";
    /** Message failed schema validation */
    ErrorCode[ErrorCode["INVALID_MESSAGE"] = 1001] = "INVALID_MESSAGE";
    /** Unknown message type */
    ErrorCode[ErrorCode["UNKNOWN_TYPE"] = 1002] = "UNKNOWN_TYPE";
    /** Handshake failed or not completed */
    ErrorCode[ErrorCode["HANDSHAKE_FAILED"] = 2000] = "HANDSHAKE_FAILED";
    /** Attestation verification failed */
    ErrorCode[ErrorCode["ATTESTATION_FAILED"] = 2001] = "ATTESTATION_FAILED";
    /** Decryption failed (bad key, corrupted ciphertext) */
    ErrorCode[ErrorCode["DECRYPTION_FAILED"] = 2002] = "DECRYPTION_FAILED";
    /** Message received before handshake completed */
    ErrorCode[ErrorCode["NOT_AUTHENTICATED"] = 2003] = "NOT_AUTHENTICATED";
    /** Tool call failed */
    ErrorCode[ErrorCode["TOOL_ERROR"] = 3000] = "TOOL_ERROR";
    /** Tool call denied by user */
    ErrorCode[ErrorCode["TOOL_DENIED"] = 3001] = "TOOL_DENIED";
    /** Tool call timed out waiting for confirmation */
    ErrorCode[ErrorCode["TOOL_TIMEOUT"] = 3002] = "TOOL_TIMEOUT";
    /** LLM inference failed */
    ErrorCode[ErrorCode["INFERENCE_ERROR"] = 4000] = "INFERENCE_ERROR";
    /** Rate limit exceeded */
    ErrorCode[ErrorCode["RATE_LIMITED"] = 5000] = "RATE_LIMITED";
    /** Schedule operation failed */
    ErrorCode[ErrorCode["SCHEDULE_ERROR"] = 6000] = "SCHEDULE_ERROR";
    /** Schedule not found */
    ErrorCode[ErrorCode["SCHEDULE_NOT_FOUND"] = 6001] = "SCHEDULE_NOT_FOUND";
})(ErrorCode || (ErrorCode = {}));
//# sourceMappingURL=errors.js.map