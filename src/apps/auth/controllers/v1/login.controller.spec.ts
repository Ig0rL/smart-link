import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '@/apps/auth/auth.service';
import { LoginDto, LoginResponseDto } from '@/libs/contracts';

import { LoginController } from './login.controller';

describe('LoginController', () => {
  let controller: LoginController;
  let authService: AuthService;
  
  const mockAuthService = {
    authUser: jest.fn()
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();
    
    controller = module.get<LoginController>(LoginController);
    authService = module.get<AuthService>(AuthService);
  });
  
  it('Успешно авторизует пользователя с правильными учетными данными', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const expectedResponse: LoginResponseDto = {
      userId: '123',
      accessToken: 'jwt-token',
      refreshToken: 'refresh-token'
    };
    
    mockAuthService.authUser.mockResolvedValue(expectedResponse);
    
    const result = await controller.__invoke(loginDto);
    
    expect(authService.authUser).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual(expectedResponse);
  });
  
  it('Cохраняет правильный статус ответа при успешной авторизации', async () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    mockAuthService.authUser.mockResolvedValue({
      accessToken: 'token',
      refreshToken: 'refresh'
    });
    
    const response = await controller.__invoke(loginDto);
    
    expect(response).toBeDefined();
    expect(response).toHaveProperty('accessToken');
    expect(response).toHaveProperty('refreshToken');
  });
  
  it('Выбрасывает ошибку при некорректных учетных данных', async () => {
    const loginDto: LoginDto = {
      email: 'wrong@example.com',
      password: 'wrongpass'
    };
    
    mockAuthService.authUser.mockRejectedValue(new Error('Неверные учетные данные'));
    
    await expect(controller.__invoke(loginDto)).rejects.toThrow('Неверные учетные данные');
  });
});
