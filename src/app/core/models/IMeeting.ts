import { IAddress, IConfidential, IRecurrence, IReminders } from "./IHelpers";
export interface IMeeting {
  MeetingId?: number;
  AffiliationLookupId?: number;
  UserId?: number;
  Title?: string;
  Story?: string;
  Location?: IAddress;
  Tags?: string|undefined;
  StartTime?: string;
  EndTime?: string;
  StartDate?: any;
  EndDate?: any;
  Banner?: string;
  Recurrence?: IRecurrence;
  Reminders?: IReminders;
  Confidential?: IConfidential;
  Restriction?: string;
  TimeZone?: string;
  Inappropriate: boolean;
  CreatedDate?: any;
  ModifiedDate?: any;
}
