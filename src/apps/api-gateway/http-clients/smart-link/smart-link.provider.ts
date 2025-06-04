import { Injectable } from '@nestjs/common';

import { ApiGatewayConfigService } from '@/apps/api-gateway/configs/env.config';
import { BaseHttpProvider } from '@/libs/base-http-provider/base-http.provider';

@Injectable()
export class SmartLinkProvider extends BaseHttpProvider {
  constructor(configService: ApiGatewayConfigService) {
    super(configService.get('SMART_LINK_SERVICE_URL'), configService.get('SMART_LINK_REQUEST_TIMEOUT'));
  }
}
