export interface IContribution {
    MeetingContributionId: number,
    MeetingId: number,
    MeetingComponentId: number,
    ItemName: string,
    Quantity: number,
    Measure: string,
    Category: string,
    IsMonetaryContribution?: boolean,
    ShortDescription?: string
    LongDescription?: string
    CreatedUserId: number,
    CreatedDate?: Date| null
}