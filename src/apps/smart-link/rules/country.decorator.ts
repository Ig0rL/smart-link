import { IComparisonStrategy } from '@/apps/smart-link/strategies/comparison-strategy.interface';

export class CountryDecorator implements IComparisonStrategy {
  constructor(private strategy: IComparisonStrategy) {}
  
  matches(userData: any, dbObject: any): boolean {
    return (
      userData.country === dbObject.country &&
      this.strategy.matches(userData, dbObject)
    );
  }
}
