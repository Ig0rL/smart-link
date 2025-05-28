import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors, UsePipes } from '@nestjs/common';

import { AuthService } from '@/apps/api-gateway/http-clients/auth/auth.service';
import { BaseController } from '@/libs/base-controller/base.controller';
import { LoginDto, LoginResponseDto } from '@/libs/contracts';
import { HttpResponseInterceptor } from '@/libs/interceptors/http-response.interceptor';
import { RequestValidationPipe } from '@/libs/pipes/request-validation.pipe';

@Controller('api/v1')
@UseInterceptors(HttpResponseInterceptor)
@UsePipes(RequestValidationPipe)
export class LoginController extends BaseController<LoginDto, LoginResponseDto> {
	constructor(private httpAuthService: AuthService) {
		super();
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async __invoke(@Body() request: LoginDto): Promise<LoginResponseDto> {
		return this.httpAuthService.login(request);
	}
}
