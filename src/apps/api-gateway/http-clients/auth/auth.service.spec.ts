import { HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { LoginDto, RegisterDto, LoginResponseDto } from '@/libs/contracts';

import { AuthProvider } from './auth-provider';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	let service: AuthService;
	let authProviderMock: jest.Mocked<AuthProvider>;

	beforeEach(async () => {
		authProviderMock = {
			post: jest.fn(),
		} as any;

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: AuthProvider,
					useValue: authProviderMock,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	describe('#login()', () => {
		it('Успешная авторизация возвращает данные пользователя', async () => {
			const loginDto = {
				email: 'test@test.com',
				password: '123456',
			} as LoginDto;

			const expectedResponse: LoginResponseDto = {
				accessToken: 'test-access-token',
				refreshToken: 'test-refresh-token',
				userId: '384685ea-12ac-4779-aecd-bd9737e29c93',
			};

			authProviderMock.post.mockResolvedValueOnce(expectedResponse);

			const result = await service.login(loginDto);

			expect(result).toEqual(expectedResponse);
			expect(authProviderMock.post).toHaveBeenCalledWith('/api/v1/login', loginDto);
		});
		
		it('Выбрасывает HttpException при ошибке авторизации', async () => {
			const loginDto = {
				email: 'test@test.com',
				password: '123456',
			} as LoginDto;
			
			const error = new HttpException('Неверные учетные данные', 401);
			
			authProviderMock.post.mockRejectedValueOnce(error);
			
			await expect(service.login(loginDto)).rejects.toThrow(HttpException);
			expect(authProviderMock.post).toHaveBeenCalledWith('/api/v1/login', loginDto);
		});
	});

	describe('#register()', () => {
		it('Успешная регистрация возвращает null', async () => {
			const registerDto = {
				email: 'test@test.com',
				password: '123456',
				name: 'Тест',
			} as RegisterDto;

			authProviderMock.post.mockResolvedValueOnce(null);

			const result = await service.register(registerDto);

			expect(result).toBeNull();
			expect(authProviderMock.post).toHaveBeenCalledWith('/api/v1/register', registerDto);
		});
		
		it('Выбрасывает HttpException при ошибке регистрации', async () => {
			const registerDto = {
				email: 'test@test.com',
				password: '123456',
				name: 'Тест',
			} as RegisterDto;
			
			const error = new HttpException('Email уже существует', 400);
			
			authProviderMock.post.mockRejectedValueOnce(error);
			
			await expect(service.register(registerDto)).rejects.toThrow(HttpException);
			expect(authProviderMock.post).toHaveBeenCalledWith('/api/v1/register', registerDto);
		});
	});
});
