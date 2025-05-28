import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';

import { RedisService } from '@/dynamic-modules/redis/redis.service';
import { RegisterDto } from '@/libs/contracts';
import { UserModel } from '@/libs/models';
import { UserRepository } from '@/libs/modules/user/user.repository';

import { AuthService } from './auth.service';
import { AuthConfigService } from './configs/env.config';
import { TokenService } from './token.service';

describe('AuthService', () => {
	let service: AuthService;
	let userRepository: jest.Mocked<UserRepository>;
	let tokenService: jest.Mocked<TokenService>;
	let redisService: jest.Mocked<RedisService>;
	let configService: jest.Mocked<AuthConfigService>;
	
	beforeEach(async () => {
		userRepository = {
			scope: jest.fn().mockReturnThis(),
			plain: jest.fn().mockReturnThis(),
			findOne: jest.fn(),
			create: jest.fn()
		} as any;
		
		tokenService = {
			generateTokens: jest.fn()
		} as any;
		
		redisService = {
			set: jest.fn()
		} as any;
		
		configService = {
			get: jest.fn()
		} as any;
		
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{ provide: UserRepository, useValue: userRepository },
				{ provide: TokenService, useValue: tokenService },
				{ provide: RedisService, useValue: redisService },
				{ provide: AuthConfigService, useValue: configService }
			]
		}).compile();
		
		service = module.get<AuthService>(AuthService);
	});
	
	it('Успешно авторизует пользователя с правильными данными', async () => {
		const loginData = { email: 'test@test.com', password: 'password123' };
		const mockUser = {
			id: '1',
			name: 'Test User',
			email: 'test@test.com',
			password: await bcrypt.hash('password123', 10)
		} as UserModel;
		const mockTokens = { accessToken: 'access', refreshToken: 'refresh' };
		
		userRepository.findOne.mockResolvedValue(mockUser);
		tokenService.generateTokens.mockResolvedValue(mockTokens);
		configService.get.mockReturnValue('3600');
		
		const result = await service.authUser(loginData);
		
		expect(result).toEqual({ ...mockTokens, userId: mockUser.id });
	});
	
	it('Выбрасывает ошибку при неверном пароле', async () => {
		const loginData = { email: 'test@test.com', password: 'wrongpass' };
		const mockUser = {
			id: '1',
			name: 'Test User',
			email: 'test@test.com',
			password: await bcrypt.hash('password123', 10)
		} as UserModel;
		
		userRepository.findOne.mockResolvedValue(mockUser);
		
		await expect(service.authUser(loginData)).rejects.toThrow(HttpException);
	});
	
	it('Выбрасывает ошибку если пользователь не найден', async () => {
		const loginData = { email: 'nonexistent@test.com', password: 'password123' };
		
		userRepository.findOne.mockResolvedValue(null);
		
		await expect(service.authUser(loginData)).rejects.toThrow(HttpException);
	});
	
	it('Успешно регистрирует нового пользователя', async () => {
		const registerData: RegisterDto = {
			name: 'Test User',
			email: 'new@test.com',
			password: 'password123'
		};
		
		userRepository.findOne.mockResolvedValue(null);
		userRepository.create.mockResolvedValue({} as UserModel);
		
		const result = await service.register(registerData);
		
		expect(result).toBeNull();
	});
	
	it('Выбрасывает ошибку при регистрации существующего email', async () => {
		const registerData: RegisterDto = {
			name: 'Test User',
			email: 'existing@test.com',
			password: 'password123'
		};
		
		userRepository.findOne.mockResolvedValue({ id: '1' } as UserModel);
		
		await expect(service.register(registerData)).rejects.toThrow(HttpException);
	});
	
	it('Выбрасывает ошибку при сбое создания пользователя', async () => {
		const registerData: RegisterDto = {
			name: 'Test User',
			email: 'new@test.com',
			password: 'password123'
		};
		
		userRepository.findOne.mockResolvedValue(null);
		userRepository.create.mockRejectedValue(new Error());
		
		await expect(service.register(registerData)).rejects.toThrow(HttpException);
	});
});
