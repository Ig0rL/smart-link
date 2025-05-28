import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';

import { AuthMiddleware } from '@/apps/api-gateway/middlewares/auth.middleware';
import { AuthConfigService } from '@/apps/auth/configs/env.config';
import { getPostgresConfig } from '@/apps/auth/configs/postgres.config';
import { getRedisConfig } from '@/apps/auth/configs/redis.config';
import { RegisterController } from '@/apps/auth/controllers/v1/register.controller';
import { TokenService } from '@/apps/auth/token.service';
import { ConfigModule } from '@/dynamic-modules/config-service/config.module';
import { RedisModule } from '@/dynamic-modules/redis/redis.module';
import { UserModule } from '@/libs/modules/user/user.module';

import { AuthService } from './auth.service';
import { LoginController } from './controllers/v1/login.controller';

@Module({
	imports: [
		SequelizeModule.forRootAsync(getPostgresConfig()),
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
		UserModule,
	],
	providers: [
		AuthMiddleware,
		AuthService,
		TokenService,
		/**
		 * const USER_REPOSITORY = Symbol('USER_REPOSITORY');
		 * const ANOTHER_MODEL_REPOSITORY = Symbol('ANOTHER_MODEL_REPOSITORY');
		 */
		/**
		 * {
		 *   provide: USER_REPOSITORY,
		 *   useFactory: (userModel: typeof UserModel) => new GenericRepository(userModel),
		 *   inject: [getModelToken(UserModel)],
		 * },
		 * {
		 *   provide: ANOTHER_MODEL_REPOSITORY,
		 *   useFactory: (anotherModel: typeof AnotherModel) => new GenericRepository(anotherModel),
		 *   inject: [getModelToken(AnotherModel)],
		 * },
		 */
		/**
		 * @Inject(USER_REPOSITORY) private userModel: GenericRepository<UserModel>,
		 * @Inject(ANOTHER_MODEL_REPOSITORY) private anotherModel: GenericRepository<AnotherModel>
		 */
	],
	exports: [AuthMiddleware],
	controllers: [LoginController, RegisterController],
})
export class AuthModule {}
