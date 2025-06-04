import { IComparisonStrategy } from '@/apps/smart-link/strategies/comparison-strategy.interface';

export class DatetimeDecorator implements IComparisonStrategy {
  constructor(private strategy: IComparisonStrategy) {}
  
  matches(userData: any, dbObject: any): boolean {
    const userDate = new Date(userData.datetime);
    const dbDate = new Date(dbObject.datetime);
    return (
      userDate.toISOString().split('T')[0] <= dbDate.toISOString().split('T')[0] &&
      this.strategy.matches(userData, dbObject)
    );
  }
}
