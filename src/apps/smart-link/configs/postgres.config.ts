import { ConfigModule } from '@nestjs/config';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';

import { SmartLinkConfigService } from '@/apps/smart-link/configs/env.config';

export const getPostgresConfig = (): SequelizeModuleAsyncOptions => ({
	imports: [ConfigModule],
	inject: [SmartLinkConfigService],
	useFactory: (configService: SmartLinkConfigService) => ({
		dialect: 'postgres',
		uri: configService.get('DATABASE_URL'),
		autoLoadModels: true, // чтоб не перечислять все модели models: [...],
		logQueryParameters: configService.get('SEQ_LOG_QUERY_PARAMETERS'),
		synchronize: false, // не пытаться по моделям создавать отсутствующие таблицы в БД
		protocol: 'postgres',
	}),
});
