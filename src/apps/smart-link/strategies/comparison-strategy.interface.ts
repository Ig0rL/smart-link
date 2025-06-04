export interface IComparisonStrategy {
  matches(userData: any, dbObject: any): boolean;
}

export interface ICreateStrategy {
  createStrategy(): IComparisonStrategy;
}
