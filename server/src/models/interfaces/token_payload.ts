export interface AccessTokenPayload {
  user: number;
  session: number;
}

export interface RefreshTokenPayload {
  user: number;
}

export interface VerifiedToken {
  data: any;
  expired: boolean;
}
