import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

import { HttpResponseInterceptor } from './http-response.interceptor';

describe('HttpResponseInterceptor', () => {
  let interceptor: HttpResponseInterceptor<any>;
  let context: ExecutionContext;
  
  beforeEach(() => {
    interceptor = new HttpResponseInterceptor();
    context = {
      switchToHttp: jest.fn()
    } as any;
  });
  
  it('Успешно оборачивает ответ с данными', (done) => {
    const data = { foo: 'bar' };
    const next = {
      handle: () => of(data)
    };
    
    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({
        data,
        success: true,
        error: null,
        errorCode: null
      });
      done();
    });
  });
  
  it('Успешно оборачивает пустой ответ', (done) => {
    const next = {
      handle: () => of(null)
    };
    
    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({
        data: null,
        success: true,
        error: null,
        errorCode: null
      });
      done();
    });
  });
  
  it('Успешно оборачивает ответ с undefined', (done) => {
    const next = {
      handle: () => of(undefined)
    };
    
    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({
        data: undefined,
        success: true,
        error: null,
        errorCode: null
      });
      done();
    });
  });
  
  it('Успешно оборачивает массив данных', (done) => {
    const data = [1, 2, 3];
    const next = {
      handle: () => of(data)
    };
    
    interceptor.intercept(context, next).subscribe((result) => {
      expect(result).toEqual({
        data,
        success: true,
        error: null,
        errorCode: null
      });
      done();
    });
  });
});
