import { AuthRequest, AuthResponse } from "../models/auth";
import Feedback from "../models/feedback";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  VerifiedToken,
} from "../models/interfaces/token_payload";
import { Roles } from "../models/role";
import Session from "../models/session";
import User from "../models/user";
import { compare } from "bcryptjs";
import { sign, verify, decode } from "jsonwebtoken";

export default class AuthService {
  accessTokenTimeout = process.env.ACCESS_TOKEN_TIMEOUT;
  refreshTokenTimeout = process.env.REFRESH_TOKEN_TIMEOUT;
  jwtSecret = process.env.JWT_SECRET as string;
  jwtIssuer = process.env.JWT_ISSUER;

  private createAccessToken(payload: AccessTokenPayload): string {
    return sign(payload, this.jwtSecret, {
      expiresIn: this.accessTokenTimeout,
      issuer: this.jwtIssuer,
    });
  }

  private createRefreshToken(payload: RefreshTokenPayload) {
    return sign(payload, this.jwtSecret, {
      expiresIn: this.refreshTokenTimeout,
      issuer: this.jwtIssuer,
    });
  }

  decodeToken(token: string) {
    let data: any = null;
    try {
      data = decode(token);
    } catch (error: any) {
      console.log(error);
    }
    return data;
  }

  verifyToken(token: string) {
    const result: VerifiedToken = { data: null, expired: false };
    try {
      result.data = verify(token, this.jwtSecret, {
        issuer: this.jwtIssuer,
      });
    } catch (error: any) {
      console.log(error);
      result.expired = true;
      result.data = this.decodeToken(token);
    }
    return result;
  }

  async refreshToken(data: AccessTokenPayload) {
    const feedback = new Feedback<string>();

    try {
      const session = await Session.findByPk(data.session);
      if (!session) {
        feedback.success = false;
        feedback.message = "Session not found";
        return feedback;
      }

      if (!session.valid) {
        feedback.success = false;
        feedback.message = "Session closed";
        return feedback;
      }

      const verified = this.verifyToken(session.refreshToken);
      if (verified.expired) {
        session.valid = false;
        session.save();
        feedback.success = false;
        feedback.message = "Expired session";
        return feedback;
      }

      const accessToken = this.createAccessToken({
        user: session.userId,
        session: session.id,
      });

      const refreshToken = this.createRefreshToken({ user: session.userId });
      await Session.update(
        { refreshToken: refreshToken },
        { where: { id: data.session } }
      );
      feedback.data = accessToken;
    } catch (error) {
      feedback.success = false;
      feedback.message = "Server was unable to refresh session";
      console.log(error);
    }
    return feedback;
  }

  async authenticate(data: AuthRequest) {
    const feedback = new Feedback<AuthResponse>();
    try {
      const user = await User.findOne({ where: { email: data.email } });

      if (!user) {
        feedback.success = false;
        feedback.message = "Wrong password and email combination";
        return feedback;
      }

      if (!(await compare(data.password, user.password))) {
        feedback.success = false;
        feedback.message = "Wrong password and email combination";
        return feedback;
      }

      await Session.update({ valid: false }, { where: { userId: user.id } });
      const refreshToken = this.createRefreshToken({ user: user.id });
      const session = await Session.create({
        refreshToken,
        userId: user.id,
        userAgent: data.userAgent,
        valid: true,
      });

      feedback.data = {
        token: this.createAccessToken({
          user: user.id,
          session: session.id,
        }),
        role: Roles[user.role].toLowerCase(),
        redirect: `/dashboard`,
        name: `${user.firstname} ${user.lastname}`,
      };
    } catch (error) {
      feedback.success = false;
      feedback.message = "Authentication failed";
    }
    return feedback;
  }

  authorize(role: Roles, allowedRoles: Roles[]) {
    return allowedRoles.includes(role);
  }

  async logout(token: string) {
    try {
      const verified = this.verifyToken(token);
      if (verified.data) {
        await Session.destroy({ where: { id: verified.data.session } });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async isValidSession(id: number) {
    try {
      const session = await Session.findOne({ where: { id, valid: true } });
      console.log(`${id}: Session: ${session}`);
      return session !== null;
    } catch (error) {
      console.log(error);
    }
    return false;
  }
}
