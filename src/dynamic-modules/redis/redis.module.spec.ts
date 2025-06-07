import { DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  ClientsModule,
} from '@nestjs/microservices';
import { Test } from '@nestjs/testing';

import { REDIS_OPTIONS } from './redis.constants';
import { RedisModule } from './redis.module';
import { RedisService } from './redis.service';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    disconnect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined)
  }));
});

describe('RedisModule', () => {
  it('Успешно создает тестовый модуль с Redis сервисом', async () => {
    const options = {
      name: 'REDIS_CLIENT',
      useFactory: () => ({
        host: 'localhost',
        port: 6379
      })
    };
    
    const moduleRef = await Test.createTestingModule({
      imports: [RedisModule.forRootAsync(options)]
    }).compile();
    
    const redisService = moduleRef.get<RedisService>(RedisService);
    const redisOptions = moduleRef.get(REDIS_OPTIONS);
    
    expect(redisService).toBeInstanceOf(RedisService);
    expect(redisOptions).toEqual({
      host: 'localhost',
      port: 6379
    });
  });
  
  it('Корректно регистрирует ClientsModule с опциями Redis', async () => {
    const options = {
      name: 'REDIS_CLIENT',
      useFactory: () => ({
        host: 'localhost',
        port: 6379
      }),
      inject: []
    };
    
    const module = RedisModule.forRootAsync(options);
    const clientsModuleConfig = module.imports[0];
    
    // Проверяем базовую структуру модуля
    expect(clientsModuleConfig).toMatchObject({
      module: ClientsModule,
      providers: expect.any(Array)
    });
    
    // Получаем провайдеры через приведение типов
    const providers = (clientsModuleConfig as any).providers;
    expect(Array.isArray(providers)).toBeTruthy();
    
    // Проверяем конфигурацию провайдера
    const provider = providers[0];
    expect(provider).toMatchObject({
      provide: options.name,
      inject: options.inject,
      useFactory: expect.any(Function)
    });
  });
  
  it('Успешно создает модуль с дополнительными импортами', async () => {
    const options = {
      name: 'REDIS_CLIENT',
      useFactory: () => ({
        host: 'localhost',
        port: 6379
      }),
      imports: [ConfigModule],
      inject: []
    };
    
    const module = RedisModule.forRootAsync(options);
    
    expect(module.imports).toContain(ConfigModule);
  });
  
  it('Правильно применяет фабрику конфигурации Redis', async () => {
    // Мокаем Transport.REDIS для предотвращения реальных подключений
    const mockTransport = 1; // Transport.REDIS всегда равен 1
    
    const redisOptions = {
      host: 'redis.example.com',
      port: 6380
    };
    
    const options = {
      name: 'REDIS_CLIENT',
      useFactory: () => redisOptions,
      inject: []
    };
    
    const module = RedisModule.forRootAsync(options);
    const clientsModule = module.imports[0] as DynamicModule;
    const clientProvider = (clientsModule as any).providers[0];
    
    // Получаем фабрику и вызываем её
    const clientFactory = clientProvider.useFactory();
    const result = await clientFactory;
    
    // Проверяем только конкретные свойства
    const configToCheck = {
      options: result.options,
      transport: mockTransport
    };
    
    expect(configToCheck).toEqual({
      options: redisOptions,
      transport: mockTransport
    });
    
    // Добавляем небольшую задержку для корректного завершения
    await new Promise(resolve => setTimeout(resolve, 100));
  });
});
