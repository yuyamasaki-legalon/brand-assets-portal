export const COMMENT_DEBUG_HEADER_NAME = "X-Aegis-Comment-Debug";

const LOCAL_COMMENT_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

export const isLocalCommentHost = (hostname: string): boolean => {
  return LOCAL_COMMENT_HOSTS.has(hostname);
};

export const isLocalCommentDebugEnabled = (): boolean => {
  return globalThis.__AEGIS_LOCAL_COMMENT_DEBUG__ === true;
};

export const createCommentDebugHeaders = (enabled: boolean): Record<string, string> | undefined => {
  if (!enabled) {
    return undefined;
  }

  return {
    [COMMENT_DEBUG_HEADER_NAME]: "1",
  };
};

export const isCommentDebugRequest = (request: Request): boolean => {
  return request.headers.get(COMMENT_DEBUG_HEADER_NAME) === "1";
};
