import { IAvailability, IContact } from "./IHelpers";
import { ILookup } from "./ILookup";

export interface IRequest {
  RequestId?: number;
  AffiliationLookupId?: number;
  UserId?: number;
  ServiceTypeLookupId?: any;
  Purpose: string;
  Request: string;
  Availability?: IAvailability;
  Tags: any;
  Confidential: boolean;
  Videoconference: boolean;
  AcceptNotifications: boolean;
  AcceptSharing: boolean;
  Answered: boolean;
  InSession: boolean;
  Inappropriate: boolean;
  TakeRelease: boolean,
  AssignedUserId?: number,
  AssignedDate?: any,
  CreatedDate?: any;
  ModifiedDate?: any;
  AssignedContact?: IContact,
  Affiliation?: ILookup[];
  Contact?: IContact[];
}
