import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IQuestionnaire } from '../../core/models/IQuestionnaire';

@Injectable({
  providedIn: 'root',
})
export class MeetingQuestionnaireService {
  private api: unknown = '';
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve questionnaire
  getQuestionnaire(id: string): Observable<any> {
    return this.httpClient.get<any>(this.api + '/questionnaire/' + id);
  }

  // Retrieve questionnaire
  getQuestionnaireSequenceNumber(componentId: string): Observable<any> {
    return this.httpClient.get<any>(
      this.api + '/questionnaire/sequencenumber/' + componentId
    );
  }

  // Retrieves questionnaire
  getQuestionnaires(meetingId: number, componentId: number): Observable<any[]> {
    const body = {
      meetingId: meetingId,
      componentId: componentId,
    };
    return this.httpClient.post<any[]>(this.api + '/questionnaire/', body);
  }

  // Save questionnaire
  saveQuestionnaire(iQuestionnaire: IQuestionnaire): Observable<any> {
    return this.httpClient.post<any>(
      this.api + '/questionnaire/',
      iQuestionnaire
    );
  }

  // Update questionnaire
  updateQuestionnaire(iQuestionnaire: IQuestionnaire): Observable<any> {
    return this.httpClient.put<any>(
      this.api + '/questionnaire/',
      iQuestionnaire
    );
  }

  // Delete questionnaire
  deleteQuestionnaire(iQuestionnaire: number): Observable<any> {
    return this.httpClient.delete<any>(
      this.api + '/questionnaire/' + iQuestionnaire
    );
  }
}
