import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import Redis from 'ioredis';

import { REDIS_OPTIONS } from './redis.constants';
import { RedisService } from './redis.service';

jest.mock('ioredis');

const MockRedis = Redis as jest.MockedClass<typeof Redis>;

describe('RedisService', () => {
	let service: RedisService;
	let mockRedisClient;
	let consoleErrorSpy;

	beforeEach(async () => {
		consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
		mockRedisClient = {
			set: jest.fn(),
			get: jest.fn(),
			del: jest.fn(),
			quit: jest.fn(),
			expire: jest.fn(),
			on: jest.fn(),
		};

		MockRedis.mockImplementation(() => mockRedisClient);

		const module = await Test.createTestingModule({
			providers: [
				RedisService,
				{
					provide: REDIS_OPTIONS,
					useValue: {
						host: 'localhost',
						port: 6379,
					},
				},
			],
		}).compile();

		service = module.get<RedisService>(RedisService);
	});

	afterEach(() => {
		consoleErrorSpy.mockRestore();
	});

	it('Успешно сохраняет значение в Redis', async () => {
		mockRedisClient.set.mockResolvedValue('OK');

		await service.set('key', { data: 'value' });

		expect(mockRedisClient.set).toHaveBeenCalledWith('key', '{"data":"value"}');
	});

	it('Устанавливает TTL при сохранении значения', async () => {
		mockRedisClient.set.mockResolvedValue('OK');
		mockRedisClient.expire.mockResolvedValue(1);

		await service.set('key', 'value', 60);

		expect(mockRedisClient.expire).toHaveBeenCalledWith('key', 60);
	});

	it('Выбрасывает ошибку при неудачной записи в Redis', async () => {
		mockRedisClient.set.mockRejectedValue(new Error('Redis error'));

		await expect(service.set('key', 'value')).rejects.toThrow(
			InternalServerErrorException,
		);
	});

	it('Успешно получает значение из Redis', async () => {
		mockRedisClient.get.mockResolvedValue('{"data":"value"}');

		const result = await service.get('key');

		expect(result).toEqual({ data: 'value' });
	});

	it('Возвращает null если ключ не найден', async () => {
		mockRedisClient.get.mockResolvedValue(null);

		const result = await service.get('non-existent');

		expect(result).toBeNull();
	});

	it('Выбрасывает ошибку при неудачном чтении из Redis', async () => {
		mockRedisClient.get.mockRejectedValue(new Error('Redis error'));

		await expect(service.get('key')).rejects.toThrow(
			InternalServerErrorException,
		);
	});

	it('Успешно удаляет значение из Redis', async () => {
		mockRedisClient.del.mockResolvedValue(1);

		await service.del('key');

		expect(mockRedisClient.del).toHaveBeenCalledWith('key');
	});

	it('Выбрасывает ошибку при неудачном удалении из Redis', async () => {
		mockRedisClient.del.mockRejectedValue(new Error('Redis error'));

		await expect(service.del('key')).rejects.toThrow(
			InternalServerErrorException,
		);
	});

	it('Закрывает соединение с Redis', async () => {
		mockRedisClient.quit.mockResolvedValue('OK');

		await service.quit();

		expect(mockRedisClient.quit).toHaveBeenCalled();
	});
});
