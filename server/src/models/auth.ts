export interface AuthRequest {
  email: string;
  password: string;
  userAgent: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  redirect: string;
  name: string;
}
