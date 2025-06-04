import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Req,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import type {
  Request,
} from 'express';

import { LinkService } from '@/apps/smart-link/link.service';
import { LocationService } from '@/apps/smart-link/location.service';
import { StrategyLoader } from '@/apps/smart-link/strategies/strategy-loader';
import { BaseController } from '@/libs/base-controller/base.controller';
import { HttpResponseInterceptor } from '@/libs/interceptors/http-response.interceptor';
import { RequestValidationPipe } from '@/libs/pipes/request-validation.pipe';


@Controller()
@UseInterceptors(HttpResponseInterceptor)
@UsePipes(RequestValidationPipe)
export class GetMovieController extends BaseController<Request, string>{
  constructor(
    private readonly locationService: LocationService,
    private readonly linkService: LinkService,
  ) {
    super();
  }
  
  @Get('movie')
  @HttpCode(HttpStatus.OK)
  async __invoke(@Req() request: Request): Promise<string> {
    try {
      const url = request.url.replace('/', '');
      const location = await this.locationService.getLocation();
      const linkRules = await this.linkService.getLinkRules(url);
      
      const factory = await StrategyLoader.loadStrategy(linkRules.strategy);
      const res = factory.createStrategy();
      
      for (const rule of linkRules.rules) {
        const isMatch = res.matches(location, rule);
        if (isMatch) {
          return rule.redirect;
        }
      }
      
      return 'https://you.com';
    } catch (error) {
      throw new HttpException('Сервис временно недоступен', HttpStatus.SERVICE_UNAVAILABLE);
    }
  }
}
