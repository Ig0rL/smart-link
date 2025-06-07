import { Test, TestingModule } from '@nestjs/testing';
import { Sequelize } from 'sequelize-typescript';

import {
  LINK_REPOSITORY,
  LINK_RULE_REPOSITORY,
} from '@/apps/smart-link/constants';
import { LinkRuleModel } from '@/libs/models/link/link-rule.model';
import { LinkModel } from '@/libs/models/link/link.model';
import { GenericRepository } from '@/libs/repository/generic.repository';

import { LinkService } from './link.service';
import { GetLinkByLinkScope } from '@/libs/models/scopes/link/get-link-by-link.scope';
import { IncludeScope } from '@/libs/models/scopes/common/include.scope';
import {
  HttpException,
  HttpStatus,
} from '@nestjs/common';

describe('LinkService', () => {
  let service: LinkService;
  let linkRepository: GenericRepository<LinkModel>;
  let linkRuleRepository: GenericRepository<LinkRuleModel>;
  let sequelize: Sequelize;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinkService,
        {
          provide: LINK_REPOSITORY,
          useValue: {
            scope: jest.fn().mockReturnThis(),
            plain: jest.fn().mockReturnThis(),
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: LINK_RULE_REPOSITORY,
          useValue: {
            scope: jest.fn().mockReturnThis(),
            plain: jest.fn().mockReturnThis(),
            bulkCreate: jest.fn(),
          },
        },
        {
          provide: Sequelize,
          useValue: {
            transaction: jest.fn(),
          },
        },
      ],
    }).compile();
    
    service = module.get<LinkService>(LinkService);
    linkRepository = module.get(LINK_REPOSITORY);
    linkRuleRepository = module.get(LINK_RULE_REPOSITORY);
    sequelize = module.get(Sequelize);
  });
  
  describe('createLink', () => {
    const mockTransaction = { commit: jest.fn(), rollback: jest.fn() };
    
    beforeEach(() => {
      (sequelize.transaction as jest.Mock).mockResolvedValue(mockTransaction);
    });
    
    it('Успешно создает ссылку с правилами', async () => {
      const mockLink = { id: '1', link: 'test.com' };
      const mockRules = [{ datetime: '2024-03-20' }];
      const mockCreatedRules = [{ id: '1', linkId: '1', rule: mockRules[0] }];
      
      (linkRepository.create as jest.Mock).mockResolvedValue(mockLink);
      (linkRuleRepository.bulkCreate as jest.Mock).mockResolvedValue(mockCreatedRules);
      
      const result = await service.createLink({
        link: 'test.com',
        rules: mockRules
      });
      
      expect(result).toEqual({
        ...mockLink,
        rules: mockCreatedRules
      });
    });
    
    it('Откатывает транзакцию при ошибке создания ссылки', async () => {
      const error = new Error('Ошибка создания');
      (linkRepository.create as jest.Mock).mockRejectedValue(error);
      
      await expect(service.createLink({
        link: 'test.com',
        rules: []
      })).rejects.toThrow(error);
      
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
    
    it('Откатывает транзакцию при ошибке создания правил', async () => {
      const mockLink = { id: '1', link: 'test.com' };
      const error = new Error('Ошибка создания правил');
      
      (linkRepository.create as jest.Mock).mockResolvedValue(mockLink);
      (linkRuleRepository.bulkCreate as jest.Mock).mockRejectedValue(error);
      
      await expect(service.createLink({
        link: 'test.com',
        rules: [{ datetime: '2024-03-20' }]
      })).rejects.toThrow(error);
      
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });
  
  describe('getLinkRules', () => {
    it('Успешно возвращает правила для ссылки', async () => {
      const mockLink = {
        id: '1',
        link: 'test.com',
        strategy: 'dist/apps/smart-link/strategies/factory/test.com-strategy.factory',
        rules: [
          { id: '1', linkId: '1', rule: { datetime: '2024-03-20' } },
          { id: '2', linkId: '1', rule: { datetime: '2024-03-21' } }
        ]
      };
      
      (linkRepository.scope as jest.Mock)
        .mockImplementation((scope) => {
          if (scope instanceof GetLinkByLinkScope) {
            return linkRepository;
          }
          if (scope instanceof IncludeScope) {
            return linkRepository;
          }
          return linkRepository;
        });
      (linkRepository.plain as jest.Mock).mockReturnThis();
      (linkRepository.findOne as jest.Mock).mockResolvedValue(mockLink);
      
      const result = await service.getLinkRules('test.com');
      
      expect(result).toEqual({
        link: mockLink.link,
        strategy: mockLink.strategy,
        rules: [
          { datetime: '2024-03-20' },
          { datetime: '2024-03-21' }
        ]
      });
      
      expect(linkRepository.scope).toHaveBeenNthCalledWith(1, expect.any(GetLinkByLinkScope), 'test.com');
      expect(linkRepository.scope).toHaveBeenNthCalledWith(2, expect.any(IncludeScope));
    });
    
    it('Выбрасывает HttpException если ссылка не найдена', async () => {
      (linkRepository.scope as jest.Mock).mockReturnThis();
      (linkRepository.plain as jest.Mock).mockReturnThis();
      (linkRepository.findOne as jest.Mock).mockResolvedValue(null);
      
      await expect(service.getLinkRules('non-existent.com')).rejects.toThrow(
        new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            errorCode: 'LinkError',
            error: 'Ошибка при получении ссылки',
            message: 'URL не найден или не существует',
          },
          HttpStatus.BAD_REQUEST,
        )
      );
    });
  });
});
