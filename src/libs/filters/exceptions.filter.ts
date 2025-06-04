import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';

interface IErrorResponse {
	error: string;
	errorCode: string;
	message?: string | string[];
	validationErrors?: Record<string, string>;
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
	catch(exception: Error, host: ArgumentsHost): Observable<IErrorResponse> | Response<IErrorResponse> {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let exceptionResponse: IErrorResponse;
		
		if (exception instanceof HttpException) {
			status = exception.getStatus();
			const responseData = exception.getResponse() as IErrorResponse;
			exceptionResponse = {
				error: responseData.error || 'Ошибка валидации',
				errorCode: responseData.errorCode || 'VALIDATION_ERROR',
				message: responseData.message || exception.message,
				...(responseData.validationErrors && {
					validationErrors: responseData.validationErrors,
				}),
			};
		} else {
			exceptionResponse = {
				error: 'Внутренняя ошибка сервера',
				errorCode: 'INTERNAL_SERVER_ERROR',
				message: exception.message || 'Неизвестная ошибка',
			};
		}
		
		return response.status(status).json({
			data: null,
			success: false,
			...exceptionResponse,
		});
	}
}
