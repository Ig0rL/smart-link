import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUser } from '@/libs/interfaces';

import { AuthConfigService } from './configs/env.config';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: AuthConfigService,
  ) {}
  
  async generateTokens(user: IUser) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRE'),
      }),
    ]);
    
    return {
      accessToken,
      refreshToken,
    };
  }
}
