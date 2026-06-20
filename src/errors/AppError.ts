import { ERROR_CODES, USER_ERROR_MESSAGES, type ErrorCode } from "./errorCodes.js";

export interface AppErrorOptions {
  readonly code: ErrorCode;
  readonly message?: string;
  readonly userMessage?: string;
  readonly provider?: string;
  readonly status?: number;
  readonly retryable?: boolean;
  readonly cause?: unknown;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly userMessage: string;
  readonly provider: string | null;
  readonly status: number | null;
  readonly retryable: boolean;
  readonly cause?: unknown;

  constructor(options: AppErrorOptions) {
    super(options.message ?? USER_ERROR_MESSAGES[options.code]);
    this.name = "AppError";
    this.code = options.code;
    this.userMessage = options.userMessage ?? USER_ERROR_MESSAGES[options.code];
    this.provider = options.provider ?? null;
    this.status = options.status ?? null;
    this.retryable = options.retryable ?? false;
    this.cause = options.cause;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.userMessage,
      provider: this.provider,
      status: this.status,
      retryable: this.retryable
    };
  }
}

export function toAppError(error: unknown, fallbackCode: ErrorCode = ERROR_CODES.PROVIDER_ERROR): AppError {
  if (error instanceof AppError) {
    return error;
  }
  return new AppError({ code: fallbackCode, cause: error });
}
