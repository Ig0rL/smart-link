import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ApiGatewayConfigService } from '@/apps/api-gateway/configs/env.config';
import { ExceptionsFilter } from '@/libs/filters/exceptions.filter';
import { RequestValidationPipe } from '@/libs/pipes/request-validation.pipe';

import { ApiGatewayModule } from './api-gateway.module';

async function bootstrap() {
	const app = await NestFactory.create(ApiGatewayModule);
	const configService = app.get(ApiGatewayConfigService);
	const logger = new Logger('API_GATEWAY');
	app.useGlobalFilters(new ExceptionsFilter());
	app.useGlobalPipes(new RequestValidationPipe());
	await app.listen(configService.get('PORT'));
	logger.log(`Микросервис "API-Gateway" запущен. Port:${configService.get('PORT')}`);
}

bootstrap();
