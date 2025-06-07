import { CityDecorator } from '@/apps/smart-link/rules/city.decorator';
import { IComparisonStrategy } from '@/apps/smart-link/strategies/comparison-strategy.interface';

import { CountryDecorator } from './country.decorator';
import { DatetimeDecorator } from './datetime.decorator';

describe('DatetimeDecorator', () => {
  let mockStrategy: IComparisonStrategy;
  let decorator: DatetimeDecorator;
  
  beforeEach(() => {
    mockStrategy = {
      matches: jest.fn().mockReturnValue(true) as jest.Mock
    };
    decorator = new DatetimeDecorator(mockStrategy);
  });
  
  it('Корректно сравнивает даты когда пользовательская дата раньше', () => {
    const userData = { datetime: '2024-03-19T10:00:00Z' };
    const dbObject = { datetime: '2024-03-20T12:00:00Z' };
    
    const result = decorator.matches(userData, dbObject);
    
    expect(result).toBe(true);
    expect(mockStrategy.matches).toHaveBeenCalledWith(userData, dbObject);
  });
  
  it('Корректно сравнивает даты когда даты равны', () => {
    const userData = { datetime: '2024-03-20T10:00:00Z' };
    const dbObject = { datetime: '2024-03-20T12:00:00Z' };
    
    const result = decorator.matches(userData, dbObject);
    
    expect(result).toBe(true);
    expect(mockStrategy.matches).toHaveBeenCalledWith(userData, dbObject);
  });
  
  it('Возвращает false когда пользовательская дата позже', () => {
    const userData = { datetime: '2024-03-21T10:00:00Z' };
    const dbObject = { datetime: '2024-03-20T12:00:00Z' };
    
    (mockStrategy.matches as jest.Mock).mockReturnValue(true);
    const result = decorator.matches(userData, dbObject);
    
    expect(result).toBe(false);
  });
  
  it('Возвращает false когда вложенная стратегия возвращает false', () => {
    const userData = { datetime: '2024-03-19T10:00:00Z' };
    const dbObject = { datetime: '2024-03-20T12:00:00Z' };
    
    (mockStrategy.matches as jest.Mock).mockReturnValue(false);
    const result = decorator.matches(userData, dbObject);
    
    expect(result).toBe(false);
  });
});

describe('CountryDecorator', () => {
  it('Возвращает true при совпадении стран и успешной вложенной стратегии', () => {
    const mockStrategy = { matches: jest.fn().mockReturnValue(true) };
    const decorator = new CountryDecorator(mockStrategy);
    
    const result = decorator.matches(
      { country: 'RU' },
      { country: 'RU' }
    );
    
    expect(result).toBe(true);
  });
  
  it('Возвращает false при несовпадении стран', () => {
    const mockStrategy = { matches: jest.fn().mockReturnValue(true) };
    const decorator = new CountryDecorator(mockStrategy);
    
    const result = decorator.matches(
      { country: 'RU' },
      { country: 'US' }
    );
    
    expect(result).toBe(false);
  });
});

describe('CityDecorator', () => {
  it('Возвращает true при совпадении городов и успешной вложенной стратегии', () => {
    const mockStrategy = { matches: jest.fn().mockReturnValue(true) };
    const decorator = new CityDecorator(mockStrategy);
    
    const result = decorator.matches(
      { city: 'Moscow' },
      { city: 'Moscow' }
    );
    
    expect(result).toBe(true);
  });
  
  it('Возвращает false при несовпадении городов', () => {
    const mockStrategy = { matches: jest.fn().mockReturnValue(true) };
    const decorator = new CityDecorator(mockStrategy);
    
    const result = decorator.matches(
      { city: 'Moscow' },
      { city: 'Saint Petersburg' }
    );
    
    expect(result).toBe(false);
  });
});
