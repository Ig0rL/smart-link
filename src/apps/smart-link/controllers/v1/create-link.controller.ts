import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

import { LinkService } from '@/apps/smart-link/link.service';
import { BaseController } from '@/libs/base-controller/base.controller';
import {
  CreateLinkDto,
} from '@/libs/contracts/link.dto';
import { HttpResponseInterceptor } from '@/libs/interceptors/http-response.interceptor';
import { RequestValidationPipe } from '@/libs/pipes/request-validation.pipe';
import { LinkResource } from '@/libs/resources/link/link.resource';

@Controller('api/v1')
@UseInterceptors(HttpResponseInterceptor)
@UsePipes(new RequestValidationPipe({ whitelist: false }))
export class CreateLinkController extends BaseController<CreateLinkDto, LinkResource>{
  constructor(private readonly linkService: LinkService) {
    super();
  }
  
  @Post('create-link')
  @HttpCode(HttpStatus.OK)
  async __invoke(@Body() data: CreateLinkDto): Promise<LinkResource> {
    const createdData = await this.linkService.createLink(data);
    return new LinkResource(createdData).resource();
  }
}
