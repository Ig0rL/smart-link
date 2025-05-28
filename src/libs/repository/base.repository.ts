import { Injectable } from '@nestjs/common';
import { Model } from 'sequelize';
import type { FindOptions, ModelStatic } from 'sequelize';

import { Scope } from '@/libs/models/scopes/scope';

@Injectable()
export abstract class BaseRepository<T extends Model> {
	protected scopes: FindOptions<T>[] = [];
	protected isPlain: boolean = false;

	protected constructor(protected readonly model: ModelStatic<T>) {}

	scope(scopeInstance: Scope, ...args: any[]): this {
		const scopeOptions = scopeInstance.apply(...args);
		this.scopes.push(scopeOptions);
		return this;
	}

	protected mergeScopes(): FindOptions<T> {
		return this.scopes.reduce((acc, scope) => {
			return { ...acc, ...scope };
		}, {});
	}
	
	plain(): this {
		this.isPlain = true;
		return this;
	}
	
	protected formatResult<R extends T | T[] | null>(result: R): R {
		if (!result || !this.isPlain) return result;
		
		const plainOptions = {
			plain: true,
			nest: true // добавляем для обработки вложенных ассоциаций
		};
		
		if (Array.isArray(result)) {
			return result.map(item => item.get(plainOptions)) as R;
		}
		
		return result.get(plainOptions) as R;
	}
}
