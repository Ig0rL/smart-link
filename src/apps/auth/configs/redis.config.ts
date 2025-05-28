import { RedisOptions } from 'ioredis';

import { AuthConfigService } from '@/apps/auth/configs/env.config';
import { REDIS_MODULE_PROVIDER } from '@/dynamic-modules/redis/redis.constants';

export const getRedisConfig = () => ({
	inject: [AuthConfigService],
	name: REDIS_MODULE_PROVIDER,
	useFactory: (configService: AuthConfigService): RedisOptions => ({
		host: configService.get('REDIS_HOST'),
		port: configService.get('REDIS_PORT'),
		db: configService.get('REDIS_DB'),
		password: configService.get('REDIS_PASSWORD'),
	}),
});
