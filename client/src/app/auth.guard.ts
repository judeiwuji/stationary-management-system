import { AuthService } from './services/auth.service';

export const authGuard = (authService: AuthService) => {
  return AuthService.getCredentials() != null;
};
