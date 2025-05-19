import { ApiGatewayConfigService } from '@/apps/api-gateway/configs/env.config';
import { BaseHttpProvider } from '@/libs/base-http-provider/base-http.provider';

export class AuthProvider extends BaseHttpProvider {
	constructor(configService: ApiGatewayConfigService) {
		super(
			configService.get('AUTH_SERVICE_URL'),
			configService.get('AUTH_REQUEST_TIMEOUT')
		);
	}
}
