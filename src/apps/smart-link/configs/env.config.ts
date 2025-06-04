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
	PORT: number = 3030;

	@Expose()
	@IsString()
	DATABASE_URL: string = 'postgres://postgres:postgres@localhost:5432/smart_link';
	
	@Expose()
	@IsString()
	LOCATION_API_URL: string = 'http://ip-api.com/json/';
	
	@Expose()
	@Type(() => Number)
	@IsNumber()
	@IsDefined()
	LOCATION_API_TIMEOUT: number = 5000;

	@Expose()
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	SEQ_LOG_QUERY_PARAMETERS = false;
}

@Injectable()
export class SmartLinkConfigService extends ConfigService<EnvConfigSchema> {
	constructor(envFileName?: string) {
		super(EnvConfigSchema, envFileName);
	}
}
