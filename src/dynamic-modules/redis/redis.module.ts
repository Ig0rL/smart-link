import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
	ClientProvider,
	ClientsModule,
	Transport,
} from '@nestjs/microservices';

import { REDIS_OPTIONS } from './redis.constants';
import { IRedisServiceOptions } from './redis.interfaces';
import { RedisService } from './redis.service';

@Global()
@Module({
	imports: [ConfigModule],
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {
	static forRootAsync(options: IRedisServiceOptions): DynamicModule {
		const asyncOptionsProvider = {
			provide: REDIS_OPTIONS,
			useFactory: options.useFactory,
			inject: options.inject || [],
		};

		return {
			module: RedisModule,
			imports: [
				ClientsModule.registerAsync([
					{
						inject: options.inject || [],
						name: options.name,
						useFactory: async (...args: any[]): Promise<ClientProvider> => {
							const redisOptions = await options.useFactory(...args);
							return {
								transport: Transport.REDIS,
								options: redisOptions,
							};
						},
					},
				]),
				...(options.imports || []),
			],
			providers: [RedisService, asyncOptionsProvider],
			exports: [RedisService, asyncOptionsProvider],
		};
	}
}
