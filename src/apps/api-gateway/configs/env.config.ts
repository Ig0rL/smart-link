import { Injectable } from '@nestjs/common';
import { Expose, Transform, Type } from 'class-transformer';
import {
	IsBoolean,
	IsDefined,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

import { ConfigService } from '@/dynamic-modules/config-service/config.service';

export class EnvConfigSchema {
	@Expose()
	@Type(() => Number)
	@IsNumber()
	@IsDefined()
	PORT: number = 3020;

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
	@Type(() => Number)
	@IsNumber()
	@IsDefined()
	AUTH_REQUEST_TIMEOUT: number = 5000;

	@Expose()
	@IsString()
	@IsDefined()
	@IsOptional()
	AUTH_SERVICE_URL: string = 'http://localhost:3020';

	@IsString()
	@Expose()
	@IsOptional()
	LOG_FOLDER = './logs/';

	@IsBoolean()
	@Expose()
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	LOG_JSON = false;

	@IsString()
	@Expose()
	@IsOptional()
	LOG_FILE_PREFIX = 'app';

	@IsBoolean()
	@Expose()
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	LOG_ZIPPED_ARCHIVE = false;

	@IsString()
	@Expose()
	@IsOptional()
	LOG_MAX_SIZE = '500M';

	@IsString()
	@Expose()
	@IsOptional()
	LOG_MAX_FILES = '10';

	@IsString()
	@Expose()
	@IsOptional()
	LOG_FILE = 'app-%DATE%.log';

	@Expose()
	@IsString()
	@IsOptional()
	DEFAULT_LOGGER_TRANSPORTS: string;

	@Expose()
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	LOG_INSTANCE_SUBFOLDER = false;

	@Expose()
	@IsBoolean()
	@IsOptional()
	@Transform(({ value }) => value === 'true')
	LOG_INSTANCE_IN_FILENAME = false;
}

@Injectable()
export class ApiGatewayConfigService extends ConfigService<EnvConfigSchema> {
	constructor(envFileName?: string) {
		super(EnvConfigSchema, envFileName);
	}
}
