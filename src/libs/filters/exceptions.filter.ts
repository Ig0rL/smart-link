import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

interface IErrorResponse {
	error: string;
	errorCode: string;
	message?: string | string[];
	validationErrors?: Record<string, string>;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception.getStatus() ?? 500;
		let exceptionResponse: IErrorResponse;

		if (exception) {
			const response = exception.getResponse() as IErrorResponse;
			exceptionResponse = {
				error: response.error || 'Ошибка валидации',
				errorCode: response.errorCode || 'VALIDATION_ERROR',
				message: response.message || '',
				...(response.validationErrors &&  {validationErrors: response.validationErrors} ),
			};
		} else {
			exceptionResponse = {
				error: 'Внутренняя ошибка сервера',
				errorCode: 'INTERNAL_SERVER_ERROR',
				message: exception instanceof Error ? exception.message : '',
			};
		}

		const errorResponse = {
			data: null,
			success: false,
			...exceptionResponse,
		};

		response.status(status).json(errorResponse);
	}
}
