import { Injectable } from '@nestjs/common';

import { SmartLinkConfigService } from '@/apps/smart-link/configs/env.config';
import { BaseHttpProvider } from '@/libs/base-http-provider/base-http.provider';

@Injectable()
export class LocationProvider extends BaseHttpProvider {
  constructor(configService: SmartLinkConfigService) {
    super(configService.get('LOCATION_API_URL'), configService.get('LOCATION_API_TIMEOUT'));
  }
}
