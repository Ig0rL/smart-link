import { FindOptions } from 'sequelize';

import { Scope } from '@/libs/models/scopes/scope';

export class UserLoginAttributesScope extends Scope {
	apply(): FindOptions {
		return {
			attributes: ['id', 'email', 'password', 'name'],
		};
	}
}
