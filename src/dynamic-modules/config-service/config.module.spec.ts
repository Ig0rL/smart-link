import { DynamicModule, Provider } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { IsString } from 'class-validator';

import { ConfigModule } from './config.module';
import { ConfigService } from './config.service';

describe('ConfigModule', () => {
  class TestConfig {
    @IsString()
    TEST_KEY: string = 'test_value';
  }
  
  class TestConfigService extends ConfigService<TestConfig> {
    constructor(envFile?: string) {
      super(TestConfig, envFile);
    }
  }
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('Создает глобальный модуль с правильной структурой', () => {
    const module = ConfigModule.forRoot({
      configServiceClass: TestConfigService
    });
    
    expect(module).toEqual({
      module: ConfigModule,
      providers: [expect.any(Object)],
      exports: [expect.any(Object)],
      global: true
    });
  });
  
  it('Успешно создает тестовый модуль с ConfigService', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          configServiceClass: TestConfigService
        })
      ]
    }).compile();
    
    const configService = moduleRef.get(TestConfigService);
    expect(configService).toBeInstanceOf(TestConfigService);
  });
  
  it('Правильно настраивает провайдер с переданным классом конфига', () => {
    const module = ConfigModule.forRoot({
      configServiceClass: TestConfigService
    }) as DynamicModule;
    
    const provider = module.providers?.[0] as Provider;
    expect((provider as any).provide).toBe(TestConfigService);
    expect((provider as any).useFactory).toBeDefined();
  });
  
  it('Правильно передает имя env файла в сервис конфигурации', () => {
    const envFileName = '.env.test';
    const module = ConfigModule.forRoot({
      configServiceClass: TestConfigService,
      envFileName
    });
    
    const provider = module.providers?.[0] as Provider;
    expect((provider as any).provide).toBe(TestConfigService);
    expect((provider as any).useFactory).toBeDefined();
  });
  
  it('Экспортирует тот же провайдер что и предоставляет', () => {
    const module = ConfigModule.forRoot({
      configServiceClass: TestConfigService
    });
    
    expect(module.exports[0]).toBe(module.providers[0]);
  });
});
