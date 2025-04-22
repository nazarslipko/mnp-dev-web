import { ITimeSlot } from "./IHelpers";

export interface ISignups {
    MeetingSignupId: number,
    MeetingId: number,
    MeetingComponentId: number,
    Title: string,   
    TimeSlot: ITimeSlot,
    PeopleNeeded: number,
     Description: string,
    CreatedUserId: number,
    CreatedDate?: Date|null
}