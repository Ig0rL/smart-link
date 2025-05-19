import { DynamicModule, Module, Provider } from '@nestjs/common';

import { ConfigService } from './config.service';

interface ConfigModuleOptions<T> {
	envFileName?: string;
	configServiceClass: new (envFilePath?: string) => ConfigService<T>;
}

@Module({})
export class ConfigModule {
	static forRoot<T>(
		options: ConfigModuleOptions<T> = {} as ConfigModuleOptions<T>,
	): DynamicModule {
		const { envFileName, configServiceClass } = options;

		const configServiceProvider: Provider = {
			provide: configServiceClass || ConfigService,
			useFactory: () => new configServiceClass(envFileName),
		};

		return {
			module: ConfigModule,
			providers: [configServiceProvider],
			exports: [configServiceProvider],
			global: true, // Делаем модуль глобальным (опционально)
		};
	}
}
