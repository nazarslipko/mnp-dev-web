import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Observable, map } from "rxjs";
import { IMeeting } from "../../core/models/IMeeting";
import { IDelete } from "../../core/models/IHelpers";

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve meeting
getMeeting(id: number): Observable<any> { 
   
   return this.httpClient.get<any>(this.api + '/meetings/'+id) ;
  }

  // Retrieves Meetings
getMeetings(affiliationLookupId: number, pageNumber: number, pageSize: number, ascDesc: number, searchValue: string): Observable<IMeeting[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,    
      pageNumber: pageNumber,
      pageSize: pageSize,
      ascDesc: ascDesc,
      searchValue: searchValue
    };
   return this.httpClient.post<any>(this.api + '/meetings/all', body);
  }

  // flag Meetings
  
flagMeeting(meeting: IMeeting): Observable<IMeeting> {

    const body = {
     meetingId: meeting.MeetingId
    };
   return this.httpClient.post<IMeeting>(this.api + '/meetings/flag', meeting );
  }

  // flagged Meetings
flaggedMeeting(iMeeting: IMeeting): Observable<IMeeting[]> {

    const body = {
      inappropriate: iMeeting.Inappropriate
    };
   return this.httpClient.post<any>(this.api + '/meetings/flagged', body)  ;
  }

  // user Meetings
getUserMeeting(userId: number): Observable<IMeeting[]> {
    const body = {     
      userId: userId     
    };
   return this.httpClient.post<any>(this.api + '/meetings/user', body);
  }

    // user's Meeting members
  getUserMeetingMembers(userId: number): Observable<IMeeting[]> {
      const body = {     
        userId: userId     
      };
     return this.httpClient.post<any>(this.api + '/meetings/usermembership', body);
    }
  // Create Meeting
createMeeting(iMeeting: IMeeting): Observable<IMeeting> {

   return this.httpClient.post<any>(this.api + '/meetings', iMeeting)  ;
  }

  // Edit Meeting
updateMeeting(iMeeting: IMeeting): Observable<IMeeting> { 

   return this.httpClient
      .put<any>(this.api + '/meetings', iMeeting)      ;
  }
  // Remove Meeting
deleteMeeting(id: string): Observable<IDelete> {

   return this.httpClient.delete<any>(this.api + '/meetings/' + id);
  }
}
