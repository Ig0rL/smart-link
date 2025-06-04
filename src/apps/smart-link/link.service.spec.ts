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
});
