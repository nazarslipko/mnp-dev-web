import { IContribution } from "./IContribution";
import { IQuestionnaire } from "./IQuestionnaire";
import { ISignups } from "./ISignups";

export interface IComponent {
  MeetingComponentId: number;
  MeetingId: number;
  ComponentLookupTypeId: number;
  Title: string;
  StartDate?: Date | null;
  EndDate?: Date | null;
  IsPublished: boolean;
  Contributions?: IContribution[];
  Questionnaire?: IQuestionnaire[];
  Signups?: ISignups[];
}