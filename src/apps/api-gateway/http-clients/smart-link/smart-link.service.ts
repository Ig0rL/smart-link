import {
  HttpException,
  Injectable,
} from '@nestjs/common';

import { SmartLinkProvider } from '@/apps/api-gateway/http-clients/smart-link/smart-link.provider';


@Injectable()
export class SmartLinkService {
  constructor(private smartLinkProvider: SmartLinkProvider) {}
  
  async movie(): Promise<any> {
    try {
      return this.smartLinkProvider.get('movie');
    } catch (error) {
      throw new HttpException(
        error?.response?.data,
        error?.response?.status
      );
    }
  }
}
