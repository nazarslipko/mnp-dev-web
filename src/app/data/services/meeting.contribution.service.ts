import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Component, Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { IContribution } from "../../core/models/IContribution";

@Injectable({
  providedIn: 'root'
})
export class MeetingContributionService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

    // Retrieve contribution
  getContribution(id: string): Observable<any> {
  
     return this.httpClient.get<any>(this.api + '/contributions/'  + id);
    }
  
    // Retrieves contributions
  getMeetingContributions(meetingId: number): Observable<any[]> {
      const body = {
        meetingId: meetingId     

      };
     return this.httpClient.post<any[]>(this.api + '/contributions/', body);
    }
       // Retrieves contributions
  getMeetingContributionByComponent(meetingId: number, componentId:number): Observable<any[]> {
      const body = {
        meetingId: meetingId,
        componentId: componentId
      };
     return this.httpClient.post<any>(this.api + '/contributions/component', body);
    }
  
    // Save contribution
  saveContribution(iContribution: IContribution): Observable<any> {
  
     return this.httpClient.post<any>(this.api + '/contributions/', iContribution);
    }
  
    // Update contribution
  updateContribution(iContribution: IContribution): Observable<any> {
  
     return this.httpClient.put<any>(this.api + '/contributions/', iContribution);
    }
  
    // Delete contribution
  deleteContribution(iContribution: number): Observable<any> {
  
     return this.httpClient.delete<any>(this.api + '/contributions/'+ iContribution);
    }
}
