import { Injectable } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsDefined, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { ConfigService } from '@/dynamic-modules/config-service/config.service';

export enum Environment {
	Development = 'development',
	Production = 'production',
}

export class EnvConfigSchema {
	@Expose()
	@IsEnum(Environment)
	NODE_ENV: Environment = Environment.Development;

	@Expose()
	@Type(() => Number)
	@IsNumber()
	@IsDefined()
	PORT: number = 3010;

	@Expose()
	@IsString()
	DATABASE_URL: string = 'postgres://postgres:postgres@localhost:5432/smart_link';

	@Expose()
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	SEQ_LOG_QUERY_PARAMETERS = false;

	@Expose()
	@IsString()
	@IsDefined()
	@IsOptional()
	JWT_SECRET_KEY: string = 'jwt_secret_key';

	@Expose()
	@IsNumber()
	@Type(() => Number)
	@IsDefined()
	@IsOptional()
	JWT_ACCESS_TOKEN_EXPIRE: number = 3600;

	@Expose()
	@IsNumber()
	@Type(() => Number)
	@IsDefined()
	@IsOptional()
	JWT_REFRESH_TOKEN_EXPIRE: number = 604800;

	@Expose()
	@IsString()
	@IsDefined()
	@IsOptional()
	REDIS_HOST: string = 'localhost';

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

	@Expose()
	@IsString()
	@IsOptional()
	REDIS_PASSWORD: string = 'redis';
}

@Injectable()
export class AuthConfigService extends ConfigService<EnvConfigSchema> {
	constructor(envFileName?: string) {
		super(EnvConfigSchema, envFileName);
	}
}
