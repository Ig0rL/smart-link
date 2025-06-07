import { Test, TestingModule } from '@nestjs/testing';

import { LinkService } from '@/apps/smart-link/link.service';
import { CreateLinkDto } from '@/libs/contracts/link.dto';

import { CreateLinkController } from './create-link.controller';

describe('CreateLinkController', () => {
  let controller: CreateLinkController;
  let linkService: LinkService;
  
  const mockLinkService = {
    createLink: jest.fn()
  };
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateLinkController],
      providers: [
        {
          provide: LinkService,
          useValue: mockLinkService
        }
      ]
    }).compile();
    
    controller = module.get<CreateLinkController>(CreateLinkController);
    linkService = module.get<LinkService>(LinkService);
  });
  
  describe('#__invoke() -> createLink() -> resource()', () => {
    it('Должен создать ссылку и вернуть трансформированный ресурс', async () => {
      const createLinkDto: CreateLinkDto = {
        link: 'https://example.com',
        rules: [
          {
            datetime: '2024-03-20T12:00:00Z',
            country: 'RU',
            city: 'Moscow',
            redirect: 'https://redirect.com'
          }
        ]
      };
      
      const mockServiceResponse = {
        id: '123',
        isActive: true,
        link: 'https://example.com',
        rules: [
          {
            rule: {
              datetime: '2024-03-20T12:00:00Z',
              country: 'RU',
              city: 'Moscow',
              redirect: 'https://redirect.com'
            },
          }
        ]
      };
      
      mockLinkService.createLink.mockResolvedValue(mockServiceResponse);
      
      const result = await controller.__invoke(createLinkDto);
      const expected = {
        id: '123',
        isActive: true,
        link: 'https://example.com',
        rules: [
          {
            datetime: '2024-03-20T12:00:00Z',
            country: 'RU',
            city: 'Moscow',
            redirect: 'https://redirect.com'
          }
        ]
      };
      
      expect(linkService.createLink).toHaveBeenCalledWith(createLinkDto);
      expect(result).toEqual(expected);
    });
  });
});
