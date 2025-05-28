import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors, UsePipes } from '@nestjs/common';

import { AuthService } from '@/apps/auth/auth.service';
import { BaseController } from '@/libs/base-controller/base.controller';
import { RegisterDto } from '@/libs/contracts';
import { HttpResponseInterceptor } from '@/libs/interceptors/http-response.interceptor';
import { RequestValidationPipe } from '@/libs/pipes/request-validation.pipe';

@Controller('api/v1')
@UseInterceptors(HttpResponseInterceptor)
@UsePipes(RequestValidationPipe)
export class RegisterController extends BaseController<RegisterDto, null> {
	constructor(private authService: AuthService) {
		super();
	}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	async __invoke(@Body() request: RegisterDto): Promise<null> {
		return this.authService.register(request);
	}
}
