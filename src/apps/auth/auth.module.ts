import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthMiddleware } from '@/apps/api-gateway/middlewares/auth.middleware';
import { AuthConfigService } from '@/apps/auth/configs/env.config';
import { getRedisConfig } from '@/apps/auth/configs/redis.config';
import { ConfigModule } from '@/dynamic-modules/config-service/config.module';
import { RedisModule } from '@/dynamic-modules/redis/redis.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFileName: '.env-auth',
			configServiceClass: AuthConfigService,
		}),
		JwtModule.registerAsync({
			inject: [AuthConfigService],
			useFactory: (configService: AuthConfigService) => ({
				secret: configService.get('JWT_SECRET_KEY'),
				signOptions: {
					expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRE'),
				},
			}),
		}),
		RedisModule.forRootAsync(getRedisConfig()),
	],
	providers: [AuthMiddleware],
	exports: [AuthMiddleware],
})
export class AuthModule {}
