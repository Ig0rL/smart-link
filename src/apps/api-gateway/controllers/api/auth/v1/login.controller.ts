import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors, UsePipes } from '@nestjs/common';

import { AuthService } from '@/apps/api-gateway/http-clients/auth/auth.service';
import { BaseController } from '@/libs/base-controller/base.controller';
import { LoginDto } from '@/libs/contracts';
import { HttpResponseInterceptor } from '@/libs/interceptors/http-response.interceptor';
import { RequestValidationPipe } from '@/libs/pipes/request-validation.pipe';

@Controller('api/v1')
@UseInterceptors(HttpResponseInterceptor)
@UsePipes(RequestValidationPipe)
export class LoginController extends BaseController<LoginDto, any> {
	constructor(private httpAuthService: AuthService) {
		super();
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async __invoke(@Body() request: LoginDto) {
		await this.httpAuthService.isHealthy();
		console.log('data', request);
		return  {
			...request,
			name: 'login',
		};
	}
}
