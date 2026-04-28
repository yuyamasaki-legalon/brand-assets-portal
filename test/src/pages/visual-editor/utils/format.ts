export const compressWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

export const truncate = (value: string, maxLength: number) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}…`;
};

export const formatDuration = (durationMs: number) => {
  if (durationMs < 1000) return `${Math.round(durationMs)} ms`;
  return `${(durationMs / 1000).toFixed(1)} s`;
};

export const quoteForShell = (value: string) => `'${value.replace(/'/g, `'"'"'`)}'`;
