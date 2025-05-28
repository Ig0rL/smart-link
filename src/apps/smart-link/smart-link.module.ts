import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { SmartLinkConfigService } from '@/apps/smart-link/configs/env.config';
import { getPostgresConfig } from '@/apps/smart-link/configs/postgres.config';
import { ConfigModule } from '@/dynamic-modules/config-service/config.module';

@Module({
  imports: [
    SequelizeModule.forRootAsync(getPostgresConfig()),
    ConfigModule.forRoot({
      envFileName: '.env-smart-link',
      configServiceClass: SmartLinkConfigService,
    }),
  ],
  providers: [],
  exports: [],
})
export class SmartLinkModule {}
