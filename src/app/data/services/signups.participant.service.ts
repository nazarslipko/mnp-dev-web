import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Injectable } from "@angular/core";
import { ISignupsParticipant } from "../../core/models/ISignupsParticipant";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SignupsParticipantService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve meeting signup
  getSignupParticipant(id: string): Observable<any> {
    
     return this.httpClient.get<any>(this.api + '/signups/participant/'  + id);
    }

    // Retrieves meeting signup Participants
  getSignupParticipants(signupId: number, componentId: number): Observable<any[]> {
      const body = {
        signupId: signupId,
        componentId: componentId     
        };
     return this.httpClient.post<any[]>(this.api + '/signups/participants/', body);
    }
  
    // Retrieves meeting signup participant by contact
  getSignupParticipantByContact(contactId:number, signupId: number): Observable<any[]> {
      const body = {
        conctactId:contactId,
        signupId: signupId    
        };
    return this.httpClient.post<any[]>(this.api + '/signups/participant/', body);
  }
    
  
    // Save meeting signup participant
  saveSignupParticipant(iSignupParticipant: any): Observable<any> {
  
     return this.httpClient.post<any>(this.api + '/signups/participant/', iSignupParticipant);
    }
  
    // Update meeting signup participant
  updateSignupParticipant(iSignupParticipant: ISignupsParticipant): Observable<any> {
  
     return this.httpClient.put<any>(this.api + '/signups/participant/', iSignupParticipant);
    }
  
    // Delete meeting signup participant
  deleteSignupParticipant(signupParticipantId: number): Observable<any> {
  
     return this.httpClient.delete<any>(this.api + '/signups/participant/' + signupParticipantId);
    }
}
