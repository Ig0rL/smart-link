import { ConfigModule } from '@nestjs/config';
import { SequelizeModuleAsyncOptions } from '@nestjs/sequelize';

import { AuthConfigService } from '@/apps/auth/configs/env.config';

export const getPostgresConfig = (): SequelizeModuleAsyncOptions => ({
	imports: [ConfigModule],
	inject: [AuthConfigService],
	useFactory: (configService: AuthConfigService) => ({
		dialect: 'postgres',
		uri: configService.get('DATABASE_URL'),
		autoLoadModels: true, // чтоб не перечислять все модели models: [...],
		logQueryParameters: configService.get('SEQ_LOG_QUERY_PARAMETERS'),
		synchronize: false, // не пытаться по моделям создавать отсутствующие таблицы в БД
		protocol: 'postgres',
	}),
});
