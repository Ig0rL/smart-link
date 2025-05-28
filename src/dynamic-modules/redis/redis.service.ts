import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import Redis from 'ioredis';
import type { RedisOptions } from 'ioredis';

import { REDIS_OPTIONS } from './redis.constants';

@Injectable()
export class RedisService {
	private readonly client: Redis;

	constructor(
		@Inject(REDIS_OPTIONS)
		redisOptions: RedisOptions,
	) {
		this.client = new Redis(redisOptions);

		this.client.on('error', (error) => {
			console.error(`Redis connection error: ${error}`);
		});
	}

	getClient(): Redis {
		return this.client;
	}

	async set(key: string, value: any, ttl?: number): Promise<void> {
		try {
			await this.client.set(key, JSON.stringify(value));
			if (ttl) {
				await this.client.expire(key, ttl);
			}
		} catch (error) {
			console.error('Ошибка записи в Redis', error);
			throw new InternalServerErrorException('Ошибка записи в Redis');
		}
	}

	async get(key: string): Promise<any> {
		let result;
		try {
			const redisData = await this.client.get(key);
			result = redisData ? JSON.parse(redisData) : null;
		} catch (error) {
			console.error('Ошибка чтения из Redis', error);
			throw new InternalServerErrorException('Ошибка чтения из Redis');
		}
		return result;
	}

	async del(key: string): Promise<void> {
		try {
			await this.client.del(key);
		} catch (error) {
			console.error('Ошибка удаления из Redis', error);
			throw new InternalServerErrorException('Ошибка удаления из Redis');
		}
	}

	async quit(): Promise<void> {
		await this.client.quit(); // Закрытие соединения с Redis
	}
}
