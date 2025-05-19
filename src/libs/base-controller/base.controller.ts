import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class BaseController<RequestType, ResponseType> {
	abstract __invoke(...request: RequestType[]): Promise<ResponseType>;
}
