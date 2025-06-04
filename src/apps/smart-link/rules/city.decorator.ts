import { IComparisonStrategy } from '@/apps/smart-link/strategies/comparison-strategy.interface';

export class CityDecorator implements IComparisonStrategy {
  constructor(private strategy: IComparisonStrategy) {}
  
  matches(userData: any, dbObject: any): boolean {
    return (
      userData.city === dbObject.city &&
      this.strategy.matches(userData, dbObject)
    );
  }
}
