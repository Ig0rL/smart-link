export interface ILinkRule {
  id?: string;
  linkId: string;
  rule: Record<string, any>;
}

export interface ILink {
  id: string;
  link: string;
  strategy?: string;
  isActive: boolean;
  rules?: ILinkRule[];
}

export interface ILocation {
  country: string;
  city: string;
  datetime: string;
}
