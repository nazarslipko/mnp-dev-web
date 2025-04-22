import { IContact } from './IHelpers';
import { IQuestionnaire } from './IQuestionnaire';

export interface IQuestionnaireParticipant {
  MeetingQuestionnaireParticipantId: number;
  UserId: number;
  MeetingComponentId: number;
  MeetingQuestionnaireId: number;
  QuestionAnswer: string;
  CreatedUserId?: number;
  CreatedDate?:Date|null
  Contact?: IContact[];
  Questionnaire?: IQuestionnaire[];
}
