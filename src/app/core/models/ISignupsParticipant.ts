import { IContact } from './IHelpers';
import { ISignups } from './ISignups';

export interface ISignupsParticipant {
  MeetingSignupParticipantId: number;
  UserId: number;
  MeetingComponentId: number;
  MeetingSignupId: number;
  CreatedUserId: number;
  CreatedDate?: Date | null;
  ModifiedUserId?: number;
  ModifiedDate?: Date | null;
  Contact?: IContact[];
  Signups?: ISignups[];
}
