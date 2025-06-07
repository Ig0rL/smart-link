import * as path from 'node:path';

import { ICreateStrategy } from '@/apps/smart-link/strategies/comparison-strategy.interface';

import { StrategyLoader } from './strategy-loader';

type Constructor<T> = new (...args: any[]) => T;

// Объявляем глобальный тип для mockImport
declare global {
  // eslint-disable-next-line no-var
  var mockImport: jest.Mock;
}

jest.mock('node:path', () => ({
  resolve: jest.fn().mockReturnValue('/fake/path/strategy.js')
}));

jest.mock('./strategy-loader', () => {
  const originalModule = jest.requireActual('./strategy-loader');
  return {
    ...originalModule,
    StrategyLoader: {
      loadStrategy: async (strategyPath: string): Promise<ICreateStrategy> => {
        try {
          const normalizedPath = path.resolve(process.cwd(), strategyPath + '.js');
          const module = await global.mockImport(normalizedPath);
          const strategyClass = Object.values(module)[0] as Constructor<ICreateStrategy>;
          
          if (typeof strategyClass !== 'function') {
            throw new Error('Импортированный класс не является конструктором');
          }
          
          return new strategyClass();
        } catch (error) {
          throw new Error(`Не удалось загрузить стратегию: ${error.message}`);
        }
      }
    }
  };
});

describe('StrategyLoader', () => {
  const mockStrategy = class implements ICreateStrategy {
    createStrategy() {
      return { matches: () => true };
    }
  };
  
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    global.mockImport = jest.fn();
  });
  
  it('Успешно загружает и создает стратегию', async () => {
    global.mockImport.mockResolvedValue({ default: mockStrategy });
    
    const result = await StrategyLoader.loadStrategy('./dummy-strategy');
    
    expect(result).toBeDefined();
    expect(result.createStrategy).toBeDefined();
    expect(path.resolve).toHaveBeenCalledWith(process.cwd(), './dummy-strategy.js');
  });
  
  it('Выбрасывает ошибку при неверном пути', async () => {
    global.mockImport.mockRejectedValue(new Error('Module not found'));
    
    await expect(StrategyLoader.loadStrategy('invalid/path'))
      .rejects
      .toThrow('Не удалось загрузить стратегию: Module not found');
  });
  
  it('Выбрасывает ошибку, если импортированный класс не является конструктором', async () => {
    global.mockImport.mockResolvedValue({ default: 'not a constructor' });
    
    await expect(StrategyLoader.loadStrategy('invalid-class'))
      .rejects
      .toThrow('Не удалось загрузить стратегию: Импортированный класс не является конструктором');
  });
});
