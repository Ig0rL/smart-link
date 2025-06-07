import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '@/apps/auth/auth.service';
import { RegisterDto } from '@/libs/contracts';

import { RegisterController } from './register.controller';

describe('RegisterController', () => {
  let controller: RegisterController;
  let authService: AuthService;
  
  const mockAuthService = {
    register: jest.fn()
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile();
    
    controller = module.get<RegisterController>(RegisterController);
    authService = module.get<AuthService>(AuthService);
  });
  
  it('Успешно регистрирует нового пользователя с корректными данными', async () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    mockAuthService.register.mockResolvedValue(null);
    
    const result = await controller.__invoke(registerDto);
    
    expect(authService.register).toHaveBeenCalledWith(registerDto);
    expect(result).toBeNull();
  });
  
  it('Выбрасывает ошибку при попытке регистрации с существующей почтой', async () => {
    const registerDto: RegisterDto = {
      email: 'existing@example.com',
      password: 'password123',
      name: 'Test User'
    };
    
    mockAuthService.register.mockRejectedValue(new Error('Пользователь с такой почтой уже существует'));
    
    await expect(controller.__invoke(registerDto)).rejects.toThrow('Пользователь с такой почтой уже существует');
  });
  
  it('Выбрасывает ошибку при регистрации с некорректными данными', async () => {
    const invalidRegisterDto: RegisterDto = {
      email: 'invalid-email',
      password: '123',
      name: ''
    };
    
    mockAuthService.register.mockRejectedValue(new Error('Некорректные данные для регистрации'));
    
    await expect(controller.__invoke(invalidRegisterDto)).rejects.toThrow('Некорректные данные для регистрации');
  });
});
