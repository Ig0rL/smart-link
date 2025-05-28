import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModel } from '@/libs/models';
import { UserRepository } from '@/libs/modules/user/user.repository';

@Module({
	imports: [SequelizeModule.forFeature([UserModel])],
	providers: [UserRepository],
	exports: [UserRepository],
})
export class UserModule {}
