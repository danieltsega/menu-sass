import { Role } from './enums';

export interface JwtPayload {
  userId: string;
  role: Role;
  cafeId?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}