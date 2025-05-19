import { NestFactory } from '@nestjs/core';

import { AuthConfigService } from '@/apps/auth/configs/env.config';

import { AuthModule } from './auth.module';

async function bootstrap() {
	const app = await NestFactory.create(AuthModule);
	const configService = app.get(AuthConfigService);
	await app.listen(configService.get('PORT'));
	console.log(`Application is running on port ${configService.get('PORT')}`);
}

bootstrap();
