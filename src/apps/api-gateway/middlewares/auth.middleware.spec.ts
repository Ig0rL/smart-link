import { HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { IRequest } from '@/libs/interfaces';

import { AuthMiddleware } from './auth.middleware';

describe('AuthMiddleware', () => {
	let module: TestingModule;
	let middleware: AuthMiddleware;
	let jwtService: JwtService;
	let req: Partial<IRequest>;
	let res: any;
	let next: jest.Mock;

	beforeEach(async () => {
		const mockJwtService = {
			verifyAsync: jest.fn(),
		};

		module = await Test.createTestingModule({
			providers: [
				AuthMiddleware,
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
			],
		}).compile();

		middleware = module.get<AuthMiddleware>(AuthMiddleware);
		jwtService = module.get<JwtService>(JwtService);
		req = { headers: {} };
		res = {};
		next = jest.fn();
	});

	it('Ошибка если токен не предоставлен', async () => {
		await expect(middleware.use(req as IRequest, res, next)).rejects.toThrow(
			new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					errorCode: 'InvalidToken',
					error: 'Ошибка авторизации',
					message: 'Токен не предоставлен',
				},
				HttpStatus.UNAUTHORIZED,
			),
		);
	});

	it('Ошибка если токен невалидный', async () => {
		req.headers['authorization'] = 'Bearer invalid_token';
		jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

		await expect(middleware.use(req as IRequest, res, next)).rejects.toThrow(
			new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					errorCode: 'InvalidToken',
					error: 'Ошибка авторизации',
					message: 'Срок действия токена истек',
				},
				HttpStatus.UNAUTHORIZED,
			),
		);
	});

	it('Если токен валидный пропускаем запрос', async () => {
		const payload = { userId: 1 };
		req.headers['authorization'] = 'Bearer valid_token';
		jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce(payload);

		await middleware.use(req as IRequest, res, next);

		expect(req.user).toEqual(payload);
		expect(next).toHaveBeenCalled();
	});
});
