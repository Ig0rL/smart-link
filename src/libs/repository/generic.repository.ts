import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';
import type {
	ModelStatic,
	CreationAttributes,
	Attributes,
} from 'sequelize';

import { BaseRepository } from '@/libs/repository/base.repository';

@Injectable()
export class GenericRepository<T extends Model> extends BaseRepository<T> {
	constructor(model: ModelStatic<T>) {
		super(model);
	}

	async findAll(): Promise<T[]> {
		const result = await this.model.findAll(this.mergeScopes());
		return this.formatResult(result);
	}

	async findOne(): Promise<T | null> {
		const result = await this.model.findOne(this.mergeScopes());
		return this.formatResult(result);
	}

	async findById(id: number | string): Promise<T | null> {
		const result = await this.model.findByPk(id, this.mergeScopes());
		return this.formatResult(result);
	}

	async create(data: CreationAttributes<T>): Promise<T> {
		const result = await this.model.create(data, this.mergeScopes());
		return this.formatResult(result);
	}
	
	async bulkCreate(data: CreationAttributes<T>[]): Promise<T[]> {
		const result = await this.model.bulkCreate(data, {
			...this.mergeScopes(),
			returning: true
		});
		return this.formatResult(result);
	}
	
	async update(data: Partial<Attributes<T>>): Promise<T[]> {
		const scopes = this.mergeScopes();
		
		const [, rows] = await this.model.update(
			data,
			{
				where: scopes.where,
				...scopes,
				returning: true
			}
		);
		
		return this.formatResult(rows);
	}
	
	async delete(): Promise<number> {
		return this.model.destroy(this.mergeScopes());
	}
	
	async count(): Promise<number> {
		return this.model.count(this.mergeScopes());
	}
}
