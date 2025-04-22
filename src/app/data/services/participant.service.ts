import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { IParticipant } from "../../core/models/IParticipant";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ParticipantService {
  private api: unknown = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // get participant
  getParticipant(id: string): Observable<any> {
    return this.httpClient.get<any>(this.api + '/participants/' + id);
  }

  // Saves participant
  SaveParticipant(iParticipant: IParticipant): Observable<any> {
    const body = {
      AffiliationLookupId: iParticipant.AffiliationLookupId,
      UserId: iParticipant.UserId,
      MeetingId: iParticipant.MeetingId,
      RequestId: iParticipant.RequestId,
      RoomId: iParticipant.RoomId,
      Invited: iParticipant.Invited,
      Accepted: iParticipant.Accepted,
      Declined: iParticipant.Declined,
      Attended: iParticipant.Attended,
      Revoked: iParticipant.Revoked,
      Login: iParticipant.Login,
      Passcode: iParticipant.Passcode,
      CreatedDate: iParticipant.CreatedDate,
      ModifiedDate: iParticipant.ModifiedDate,
    };
    return this.httpClient.post<any>(this.api + '/participants', body);
  }

  // Edits participant
  updateParticipant(iParticipant: IParticipant): Observable<any> {
    return this.httpClient.put<any>(this.api + '/participants', iParticipant);
  }
  // Removes reaction
  deleteParticipant(id: string): Observable<IParticipant[]> {
    return this.httpClient.delete<any>(this.api + '/participants/' + id);
  }

  // meeting participant
  getMeetingParticipants(
    meetingId: number,
    affiliationLookupId: number,
    pageNumber: number,
    pageSize: number,
    date: string
  ): Observable<any[]> {
    const body = {
      meetingId: meetingId,
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      date: date ?? 'All',
    };
    return this.httpClient.post<any[]>(
      this.api + '/participants/meeting',
      body
    );
  }

  // meeting participant
  getRequestParticipants(
    requestId: number,
    affiliationLookupId: number,
    pageNumber: number,
    pageSize: number,
    date: string
  ): Observable<any[]> {
    const body = {
      requestId: requestId,
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      date: date ?? 'All',
    };
    return this.httpClient.post<any[]>(
      this.api + '/participants/request',
      body
    );
  }

  // Room participant
  getRoomParticipants(
    roomId: number,
    affiliationLookupId: number,
    pageNumber: number,
    pageSize: number,
    date: string
  ): Observable<any[]> {
    const body = {
      roomId: roomId,
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      date: date ?? 'All',
    };
    return this.httpClient.post<any>(this.api + '/participants/room', body);
  }
}
