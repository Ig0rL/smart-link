import { Optional } from 'sequelize';
import { Column, DataType, Model, Sequelize, Table } from 'sequelize-typescript';

import { IUser } from '@/libs/interfaces';

@Table({
	tableName: 'users',
	schema: 'public',
	paranoid: true,
	timestamps: true,
	underscored: true,
})
export class UserModel extends Model<UserModel, Optional<IUser, 'id'>> implements IUser {
	@Column({
		type: DataType.UUID,
		primaryKey: true,
		defaultValue: Sequelize.literal('gen_random_uuid()'),
	})
	declare id: string;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
	})
	name: string;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
	})
	password!: string;

	@Column({
		type: DataType.STRING(255),
		allowNull: false,
	})
	email: string;
}
