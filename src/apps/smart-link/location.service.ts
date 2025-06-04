import { Injectable } from '@nestjs/common';

import { SmartLinkConfigService } from '@/apps/smart-link/configs/env.config';
import { LocationProvider } from '@/apps/smart-link/http-clients/location.provider';
import { ILocation } from '@/libs/interfaces/link.interface';

@Injectable()
export class LocationService {
  private readonly apiUrl: string;
  
  constructor(
    private configService: SmartLinkConfigService,
    private readonly locationProvider: LocationProvider
  ) {
    this.apiUrl = this.configService.get('LOCATION_API_URL');
  }
  
  async getLocation(): Promise<ILocation> {
    try {
      const response = await this.locationProvider.get(this.apiUrl);
      return {
        country: response.country,
        city: response.city,
        datetime: new Date().toISOString(),
      }
    } catch (error) {
      throw new Error('Не удалось получить данные о местоположении');
    }
  }
}
