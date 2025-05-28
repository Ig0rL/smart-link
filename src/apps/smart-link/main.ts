import { NestFactory } from '@nestjs/core';

import { SmartLinkConfigService } from '@/apps/smart-link/configs/env.config';

import { SmartLinkModule } from './smart-link.module';

async function bootstrap() {
	const app = await NestFactory.create(SmartLinkModule);
	const configService = app.get(SmartLinkConfigService);
	await app.listen(configService.get('PORT'));
	console.log(`Application is running on port ${configService.get('PORT')}`);
}
bootstrap();
