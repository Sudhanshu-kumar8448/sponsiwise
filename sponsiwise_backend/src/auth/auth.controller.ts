import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ChangePasswordDto } from './dto';
import { AuthGuard } from '../common/guards';
import { CurrentUser } from '../common/decorators';
import type { JwtPayloadWithClaims } from './interfaces';
import type { AppConfig, JwtConfig } from '../common/config';

/**
 * AuthController exposes authentication HTTP endpoints.
 * Responsibilities:
 * - POST /auth/register
 * - POST /auth/login
 * - POST /auth/refresh
 * - POST /auth/logout
 * - GET  /auth/me
 */
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * GET /auth/me
   * Returns the authenticated user's profile from the access_token cookie.
   * Used by the frontend middleware to verify auth state server-side.
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: JwtPayloadWithClaims) {
    return this.authService.getMe(user.sub);
  }

  /**
   * Register a new user.
   * Returns the created user without password.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  /**
   * Login user and set access + refresh tokens in HTTP-only cookies.
   * Returns user info without tokens in response body.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);

    this.setAccessTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);

    return {
      message: 'Login successful',
      user,
    };
  }

  /**
   * Refresh access + refresh tokens.
   * Reads refresh token from HTTP-only cookie.
   * Sets new token pair as HTTP-only cookies.
   * Returns user info without tokens in response body.
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const incomingRefreshToken = req.cookies?.refresh_token;

    if (!incomingRefreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken, refreshToken, user } =
      await this.authService.refreshTokens(incomingRefreshToken);

    this.setAccessTokenCookie(res, accessToken);
    this.setRefreshTokenCookie(res, refreshToken);

    return {
      message: 'Tokens refreshed',
      user,
    };
  }

  // ─── PRIVATE HELPERS ──────────────────────────────────────

  /**
   * Set access token as HTTP-only cookie.
   * path: '/' — available for all routes.
   */
  private setAccessTokenCookie(res: Response, accessToken: string): void {
    const isProduction = this.isProduction();

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });
  }

  /**
   * Set refresh token as HTTP-only cookie.
   * path: '/auth/refresh' — only sent to the refresh endpoint,
   * minimizing exposure on every request.
   */
  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const isProduction = this.isProduction();
    const jwtConfig = this.configService.get<JwtConfig>('jwt');
    const refreshExpiresIn = jwtConfig?.refreshExpiresIn || '7d';

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: this.parseDurationMs(refreshExpiresIn),
      path: '/auth/refresh',
    });
  }

  private isProduction(): boolean {
    const appConfig = this.configService.get<AppConfig>('app');
    return appConfig?.nodeEnv === 'production';
  }

  /**
   * Parse duration string (e.g. '7d') to milliseconds.
   */
  private parseDurationMs(duration: string): number {
    const units: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };
    const match = duration.match(/^(\d+)([smhd])$/);
    if (!match) return 7 * 24 * 60 * 60 * 1000;
    return parseInt(match[1], 10) * units[match[2]];
  }

  /**
   * PATCH /auth/change-password
   * Change the authenticated user's password.
   */
  @Patch('change-password')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(@CurrentUser() user: JwtPayloadWithClaims, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(user.sub, dto.currentPassword, dto.newPassword);
  }

  // Future: @Post('logout')
}
