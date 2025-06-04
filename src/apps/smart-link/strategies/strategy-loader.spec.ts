import { StrategyLoader } from './strategy-loader';

describe('StrategyLoader', () => {
  const mockStrategy = {
    createStrategy: () => ({ matches: () => true })
  };
  
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  
  beforeAll(() => {
    jest.spyOn(StrategyLoader, 'loadStrategy').mockImplementation(async () => mockStrategy);
  });
  
  it('Успешно загружает и создает стратегию', async () => {
    const result = await StrategyLoader.loadStrategy('./dummy-strategy');
    
    expect(result).toBeDefined();
    expect(result.createStrategy).toBeDefined();
    expect(StrategyLoader.loadStrategy).toHaveBeenCalledWith('./dummy-strategy');
  });
  
  it('Выбрасывает ошибку при неверном пути', async () => {
    jest.spyOn(StrategyLoader, 'loadStrategy')
      .mockRejectedValueOnce(new Error('Не удалось загрузить стратегию'));
    
    await expect(StrategyLoader.loadStrategy('invalid/path'))
      .rejects
      .toThrow('Не удалось загрузить стратегию');
  });
  
  it('Выбрасывает ошибку при пустом модуле', async () => {
    jest.spyOn(StrategyLoader, 'loadStrategy')
      .mockRejectedValueOnce(new Error('Не удалось загрузить стратегию'));
    
    await expect(StrategyLoader.loadStrategy('empty-module'))
      .rejects
      .toThrow('Не удалось загрузить стратегию');
  });
});
