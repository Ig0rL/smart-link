import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UserModel } from '@/libs/models';
import { GenericRepository } from '@/libs/repository/generic.repository';

@Injectable()
export class UserRepository extends GenericRepository<UserModel> {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: typeof UserModel,
	) {
		super(userModel);
	}
}
