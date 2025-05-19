import { ModuleMetadata } from '@nestjs/common';
import { RedisOptions } from 'ioredis';

export interface IRedisServiceOptions extends Pick<ModuleMetadata, 'imports'> {
	inject?: any[];
	name: string;
	useFactory: (...args: any[]) => Promise<RedisOptions> | RedisOptions;
}
