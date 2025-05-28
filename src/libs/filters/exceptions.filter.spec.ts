import { ArgumentsHost, HttpException } from '@nestjs/common';

import { ExceptionsFilter } from './exceptions.filter';

describe('ExceptionsFilter', () => {
  let filter: ExceptionsFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockGetResponse: jest.Mock;
  let mockHost: ArgumentsHost;
  
  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    mockHost = {
      switchToHttp: () => ({
        getResponse: mockGetResponse,
      }),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    } as unknown as ArgumentsHost;
    
    filter = new ExceptionsFilter();
  });
  
  it('Обрабатывает ошибку валидации с полными данными', () => {
    const exception = new HttpException({
      error: 'Ошибка данных',
      errorCode: 'DATA_ERROR',
      message: 'Неверный формат',
      validationErrors: {
        field: 'ошибка поля'
      }
    }, 400);
    
    filter.catch(exception, mockHost);
    
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      data: null,
      success: false,
      error: 'Ошибка данных',
      errorCode: 'DATA_ERROR',
      message: 'Неверный формат',
      validationErrors: {
        field: 'ошибка поля'
      }
    });
  });
  
  it('Использует значения по умолчанию при частичных данных ошибки', () => {
    const exception = new HttpException({}, 400);
    
    filter.catch(exception, mockHost);
    
    expect(mockStatus).toHaveBeenCalledWith(400);
    expect(mockJson).toHaveBeenCalledWith({
      data: null,
      success: false,
      error: 'Ошибка валидации',
      errorCode: 'VALIDATION_ERROR',
      message: ''
    });
  });
  
  it('Обрабатывает внутреннюю ошибку сервера', () => {
    const exception = new HttpException({
      error: 'Внутренняя ошибка сервера',
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'Системная ошибка'
    }, 500);
    
    filter.catch(exception, mockHost);
    
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      data: null,
      success: false,
      error: 'Внутренняя ошибка сервера',
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: 'Системная ошибка'
    });
  });
  
  it('Обрабатывает случай с неопределенным исключением', () => {
    const exception = new HttpException({
      error: 'Внутренняя ошибка сервера',
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: ''
    }, 500);
    
    filter.catch(exception, mockHost);
    
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledWith({
      data: null,
      success: false,
      error: 'Внутренняя ошибка сервера',
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: ''
    });
  });
});
