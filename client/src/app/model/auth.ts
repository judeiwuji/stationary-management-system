export interface IAuthRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  role: string;
  redirect: string;
  name: string;
}
