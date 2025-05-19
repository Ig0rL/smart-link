import { Test, TestingModule } from '@nestjs/testing';
import { Expose, Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';

// Мокаем dotenv для контроля над загрузкой конфигурации
jest.mock('dotenv', () => ({
	config: jest.fn(),
}));

class TestConfig {
	@Expose()
	@IsString()
	TEST_STRING: string = 'default';

	@Expose()
	@IsNumber()
	@Transform(({ value }) => Number(value))
	TEST_NUMBER: number = 123;
}

class TestConfigService extends ConfigService<TestConfig> {
	constructor(envFileName?: string) {
		super(TestConfig, envFileName);
	}
}

describe('ConfigModule', () => {
	let module: TestingModule;
	let configService: TestConfigService;
	let originalEnv: NodeJS.ProcessEnv;

	beforeEach(async () => {
		originalEnv = process.env;
		process.env = {};

		jest.clearAllMocks();

		module = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					configServiceClass: TestConfigService,
				}),
			],
		}).compile();

		configService = module.get<TestConfigService>(TestConfigService);
	});

	afterEach(() => {
		process.env = originalEnv;
		jest.clearAllMocks();
	});

	it('Использует значения по умолчанию когда env пустой', () => {
		expect(configService.get('TEST_STRING')).toBe('default');
		expect(configService.get('TEST_NUMBER')).toBe(123);
	});

	it('Загружает значения из env переменных', async () => {
		process.env.TEST_STRING = 'test value';
		process.env.TEST_NUMBER = '456';

		const testModule = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					configServiceClass: TestConfigService,
				}),
			],
		}).compile();

		const testConfig = testModule.get<TestConfigService>(TestConfigService);
		expect(testConfig.get('TEST_STRING')).toBe('test value');
		expect(testConfig.get('TEST_NUMBER')).toBe(456);
	});

	it('Выбрасывает ошибку при неверном типе данных', async () => {
		process.env.TEST_NUMBER = 'not a number';

		await expect(
			Test.createTestingModule({
				imports: [
					ConfigModule.forRoot({
						configServiceClass: TestConfigService,
					}),
				],
			}).compile(),
		).rejects.toThrow('Ошибка при валидации конфигурации:');
	});
});
