import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

import { AuthProvider } from '@/apps/api-gateway/http-clients/auth/auth-provider';

@Injectable()
export class AuthService {
	constructor(private authHttpService: AuthProvider) {}

	async isHealthy(): Promise<boolean> {
		try {
			await firstValueFrom(this.authHttpService.get('/health'));
			return true;
		} catch {
			return false;
		}
	}

	async verifyToken(token: string) {
		return firstValueFrom(this.authHttpService.post('/verify', { token }));
	}
}
