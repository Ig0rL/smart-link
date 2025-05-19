import { NestFactory } from '@nestjs/core';

import { SmartLinkModule } from './smart-link.module';

async function bootstrap() {
	const app = await NestFactory.create(SmartLinkModule);
	await app.listen(3020);
}
bootstrap();
