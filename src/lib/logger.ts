type LogLevel = "INFO" | "WARN" | "ERROR";

interface LogPayload {
  module: "LAYOUT" | "HERO" | "PINCODE" | "CATALOG" | "CHECKOUT" | "ORDERS" | "ADMIN";
  action: string;
  message: string;
  meta?: Record<string, unknown>;
}

export const logger = {
  info: (payload: LogPayload) => log("INFO", payload),
  warn: (payload: LogPayload) => log("WARN", payload),
  error: (payload: LogPayload, error?: unknown) =>
    log("ERROR", {
      ...payload,
      meta: {
        ...payload.meta,
        error: error instanceof Error ? error.message : String(error),
      },
    }),
};

function log(level: LogLevel, payload: LogPayload) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    ...payload,
  };
  if (level === "ERROR") console.error(JSON.stringify(entry));
  else if (level === "WARN") console.warn(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}