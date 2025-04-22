import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Injectable } from "@angular/core";
import { IContributionParticipant } from "../../core/models/IContributionParticipant";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContributionParticipantService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve meeting contribution
getContributionParticipant(id: string): Observable<any> {

  return this.httpClient.get<any>(this.api + '/contributions/participant/' + id);
  }

  // Retrieves meeting contribution participants
getContributionParticipants(contributionId: number,componentId: number): Observable<any[]> {
    const body = {
      contributionId: contributionId,
      componentId: componentId,
    };
  return this.httpClient.post<any[]>(this.api + '/contributions/participants/', body);
  }

  // Retrieves meeting contribution participant by contact
getContributionParticipantByContact(contactId: number, contributionId: number): Observable<any[]> {
    const body = {
      conctactId: contactId,
      contributionId: contributionId
    };
  return this.httpClient.post<any[]>(this.api + '/contributions/participant/', body) ;
  }

  // Save meeting contribution participant
saveContributionParticipant(iContributionParticipant: any): Observable<any> {

  return this.httpClient.post<any>(this.api + '/contributions/participant/', iContributionParticipant);
  }

  // Update meeting contribution participant
updateContributionParticipant(iContributionParticipant: IContributionParticipant): Observable<any> {

  return this.httpClient.put<any>(this.api + '/contributions/participant/', iContributionParticipant);
      
  }

  // Delete meeting contribution participant
deleteContributionParticipant(ContributionParticipantId: number): Observable<any> {

  return this.httpClient.delete<any>(this.api + '/contributions/participant/' + ContributionParticipantId);     
  }

}
