import { ILookup } from './ILookup';
import { IContact, IReaction } from './IHelpers';
export interface IScroll {
  ScrollId?: number;
  UserId?: number;
  AffiliationLookupId?: number;
  CategoryLookupId?: number;
  Title: string;
  Story: string;
  Tags: any;
  Inappropriate: boolean;
  CreatedDate?: any;
  ModifiedDate?: any;
  Affiliation?: ILookup[];
  Contact?: IContact[];
  Reaction?: IReaction[];
}
