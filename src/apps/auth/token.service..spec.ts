import { JwtService } from '@nestjs/jwt';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { AuthConfigService } from '@/apps/auth/configs/env.config';

import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<AuthConfigService>;
  
  beforeEach(async () => {
    jwtService = {
      signAsync: jest.fn()
    } as any;
    
    configService = {
      get: jest.fn()
    } as any;
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: JwtService, useValue: jwtService },
        { provide: AuthConfigService, useValue: configService }
      ]
    }).compile();
    
    service = module.get<TokenService>(TokenService);
  });
  
  describe('generateTokens', () => {
    it('Успешно генерирует access и refresh токены', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      };
      
      const mockPayload = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name
      };
      
      jwtService.signAsync.mockResolvedValueOnce('access-token');
      jwtService.signAsync.mockResolvedValueOnce('refresh-token');
      configService.get.mockReturnValueOnce('secret-key');
      configService.get.mockReturnValueOnce('7d');
      
      const result = await service.generateTokens(mockUser);
      
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      });
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(1, mockPayload);
      expect(jwtService.signAsync).toHaveBeenNthCalledWith(2, mockPayload, {
        secret: 'secret-key',
        expiresIn: '7d'
      });
    });
    
    it('Выбрасывает ошибку при сбое генерации токенов', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        name: 'Test User'
      };
      
      jwtService.signAsync.mockRejectedValue(new Error('Token generation failed'));
      
      await expect(service.generateTokens(mockUser)).rejects.toThrow('Token generation failed');
    });
  });
});
