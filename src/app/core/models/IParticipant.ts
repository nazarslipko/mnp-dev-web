export interface IParticipant {

 ParticipantId?: number;
 AffiliationLookupId?: number;
 UserId?: number;
 MeetingId?: number;
 RequestId?: number;
 RoomId?: number;
 Invited: boolean;
 Accepted: boolean;
 Declined : boolean;
 Attended : boolean;
 Revoked : boolean;
 Login?:any;
 Passcode?: string;
 CreatedDate?:any;
 ModifiedDate?:any;
}