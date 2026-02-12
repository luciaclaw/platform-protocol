/**
 * TEE Attestation report types.
 *
 * Used during handshake to prove the server is running inside a genuine
 * Intel TDX (+ optionally NVIDIA CC) Trusted Execution Environment.
 */
/** Intel TDX attestation evidence */
export interface TdxAttestation {
    /** Base64-encoded TDX quote */
    quote: string;
    /** Measurement registers (MRTD, RTMR0-3) */
    measurements: {
        /** TD measurement — hash of initial TD image */
        mrtd: string;
        /** Runtime measurement register 0 — firmware */
        rtmr0: string;
        /** Runtime measurement register 1 — OS/kernel */
        rtmr1: string;
        /** Runtime measurement register 2 — application */
        rtmr2: string;
        /** Runtime measurement register 3 — runtime data */
        rtmr3: string;
    };
    /** Collateral data for offline verification */
    collateral?: string;
}
/** NVIDIA Confidential Computing attestation (for GPU TEE) */
export interface NvidiaCcAttestation {
    /** Base64-encoded NVIDIA CC attestation report */
    report: string;
    /** GPU model identifier */
    gpuModel: string;
    /** Driver version */
    driverVersion: string;
}
/** Combined attestation report */
export interface AttestationReport {
    /** Intel TDX attestation (always present for CVM) */
    tdx: TdxAttestation;
    /** NVIDIA CC attestation (present when GPU TEE is active) */
    nvidiaCc?: NvidiaCcAttestation;
    /** Timestamp when attestation was generated (Unix ms) */
    generatedAt: number;
    /** CVM image hash for reproducible build verification */
    imageHash: string;
    /** Phala Trust Center verification URL */
    verificationUrl?: string;
}
//# sourceMappingURL=attestation.d.ts.map