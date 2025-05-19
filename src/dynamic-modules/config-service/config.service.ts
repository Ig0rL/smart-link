import * as path from 'path';

import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import * as dotenv from 'dotenv';

@Injectable()
export abstract class ConfigService<T extends Record<string, any>> {
	protected config: T;

	protected constructor(configClass: new () => T, envFileName?: string) {
		const envPath = path.join(process.cwd(), envFileName || '.env');

		dotenv.config({
			path: envPath,
			override: true, // разрешаем переопределять уже существующие переменные окружения в process.env.
		});

		this.config = plainToInstance(configClass, process.env, {
			excludeExtraneousValues: true,
			exposeDefaultValues: true,
		});

		const errors = validateSync(this.config);
		if (errors.length > 0) {
			throw new Error(`Ошибка при валидации конфигурации: ${errors}`);
		}
	}

	get<K extends keyof T>(key: K): T[K] {
		return this.config[key];
	}
}
