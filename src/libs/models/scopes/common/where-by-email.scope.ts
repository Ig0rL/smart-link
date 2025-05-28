import { FindOptions, WhereOptions } from 'sequelize';

import { Scope } from '@/libs/models/scopes/scope';

export class WhereByEmailScope extends Scope {
	apply(email: string): FindOptions {
		return {
			where: {
				email,
			} as WhereOptions,
		};
	}
}
