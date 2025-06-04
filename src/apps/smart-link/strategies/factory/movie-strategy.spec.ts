import { Test, TestingModule } from '@nestjs/testing';

import { CityDecorator } from '@/apps/smart-link/rules/city.decorator';
import { CountryDecorator } from '@/apps/smart-link/rules/country.decorator';
import { DatetimeDecorator } from '@/apps/smart-link/rules/datetime.decorator';
import { BaseComparisonStrategy } from '@/apps/smart-link/strategies/base-comparison.strategy';

import { MovieStrategyFactory } from './movie-strategy.factory';

describe('MovieStrategyFactory', () => {
  let module: TestingModule;
  let factory: MovieStrategyFactory;
  
  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        MovieStrategyFactory,
        BaseComparisonStrategy,
        CityDecorator,
        CountryDecorator,
        DatetimeDecorator
      ],
    }).compile();
    
    factory = module.get<MovieStrategyFactory>(MovieStrategyFactory);
  });
  
  afterEach(async () => {
    await module.close();
  });
  
  it('Создает стратегию с правильной цепочкой декораторов', () => {
    const strategy = factory.createStrategy();
    
    expect(strategy).toBeInstanceOf(CityDecorator);
    expect(strategy['strategy']).toBeInstanceOf(CountryDecorator);
    expect(strategy['strategy']['strategy']).toBeInstanceOf(DatetimeDecorator);
    expect(strategy['strategy']['strategy']['strategy']).toBeInstanceOf(BaseComparisonStrategy);
  });
});
