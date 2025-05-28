import { FindOptions, WhereOptions } from 'sequelize';

import { Scope } from '@/libs/models/scopes/scope';

export class WhereByIdScope extends Scope {
	apply(id: string): FindOptions {
		return {
			where: {
				id,
			} as WhereOptions,
		};
	}
}
