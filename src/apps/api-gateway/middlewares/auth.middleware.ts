import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Response } from 'express';

import { IRequest } from '@/libs/interfaces';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(private jwtService: JwtService) {}

	async use(req: IRequest, _: Response, next: NextFunction) {
		const token = req.headers['authorization']?.split(' ')[1];

		if (!token) {
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					errorCode: 'InvalidToken',
					error: 'Ошибка авторизации',
					message: 'Токен не предоставлен',
				},
				HttpStatus.UNAUTHORIZED,
			);
		}

		try {
			const payload = await this.jwtService.verifyAsync(token);
			req.user = payload;
			next();
		} catch (error) {
			throw new HttpException(
				{
					status: HttpStatus.UNAUTHORIZED,
					errorCode: 'InvalidToken',
					error: 'Ошибка авторизации',
					message: 'Срок действия токена истек',
				},
				HttpStatus.UNAUTHORIZED,
			);
		}
	}
}
