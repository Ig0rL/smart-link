import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import {
  LINK_REPOSITORY,
  LINK_RULE_REPOSITORY,
} from '@/apps/smart-link/constants';
import {
  CreateLinkDto,
} from '@/libs/contracts/link.dto';
import { LinkRuleModel } from '@/libs/models/link/link-rule.model';
import { LinkModel } from '@/libs/models/link/link.model';
import { IncludeScope } from '@/libs/models/scopes/common/include.scope';
import { TransactionScope } from '@/libs/models/scopes/common/transaction.scope';
import { GetLinkByLinkScope } from '@/libs/models/scopes/link/get-link-by-link.scope';
import { GenericRepository } from '@/libs/repository/generic.repository';

@Injectable()
export class LinkService {
  constructor(
    @Inject(LINK_REPOSITORY) private linkRepository: GenericRepository<LinkModel>,
    @Inject(LINK_RULE_REPOSITORY) private linkRuleRepository: GenericRepository<LinkRuleModel>,
    private readonly sequelize: Sequelize,
  ) {}
  
  async createLink(data: CreateLinkDto) {
    let result = null;
    const { rules, ...linkData } = data;
    
    const transaction = await this.sequelize.transaction();
    try {
      const strategy = `dist/apps/smart-link/strategies/factory/${linkData.link}-strategy.factory`;
      
      const link = await this.linkRepository
        .scope(new TransactionScope(), transaction)
        .plain()
        .create({ ...linkData, strategy });
      
      const preparedRules = rules.map((rule) => ({
        rule,
        linkId: link.id,
      }));
      
      const createdRules = await this.linkRuleRepository
        .scope(new TransactionScope(), transaction)
        .plain()
        .bulkCreate(preparedRules);
      
      result = { ...link, rules: createdRules };
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorCode: 'CreationLinkError',
          error: 'Ошибка при создании ссылки с правилами',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    
    return result;
  }
  
  async getLinkRules(url: string) {
    const linkData = await this.linkRepository
      .scope(new GetLinkByLinkScope(), url)
      .scope(new IncludeScope(LinkRuleModel))
      .plain()
      .findOne()
    
    if (!linkData) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorCode: 'LinkError',
          error: 'Ошибка при получении ссылки',
          message: 'URL не найден или не существует',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    
    const prparedLinkRules = linkData.rules.map((rule) => (rule.rule));
    return { link: linkData.link, strategy: linkData.strategy, rules: prparedLinkRules };
  }
}
