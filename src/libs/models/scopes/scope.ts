import { FindOptions } from 'sequelize';

export abstract class Scope {
	abstract apply(...args: any[]): FindOptions;
}
