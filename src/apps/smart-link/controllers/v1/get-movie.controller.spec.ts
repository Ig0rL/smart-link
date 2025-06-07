import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { Request } from 'express';

import { GetMovieController } from '@/apps/smart-link/controllers/v1/get-movie.controller';
import { LocationService } from '@/apps/smart-link/location.service';
import { StrategyLoader } from '@/apps/smart-link/strategies/strategy-loader';

import { LinkService } from '../../link.service';

describe('GetMovieController', () => {
  let controller: GetMovieController;
  let _locationService: LocationService;
  let _linkService: LinkService;
  let _strategyLoader: typeof StrategyLoader;
  
  const mockLocationService = {
    getLocation: jest.fn()
  };
  
  const mockLinkService = {
    getLinkRules: jest.fn()
  };
  
  const mockStrategy = {
    matches: jest.fn()
  };
  
  const mockFactory = {
    createStrategy: jest.fn(() => mockStrategy)
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetMovieController],
      providers: [
        {
          provide: LocationService,
          useValue: mockLocationService
        },
        {
          provide: LinkService,
          useValue: mockLinkService
        }
      ]
    }).compile();
    
    controller = module.get<GetMovieController>(GetMovieController);
    _locationService = module.get<LocationService>(LocationService);
    _linkService = module.get<LinkService>(LinkService);
    
    jest.spyOn(StrategyLoader, 'loadStrategy').mockResolvedValue(mockFactory);
  });
  
  describe('#__invoke()', () => {
    it('Возвращает редирект URL при совпадении правил', async () => {
      const mockRequest = {
        url: '/movie',
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn()
      } as unknown as Request;
      
      const mockLocation = {
        country: 'RU',
        city: 'Moscow',
        datetime: '2024-03-20T12:00:00Z'
      };
      
      const mockLinkRules = {
        strategy: 'test-strategy',
        rules: [
          {
            datetime: '2024-03-20T12:00:00Z',
            redirect: 'https://redirect.com'
          }
        ]
      };
      
      mockLocationService.getLocation.mockResolvedValue(mockLocation);
      mockLinkService.getLinkRules.mockResolvedValue(mockLinkRules);
      mockStrategy.matches.mockReturnValue(true);
      
      const result = await controller.__invoke(mockRequest);
      
      expect(result).toBe('https://redirect.com');
    });
    
    it('Возвращает дефолтный URL если нет совпадений по правилам', async () => {
      const mockRequest = {
        url: '/movie',
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn()
      } as unknown as Request;
      
      mockLocationService.getLocation.mockResolvedValue({});
      mockLinkService.getLinkRules.mockResolvedValue({
        strategy: 'test-strategy',
        rules: []
      });
      mockStrategy.matches.mockReturnValue(false);
      
      const result = await controller.__invoke(mockRequest);
      
      expect(result).toBe('https://you.com');
    });
    
    it('Выбрасывает HttpException при возникновении ошибки', async () => {
      const mockRequest = {
        url: '/movie',
        get: jest.fn(),
        header: jest.fn(),
        accepts: jest.fn(),
        acceptsCharsets: jest.fn()
      } as unknown as Request;
      
      mockLocationService.getLocation.mockRejectedValue(new Error());
      
      await expect(controller.__invoke(mockRequest)).rejects.toThrow(
        new HttpException('Сервис временно недоступен', HttpStatus.SERVICE_UNAVAILABLE)
      );
    });
  });
});
