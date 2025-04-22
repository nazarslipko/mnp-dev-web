import { IContact } from "./IHelpers";
import { IContribution } from "./IContribution";

export interface IContributionParticipant {
  MeetingContributionParticipantId: number;
  UserId: number;
  MeetingComponentId: number;
  MeetingContributionId: number;
  Amount?: number;
  Quantity: number;
  CreatedDate?: Date|null;
  ModifiedDate?: Date | null;
  Contact?: IContact[];
  Contributions?: IContribution[];
}