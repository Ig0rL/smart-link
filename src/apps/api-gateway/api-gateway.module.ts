import { Module } from '@nestjs/common';

import { ILogin } from '@smart-link/interfaces';

@Module({})
export class ApiGatewayModule {
	constructor(private auth: ILogin) {}
}
