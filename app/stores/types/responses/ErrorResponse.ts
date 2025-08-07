export interface ErrorResponse {
  timestamp: string; // Instant = ISO string côté JS
  status: number;
  error: string;
  message: string;
  path: string;
}
