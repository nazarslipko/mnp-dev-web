import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Injectable } from "@angular/core";
import { ISignups } from "../../core/models/ISignups";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MeetingSignupsService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve meeting signup
getMeetingSignup(id: string): Observable<any> {
  
   return this.httpClient.get<any>(this.api + '/signups/'  + id)
     ;
  }

  // Retrieves meeting signup
getMeetingSignups(meetingId: number, componentId:number): Observable<any[]> {
    const body = {
      meetingId: meetingId,
      componentId: componentId

    };
   return this.httpClient.post<any[]>(this.api + '/signups/', body)
     ;
  }

  // Save meeting signup
savetMeetingSignup(iMeetingSignup: ISignups): Observable<any> {

   return this.httpClient.post<any>(this.api + '/signups/', iMeetingSignup)
      ;
  }

  // Update meeting signup
updateMeetingSignup(iMeetingSignup: ISignups): Observable<any> {

   return this.httpClient.put<any>(this.api + '/signups/', iMeetingSignup);
  }

  // Delete meeting signup
deleteMeetingSignup(iMeetingSignup: number): Observable<any> {

   return this.httpClient.delete<any>(this.api + '/signups/'+ iMeetingSignup)  ;
  }
}
