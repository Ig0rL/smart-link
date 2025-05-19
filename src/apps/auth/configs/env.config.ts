import { Injectable } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator';

import { ConfigService } from '@/dynamic-modules/config-service/config.service';

export class EnvConfigSchema {
	@Expose()
	@Type(() => Number)
	@IsNumber()
	@IsDefined()
	PORT: number = 3010;

	@Expose()
	@IsString()
	@IsDefined()
	@IsOptional()
	JWT_SECRET_KEY: string = 'jwt_secret_key';

	@Expose()
	@IsString({ each: false })
	@IsDefined()
	@IsOptional()
	JWT_ACCESS_TOKEN_EXPIRE: string = '1h';

	@Expose()
	@IsOptional()
	@IsString({ each: false })
	@IsDefined()
	JWT_REFRESH_TOKEN_EXPIRE: string = '7d';

	@Expose()
	@IsString()
	@IsDefined()
	@IsOptional()
	REDIS_HOST: string = 'redis';

	@Expose()
	@IsNumber()
	@Type(() => Number)
	@IsDefined()
	@IsOptional()
	REDIS_PORT: number = 6379;

	@Expose()
	@IsNumber()
	@Type(() => Number)
	@IsDefined()
	@IsOptional()
	REDIS_DB: number = 0;
}

@Injectable()
export class AuthConfigService extends ConfigService<EnvConfigSchema> {
	constructor(envFileName?: string) {
		super(EnvConfigSchema, envFileName);
	}
}
