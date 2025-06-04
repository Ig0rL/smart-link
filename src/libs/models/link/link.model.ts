import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  HasMany,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';

import { ILink } from '@/libs/interfaces/link.interface';
import { LinkRuleModel } from '@/libs/models/link/link-rule.model';

@Table({
  tableName: 'links',
  schema: 'public',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class LinkModel extends Model<LinkModel, Optional<ILink, 'id'>> implements ILink {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
  })
  declare id: string;
  
  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  link: string;
  
  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  strategy: string;
  
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;
  
  @HasMany(() => LinkRuleModel)
  rules: LinkRuleModel[];
}
