import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface IHttpResponse<T> {
	data: T | null;
	success: boolean;
	error: string | null;
	errorCode: string | null;
}

@Injectable()
export class HttpResponseInterceptor<T> implements NestInterceptor<T, IHttpResponse<T>> {
	intercept(context: ExecutionContext, next: CallHandler): Observable<IHttpResponse<T>> {
		return next.handle().pipe(
			map((data) => {
				return {
					data,
					success: true,
					error: null,
					errorCode: null,
				}
			}),
		);
	}
}
