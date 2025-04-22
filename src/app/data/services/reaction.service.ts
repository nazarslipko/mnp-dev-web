import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { IReaction } from "../../core/models/IHelpers";

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  api: unknown = '';

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve user's reaction
  getReaction(id: string): Observable<IReaction> {
    return this.httpClient.get<any>(this.api + '/reactions/' + id);
  }

  // Retrieves request reactions
  getRequestReactions(requestId: number): Observable<IReaction[]> {
    const body = {
      requestId: requestId,
    };
    return this.httpClient.post<any>(this.api + '/reactions/request', body);
  }

  // Retrieves scroll reactions
  getScrollReactions(scrollId: number): Observable<IReaction> {
    const body = {
      scrollId: scrollId,
    };
    return this.httpClient.post<any>(this.api + '/reactions/scroll', body);
  }

  // Retrieves meetingreactions
  getMeetingReactions(meetingId: number): Observable<IReaction[]> {
    const body = {
      meetingId: meetingId,
    };
    return this.httpClient.post<any>(this.api + '/reactions/scroll', body);
  }

  // Saves reaction
  SaveReaction(iReaction: IReaction): Observable<any> {
    return this.httpClient.post<any>(this.api + '/reactions', iReaction);
  }

  // Edits reaction
  updateReaction(iReaction: IReaction): Observable<any[]> {
    return this.httpClient.put<any>(this.api + '/reactions', iReaction);
  }
  // Removes reaction
  deleteReaction(id: string): Observable<IReaction[]> {
    return this.httpClient.delete<any>(this.api + '/reactions/' + id);
  }
}
