import { ILookup } from "./ILookup";

// Helper for Contact. Only filtered user details
export interface IContact {
  UserId: number;
  ClientId?: number,
  RoleId?: number,
  AffiliationLookupId: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Active?: boolean,
  Moderator?: boolean,
  Intercessor?: boolean | undefined
}

// Helper for delete model
export interface IDelete {

  IsDeleted: boolean;
  Message: string;
}
export interface IRequestStatus {
  RequestStatusId: number,
  UserId: number,
  RequestId: number,
  TakeRelease: number,
  Prayed: number,
  InProgress: number,
  CreatedDate?: Date,
  ModifiedDate?: Date
}
// Helper for story reactions
export interface IReaction {
  ReactionId?: number;
  AffiliationLookupId: number;
  MeetingId: number;
  UserId: number;
  RequestId: number;
  ScrollId: number;
  Loves: number;
  Likes: number;
  Downloads: number;
  Listened: number;
  Shared: number;
  Star: number;
  Inappropriate: number;
  Prayed: Number;
}

// Helper for Request date
export interface IAvailability {
  Note?: string;
  RequestId?: number,
  RequestDate: string;
  RequestTime: string;
  Timezone: string;
}
// combine Iscroll and IRequest
export interface IScrollRequestCombined {
  ScrollId?: number;
  UserId?: number;
  AffiliationLookupId?: number;
  CategoryLookupId?: number;
  Title: string;
  Story: string;
  Tags: string;
  Inappropriate: boolean;
  CreatedDate?: Date;
  ModifiedDate?: Date;
  Affiliation?: ILookup[];
  Contact?: IContact[];
  Reaction?: IReaction[];
  // Irequest properties
  RequestId?: number;
  ServiceTypeLookupId?: any;
  Purpose: string;
  Request: string;
  Availability?: IAvailability;
  Confidential: boolean;
  Videoconference: boolean;
  AcceptNotifications: boolean;
  AcceptSharing: boolean;
  Answered: boolean;
  InSession: boolean;
}

// Helper to track time
export interface ITime {
  TimeId: string;
  Time: string;
}
// helper management recurrance of 
export interface IRecurrenceValues {
  RecurrenceId: string;
  Recurrence: string;
}

export interface IDayReminder {
  DayId: string;
  Day: string;
}
export interface IHourlyReminder {
  HourId: string;
  Hour: string;
}
// address helper
export interface IAddress {
  Street1?: string;
  Street2?: string;
  City?: string;
  StateProvince?: string;
  Country?: string;
  Zipcode?: string;
}
export interface IConfidential {
  IsPublic: boolean,
  IsOnline: boolean,
  InPerson: boolean,
  Hybrid: boolean,
}

export interface IReminders {
  Days: string,
  Hours: string;
}
export interface IRecurrence {
  Recurring: string;
  RecurringEndDate: any;
}

export interface ITimeSlot {
   StartTime: string,
  EndTime: string;
}

export interface IQuestionType{
  QuestionTypeId: string,
  QuestionType: string
}


