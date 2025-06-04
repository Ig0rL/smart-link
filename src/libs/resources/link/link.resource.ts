import {
  Expose,
  Transform,
} from 'class-transformer';

import { BaseResource } from '@/libs/resources/base-resource';

class LinkRuleResource {
  @Expose()
  datetime: string;

  @Expose()
  country: string;
  
  @Expose()
  city: string;
  
  @Expose()
  redirect: string;
}

export class LinkResource extends BaseResource<LinkResource> {
  @Expose()
  id: string;
  
  @Expose()
  isActive: boolean;
  
  @Expose()
  link: string;
  
  @Expose()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((item) => item?.rule).filter(Boolean);
    }
    return value;
  })
  rules: LinkRuleResource[];
  
  resource(): LinkResource {
    return this.toResource(LinkResource);
  }
}
