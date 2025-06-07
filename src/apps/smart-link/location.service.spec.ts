import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { LocationProvider } from '@/apps/smart-link/http-clients/location.provider';

import { SmartLinkConfigService } from './configs/env.config';
import { LocationService } from './location.service';

describe('LocationService', () => {
  let service: LocationService;
  let locationProvider: LocationProvider;
  
  const mockApiUrl = 'https://api.location.test';
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: SmartLinkConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(mockApiUrl)
          }
        },
        {
          provide: LocationProvider,
          useValue: {
            get: jest.fn()
          }
        }
      ]
    }).compile();
    
    service = module.get<LocationService>(LocationService);
    locationProvider = module.get<LocationProvider>(LocationProvider);
  });
  
  describe('getLocation', () => {
    it('Успешно получает данные о местоположении', async () => {
      const mockResponse = {
        country: 'Russia',
        city: 'Moscow'
      };
      
      (locationProvider.get as jest.Mock).mockResolvedValue(mockResponse);
      
      const result = await service.getLocation();
      
      expect(result).toEqual({
        country: mockResponse.country,
        city: mockResponse.city,
        datetime: expect.any(String)
      });
      expect(locationProvider.get).toHaveBeenCalledWith(mockApiUrl);
    });
    
    it('Выбрасывает ошибку при неудачном запросе', async () => {
      (locationProvider.get as jest.Mock).mockRejectedValue(new Error());
      
      await expect(service.getLocation()).rejects.toThrow('Не удалось получить данные о местоположении');
    });
  });
});
