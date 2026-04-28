// API Types (shared between frontend and backend)
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
}
