import {
  Type,
} from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class LinkRuleDto {
  [key: string]: any;
}

export class CreateLinkDto {
  @IsString()
  @IsDefined()
  link: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkRuleDto)
  rules?: LinkRuleDto[];
}

export class LinkDto extends CreateLinkDto {
  @IsUUID()
  @IsString()
  @IsOptional()
  @IsDefined()
  id!: string;
  
  @IsBoolean()
  @IsOptional()
  isActive!: boolean;
}
