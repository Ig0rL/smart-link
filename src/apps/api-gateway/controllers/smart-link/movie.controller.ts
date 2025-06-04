import {
  Controller,
  Get,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';

import { SmartLinkService } from '@/apps/api-gateway/http-clients/smart-link/smart-link.service';
import { BaseController } from '@/libs/base-controller/base.controller';

@Controller()
export class MovieController extends BaseController<Response, any> {
  constructor(private httpSmartLinkService: SmartLinkService) {
    super();
  }
  
  @Get('movie')
  async __invoke(@Res() response: Response): Promise<any> {
    const res = await this.httpSmartLinkService.movie();
    response.redirect(res);
  }
}
