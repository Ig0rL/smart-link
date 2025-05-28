import { FindOptions, ModelStatic } from 'sequelize';
import { Model } from 'sequelize-typescript';

import { Scope } from '../scope';

export class IncludeScope<T extends Model> extends Scope {
	constructor(
		private readonly includeModel: ModelStatic<T>,
		private readonly scopes: Scope[] = [],
	) {
		super();
	}

	apply(...args: any[]): FindOptions {
		const includeOptions = this.scopes.reduce(
			(options, scope) => ({
				...options,
				...scope.apply(...args),
			}),
			{},
		);

		return {
			include: [
				{
					model: this.includeModel,
					...includeOptions,
				},
			],
		};
	}
}
