import {
	HttpException,
	Injectable,
} from '@nestjs/common';

import { AuthProvider } from '@/apps/api-gateway/http-clients/auth/auth-provider';
import { LoginDto, LoginResponseDto, RegisterDto } from '@/libs/contracts';

@Injectable()
export class AuthService {
	constructor(private authHttpService: AuthProvider) {}

	async login(request: LoginDto): Promise<LoginResponseDto> {
		let result: LoginResponseDto;
		try {
			result = await this.authHttpService.post('/api/v1/login', request);
		} catch (error) {
			throw new HttpException(
				error?.response?.data,
				error?.response?.status
			);
		}
		return result;
	}

	async register(request: RegisterDto): Promise<null> {
		try {
			await this.authHttpService.post('/api/v1/register', request);
		} catch (error) {
			throw new HttpException(
				error?.response?.data,
				error?.response?.status
			);
		}
		return null;
	}
}
