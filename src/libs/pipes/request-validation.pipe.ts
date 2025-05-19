import {
	HttpException,
	HttpStatus,
	Injectable,
	ValidationError,
	ValidationPipe,
} from '@nestjs/common';
import type { ValidationPipeOptions } from '@nestjs/common';

@Injectable()
export class RequestValidationPipe extends ValidationPipe {
	constructor(options?: ValidationPipeOptions) {
		super({
			transform: true,
			forbidNonWhitelisted: false,
			whitelist: true,
			validateCustomDecorators: true,
			skipMissingProperties: false,
			stopAtFirstError: false,
			validationError: { target: true, value: true },
			exceptionFactory: (errors: ValidationError[]) => {
				const messages = errors.reduce((acc, error) => {
					if (error.constraints) {
						acc[error.property] = error.constraints;
					}
					return acc;
				}, {} as any);

				return new HttpException(
					{
						errorCode: 'ValidationError',
						error: 'Ошибка валидации',
						message: messages,
						validationErrors: messages,
					},
					HttpStatus.BAD_REQUEST,
				);
			},
			...options,
		});
	}
}
