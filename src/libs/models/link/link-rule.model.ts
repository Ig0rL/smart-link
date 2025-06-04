import { Optional } from 'sequelize';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Sequelize,
  Table,
} from 'sequelize-typescript';

import {
  ILinkRule,
} from '@/libs/interfaces/link.interface';
import { LinkModel } from '@/libs/models/link/link.model';

@Table({
  tableName: 'link_rules',
  schema: 'public',
  paranoid: true,
  timestamps: true,
  underscored: true,
})
export class LinkRuleModel extends Model<LinkRuleModel, Optional<ILinkRule, 'id'>> implements ILinkRule {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: Sequelize.literal('gen_random_uuid()'),
  })
  declare id?: string;
  
  @ForeignKey(() => LinkModel)
  @Column({
    type: DataType.UUID,
    onDelete: 'CASCADE',
  })
  linkId: string;
  
  @Column({
    type: DataType.JSON,
  })
  rule: Record<string, any>;
}
