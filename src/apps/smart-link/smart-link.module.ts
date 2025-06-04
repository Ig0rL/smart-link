import { Module } from '@nestjs/common';
import {
  getModelToken,
  SequelizeModule,
} from '@nestjs/sequelize';

import { SmartLinkConfigService } from '@/apps/smart-link/configs/env.config';
import { getPostgresConfig } from '@/apps/smart-link/configs/postgres.config';
import {
  LINK_REPOSITORY,
  LINK_RULE_REPOSITORY,
} from '@/apps/smart-link/constants';
import { GetMovieController } from '@/apps/smart-link/controllers/v1/get-movie.controller';
import { LocationProvider } from '@/apps/smart-link/http-clients/location.provider';
import { LocationService } from '@/apps/smart-link/location.service';
import { ConfigModule } from '@/dynamic-modules/config-service/config.module';
import { LinkRuleModel } from '@/libs/models/link/link-rule.model';
import { LinkModel } from '@/libs/models/link/link.model';
import { GenericRepository } from '@/libs/repository/generic.repository';

import { CreateLinkController } from './controllers/v1/create-link.controller';
import { LinkService } from './link.service';


@Module({
  imports: [
    SequelizeModule.forRootAsync(getPostgresConfig()),
    SequelizeModule.forFeature([LinkModel, LinkRuleModel]),
    ConfigModule.forRoot({
      envFileName: '.env',
      configServiceClass: SmartLinkConfigService,
    }),
  ],
  providers: [
    {
      provide: LINK_REPOSITORY,
      useFactory: (linkModel: typeof LinkModel) => new GenericRepository(linkModel),
      inject: [getModelToken(LinkModel)],
    },
    {
      provide: LINK_RULE_REPOSITORY,
      useFactory: (linkRuleModel: typeof LinkRuleModel) => new GenericRepository(linkRuleModel),
      inject: [getModelToken(LinkRuleModel)],
    },
    LinkService,
    LocationService,
    LocationProvider,
  ],
  exports: [],
  controllers: [CreateLinkController, GetMovieController],
})
export class SmartLinkModule {}
