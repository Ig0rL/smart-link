import { plainToInstance } from 'class-transformer';

export abstract class BaseResource<T> {
  protected data: Record<string, any>;
  
  constructor(data?: Record<string, any>) {
    if (data) {
      this.data = data;
    }
  }
  
  protected toResource<R>(responseClass: new () => R): R {
    return plainToInstance(responseClass, this.data, {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
    });
  }
  
  abstract resource(): T;
}
