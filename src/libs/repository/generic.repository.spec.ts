import {
  FindOptions,
  Model,
  ModelStatic,
} from 'sequelize';

import { Scope } from '@/libs/models/scopes/scope';

import { GenericRepository } from './generic.repository';

class TestModel extends Model {}

class TestScope extends Scope {
  apply(): FindOptions {
    return { where: { id: 1 } };
  }
}

describe('GenericRepository', () => {
  let repository: GenericRepository<TestModel>;
  let mockModel: jest.Mocked<ModelStatic<TestModel>>;
  
  beforeEach(() => {
    mockModel = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
      count: jest.fn()
    } as unknown as jest.Mocked<ModelStatic<TestModel>>;
    
    repository = new GenericRepository(mockModel);
  });
  
  it('Возвращает все записи с учетом скопов', async () => {
    const mockScope = new TestScope();
    const mockScopeResult = { where: { id: 1 } };
    jest.spyOn(mockScope, 'apply').mockReturnValue(mockScopeResult);
    
    const mockData = [{ id: 1, get: jest.fn() }];
    mockModel.findAll.mockResolvedValue(mockData as any);
    
    const result = await repository.scope(mockScope).findAll();
    
    expect(mockModel.findAll).toHaveBeenCalledWith(mockScopeResult);
    expect(result).toEqual(mockData);
  });
  
  it('Возвращает одну запись с учетом скопов', async () => {
    const mockScope = new TestScope();
    const mockScopeResult = { where: { id: 1 } };
    jest.spyOn(mockScope, 'apply').mockReturnValue(mockScopeResult);
    
    const mockData = { id: 1, get: jest.fn() };
    mockModel.findOne.mockResolvedValue(mockData as any);
    
    const result = await repository.scope(mockScope).findOne();
    
    expect(mockModel.findOne).toHaveBeenCalledWith(mockScopeResult);
    expect(result).toEqual(mockData);
  });
  
  it('Возвращает запись по id с учетом скопов', async () => {
    const mockScope = new TestScope();
    const mockScopeResult = { include: ['relation'] };
    jest.spyOn(mockScope, 'apply').mockReturnValue(mockScopeResult);
    
    const mockData = { id: 1, get: jest.fn() };
    mockModel.findByPk.mockResolvedValue(mockData as any); // Используем findByPk вместо findOne
    
    const result = await repository.scope(mockScope).findById(1);
    
    expect(mockModel.findByPk).toHaveBeenCalledWith(1, mockScopeResult);
    expect(result).toEqual(mockData);
  });
  
  it('Создает запись с учетом скопов', async () => {
    const mockScope = new TestScope();
    const mockScopeResult = { where: { id: 1 } } as FindOptions;
    jest.spyOn(mockScope, 'apply').mockReturnValue(mockScopeResult);
    
    const createData = { field: 'value' };
    const mockData = { id: 1, ...createData, get: jest.fn() };
    mockModel.create.mockResolvedValue(mockData as any);
    
    const result = await repository.scope(mockScope).create(createData);
    
    expect(mockModel.create).toHaveBeenCalledWith(createData, mockScopeResult);
    expect(result).toEqual(mockData);
  });
  
  it('Обновляет записи с учетом скопов', async () => {
    const mockScope = new TestScope();
    const mockScopeResult = { where: { status: 'active' } } as FindOptions;
    jest.spyOn(mockScope, 'apply').mockReturnValue(mockScopeResult);
    
    const updateData = { field: 'newValue' };
    const mockData = [{ id: 1, ...updateData, get: jest.fn() }];
    
    // Возвращаем массив с количеством обновленных записей и сами обновленные записи
    mockModel.update.mockResolvedValue([1, mockData] as any);
    
    const result = await repository.scope(mockScope).update(updateData);
    
    expect(mockModel.update).toHaveBeenCalledWith(updateData, {
      where: mockScopeResult.where,
      ...mockScopeResult,
      returning: true
    });
    expect(result).toEqual(mockData);
  });
  
  it('Удаляет записи с учетом скопов', async () => {
    const mockScope = new TestScope();
    const mockScopeResult = { where: { id: 1 } };
    jest.spyOn(mockScope, 'apply').mockReturnValue(mockScopeResult);
    
    mockModel.destroy.mockResolvedValue(2);
    
    const result = await repository.scope(mockScope).delete();
    
    expect(mockModel.destroy).toHaveBeenCalledWith(mockScopeResult);
    expect(result).toBe(2);
  });
  
  it('Возвращает количество записей с учетом скопов', async () => {
    const mockScope = new TestScope();
    const mockScopeResult = { where: { type: 'test' } };
    jest.spyOn(mockScope, 'apply').mockReturnValue(mockScopeResult);
    
    mockModel.count.mockResolvedValue(5);
    
    const result = await repository.scope(mockScope).count();
    
    expect(mockModel.count).toHaveBeenCalledWith(mockScopeResult);
    expect(result).toBe(5);
  });
  
  it('Преобразует результат в plain объект при использовании plain()', async () => {
    const plainData = { id: 1, name: 'test' };
    const mockData = { id: 1, get: jest.fn().mockReturnValue(plainData) };
    mockModel.findOne.mockResolvedValue(mockData as any);
    
    const result = await repository.plain().findOne();
    
    expect(result).toEqual(plainData);
    expect(mockData.get).toHaveBeenCalledWith({ plain: true, nest: true });
  });
});
