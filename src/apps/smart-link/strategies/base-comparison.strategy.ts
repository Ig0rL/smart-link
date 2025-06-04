import { IComparisonStrategy } from '@/apps/smart-link/strategies/comparison-strategy.interface';

export class BaseComparisonStrategy implements IComparisonStrategy {
  matches(_userData: any, _dbObject: any): boolean {
    return true;
  }
}
