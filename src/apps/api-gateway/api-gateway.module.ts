import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ApiGatewayConfigService } from '@/apps/api-gateway/configs/env.config';
import { EXCLUDED_API_AUTH_MIDDLEWARE } from '@/apps/api-gateway/constants';
import { LoginController } from '@/apps/api-gateway/controllers/api/auth/v1/login.controller';
import { RegisterController } from '@/apps/api-gateway/controllers/api/auth/v1/register.controller';
import { AuthProvider } from '@/apps/api-gateway/http-clients/auth/auth-provider';
import { AuthService } from '@/apps/api-gateway/http-clients/auth/auth.service';
import { AuthMiddleware } from '@/apps/api-gateway/middlewares/auth.middleware';
import { ConfigModule } from '@/dynamic-modules/config-service/config.module';

@Module({
	imports: [
		HttpModule,
		ConfigModule.forRoot({
			envFileName: '.env-api-gateway',
			configServiceClass: ApiGatewayConfigService,
		}),
		JwtModule.registerAsync({
			inject: [ApiGatewayConfigService],
			useFactory: (configService: ApiGatewayConfigService) => ({
				secret: configService.get('JWT_SECRET_KEY'),
				signOptions: {
					expiresIn: configService.get('JWT_ACCESS_TOKEN_EXPIRE'),
				},
			}),
		}),
	],
	providers: [AuthProvider, AuthService, AuthMiddleware],
	controllers: [LoginController, RegisterController],
})
export class ApiGatewayModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.exclude(...EXCLUDED_API_AUTH_MIDDLEWARE)
			.forRoutes('api/*');
	}
}
