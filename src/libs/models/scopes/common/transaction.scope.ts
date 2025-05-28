import { FindOptions, Transaction } from 'sequelize';

import { Scope } from '@/libs/models/scopes/scope';

export class TransactionScope extends Scope {
	apply(transaction: Transaction): FindOptions {
		return {
			transaction,
		};
	}
}
