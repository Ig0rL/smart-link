import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';

import { BaseHttpProvider } from './base-http.provider';

class TestHttpProvider extends BaseHttpProvider {
  constructor() {
    super('http://test.com', 1000);
  }
}

describe('BaseHttpProvider', () => {
  let provider: TestHttpProvider;
  let httpService: HttpService;
  
  beforeEach(async () => {
    const mockHttpService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
      head: jest.fn(),
      axiosRef: {
        defaults: {}
      }
    };
    
    // Мокируем конструктор HttpService
    jest.spyOn(HttpService.prototype, 'get').mockImplementation(mockHttpService.get);
    jest.spyOn(HttpService.prototype, 'post').mockImplementation(mockHttpService.post);
    jest.spyOn(HttpService.prototype, 'put').mockImplementation(mockHttpService.put);
    jest.spyOn(HttpService.prototype, 'patch').mockImplementation(mockHttpService.patch);
    jest.spyOn(HttpService.prototype, 'delete').mockImplementation(mockHttpService.delete);
    jest.spyOn(HttpService.prototype, 'head').mockImplementation(mockHttpService.head);
    
    provider = new TestHttpProvider();
    httpService = (provider as any).httpService;
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('GET запросы', () => {
    it('Должен вернуть данные при успешном GET запросе', async () => {
      const mockResponse = {
        data: { foo: 'bar' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));
      
      const result = await provider.get('/test');
      
      expect(result).toEqual({ foo: 'bar' });
      expect(httpService.get).toHaveBeenCalledWith('/test', undefined);
    });
    
    it('Должен вернуть пустой ответ при отсутствии данных в GET запросе', async () => {
      const mockResponse = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse));
      
      const result = await provider.get('/test');
      
      expect(result).toBeNull();
    });
  });
  
  describe('POST запросы', () => {
    it('Должен отправить POST запрос с данными и конфигурацией', async () => {
      const requestData = { test: 'data' };
      const config = { headers: { 'Content-Type': 'application/json' } };
      const mockResponse = {
        data: { success: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      
      jest.spyOn(httpService, 'post').mockReturnValue(of(mockResponse));
      
      const result = await provider.post('/test', requestData, config);
      
      expect(result).toEqual({ success: true });
      expect(httpService.post).toHaveBeenCalledWith('/test', requestData, config);
    });
  });
  
  describe('PUT запросы', () => {
    it('Должен обработать PUT запрос с пустыми данными', async () => {
      const mockResponse = {
        data: { updated: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      jest.spyOn(httpService, 'put').mockReturnValue(of(mockResponse));
      
      const result = await provider.put('/test');
      
      expect(result).toEqual({ updated: true });
      expect(httpService.put).toHaveBeenCalledWith('/test', undefined, undefined);
    });
  });
  
  describe('DELETE запросы', () => {
    it('Должен выполнить DELETE запрос и вернуть результат', async () => {
      const mockResponse = {
        data: { deleted: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      jest.spyOn(httpService, 'delete').mockReturnValue(of(mockResponse));
      
      const result = await provider.delete('/test');
      
      expect(result).toEqual({ deleted: true });
    });
  });
  
  describe('PATCH запросы', () => {
    it('Должен выполнить PATCH запрос с данными и конфигурацией', async () => {
      const requestData = { partialUpdate: true };
      const config = { headers: { 'Content-Type': 'application/json' } };
      const mockResponse = {
        data: { updated: true },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      jest.spyOn(httpService, 'patch').mockReturnValue(of(mockResponse));
      
      const result = await provider.patch('/test', requestData, config);
      
      expect(result).toEqual({ updated: true });
      expect(httpService.patch).toHaveBeenCalledWith('/test', requestData, config);
    });
    
    it('Должен обработать PATCH запрос с пустыми данными', async () => {
      const mockResponse = {
        data: { updated: false },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      jest.spyOn(httpService, 'patch').mockReturnValue(of(mockResponse));
      
      const result = await provider.patch('/test');
      
      expect(result).toEqual({ updated: false });
      expect(httpService.patch).toHaveBeenCalledWith('/test', undefined, undefined);
    });
  });
  
  describe('HEAD запросы', () => {
    it('Должен выполнить HEAD запрос с конфигурацией', async () => {
      const config = { headers: { 'Authorization': 'Bearer token' } };
      const mockResponse = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: { 'content-length': '1234' },
        config: {} as any
      };
      jest.spyOn(httpService, 'head').mockReturnValue(of(mockResponse));
      
      const result = await provider.head('/test', config);
      
      expect(result).toBeNull();
      expect(httpService.head).toHaveBeenCalledWith('/test', config);
    });
    
    it('Должен обработать HEAD запрос без конфигурации', async () => {
      const mockResponse = {
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any
      };
      jest.spyOn(httpService, 'head').mockReturnValue(of(mockResponse));
      
      const result = await provider.head('/test');
      
      expect(result).toBeNull();
      expect(httpService.head).toHaveBeenCalledWith('/test', undefined);
    });
  });
});
