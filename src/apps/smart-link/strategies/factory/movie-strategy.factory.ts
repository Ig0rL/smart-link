import { Injectable } from '@nestjs/common';

import { CityDecorator } from '@/apps/smart-link/rules/city.decorator';
import { CountryDecorator } from '@/apps/smart-link/rules/country.decorator';
import { DatetimeDecorator } from '@/apps/smart-link/rules/datetime.decorator';
import { BaseComparisonStrategy } from '@/apps/smart-link/strategies/base-comparison.strategy';
import {
  IComparisonStrategy,
  ICreateStrategy,
} from '@/apps/smart-link/strategies/comparison-strategy.interface';

@Injectable()
export class MovieStrategyFactory implements ICreateStrategy {
  createStrategy(): IComparisonStrategy {
    let strategy: IComparisonStrategy = new BaseComparisonStrategy();
    strategy = new DatetimeDecorator(strategy);
    strategy = new CountryDecorator(strategy);
    strategy = new CityDecorator(strategy);
    return strategy;
  }
}
