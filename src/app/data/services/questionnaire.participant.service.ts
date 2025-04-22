import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Injectable } from "@angular/core";
import { IQuestionnaireParticipant } from "../../core/models/IQuestionnaireParticipant";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireParticipantService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve meeting questionnaire
getQuestionnaireParticipant(id: string): Observable<any> {
    
   return this.httpClient.get<any>(this.api + '/questionnaire/participant/'  + id) ;
  }

  // Retrieves meeting questionnaire Participants
getQuestionnaireParticipants(questionnaireId: number, componentId:number): Observable<any[]> {
    const body = {
      questionnaireId: questionnaireId ,
       componentId: componentId     

    };
   return this.httpClient.post<any[]>(this.api + '/Questionnaire/participants/', body)  ;
  }

  // Retrieves participant's questionnaire. If contactId= 0, it will return unique participant names
getQuestionnaireParticipantByContact(contactId:number, componentId: number): Observable<any[]> { 
    const body = {
      contactId:contactId,
     componentId: componentId    
      };
   return this.httpClient.post<any[]>(this.api + '/questionnaire/getparticipant/', body) ;
  }  

  // Save meeting questionnaire participant
saveQuestionnaireParticipant(iQuestionnaireParticipant: any): Observable<any> {

   return this.httpClient.post<any>(this.api + '/questionnaire/participant/', iQuestionnaireParticipant);
  }

  // Update meeting questionnaire participant
updateQuestionnaireParticipant(iQuestionnaireParticipant: IQuestionnaireParticipant): Observable<any> {

   return this.httpClient.put<any>(this.api + '/questionnaire/participant/', iQuestionnaireParticipant) ;
  }

  // Delete meeting questionnaire participant
deleteQuestionnaireParticipant(QuestionnaireParticipantId: number): Observable<any> {

   return this.httpClient.delete<any>(this.api + '/questionnaire/participant/' + QuestionnaireParticipantId);
  }
}
