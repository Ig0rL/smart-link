import { HttpException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { RequestValidationPipe } from './request-validation.pipe';

describe('RequestValidationPipe', () => {
  let pipe: RequestValidationPipe;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RequestValidationPipe],
    }).compile();
    
    pipe = module.get<RequestValidationPipe>(RequestValidationPipe);
  });
  
  it('Создает корректное сообщение об ошибке при ошибках валидации', () => {
    const errors = [
      {
        property: 'email',
        constraints: {
          isEmail: 'email должен быть валидным email адресом',
          isString: 'email должен быть строкой'
        }
      },
      {
        property: 'age',
        constraints: {
          isNumber: 'age должно быть числом',
          min: 'age должно быть не меньше 18'
        }
      }
    ];
    
    const exceptionFactory = (pipe as any).exceptionFactory;
    const exception = exceptionFactory(errors);
    
    expect(exception).toBeInstanceOf(HttpException);
    expect(exception.getResponse()).toEqual({
      errorCode: 'ValidationError',
      error: 'Ошибка валидации',
      message: {
        email: {
          isEmail: 'email должен быть валидным email адресом',
          isString: 'email должен быть строкой'
        },
        age: {
          isNumber: 'age должно быть числом',
          min: 'age должно быть не меньше 18'
        }
      },
      validationErrors: {
        email: {
          isEmail: 'email должен быть валидным email адресом',
          isString: 'email должен быть строкой'
        },
        age: {
          isNumber: 'age должно быть числом',
          min: 'age должно быть не меньше 18'
        }
      }
    });
  });
  
  it('Пропускает ошибки без constraints', () => {
    const errors = [
      {
        property: 'field',
        constraints: null
      }
    ];
    
    const exceptionFactory = (pipe as any).exceptionFactory;
    const exception = exceptionFactory(errors);
    
    expect(exception.getResponse().message).toEqual({});
  });
  
  it('Сохраняет пользовательские опции при инициализации', async () => {
    const customPipe = await Test.createTestingModule({
      providers: [
        {
          provide: RequestValidationPipe,
          useValue: new RequestValidationPipe({
            transform: false,
            whitelist: false
          })
        }
      ]
    }).compile().then(module => module.get(RequestValidationPipe));
    
    const value = { field: 'test' };
    await customPipe.transform(value, { type: 'body', metatype: Object });
    
    expect(value).toEqual({ field: 'test' }); // transform: false не преобразует данные
  });
});
