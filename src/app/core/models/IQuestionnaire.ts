export interface IQuestionnaire {
    MeetingQuestionnaireId: number,
    MeetingId: number,
    MeetingComponentId: number,
    Question: string,
    Description: string,
    AnswerOptions: string,
    QuestionType: string,
    SequenceNumber: number,
    Required: boolean,
    CreatedUserId: number,
    CreatedDate?: Date | null
    ModifiedUserId: number,
    ModifiedDate?: Date | null

}