import {
  FindOptions,
  WhereOptions,
} from 'sequelize';

export class GetLinkByLinkScope {
  apply(link: string): FindOptions {
    return {
      where: {
        link,
      } as WhereOptions,
      attributes: ['link', 'strategy'],
    };
  }
}
