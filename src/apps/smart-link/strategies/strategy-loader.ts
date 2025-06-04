import * as path from 'node:path';

import { ICreateStrategy } from '@/apps/smart-link/strategies/comparison-strategy.interface';

type Constructor<T> = new (...args: any[]) => T;

export class StrategyLoader {
  static async loadStrategy(strategyPath: string): Promise<ICreateStrategy> {
    try {
      const normalizedPath = path.resolve(process.cwd(), strategyPath + '.js');
      
      const module = await import(normalizedPath);
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
