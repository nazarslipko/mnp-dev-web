import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Observable, map } from "rxjs";
import { INotes } from "../../core/models/INotes";

@Injectable({
  providedIn: 'root'
})

export class NoteService {

  api: unknown = '';

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve Note
getNote(id: string): Observable<INotes> {

   return this.httpClient.get<any>(this.api + '/notes/' + id)
      ;
  }

  // Retrieves request notes
getNotes(affiliationLookupId: number,pageNumber: number, pageSize:number, ascDesc: number): Observable<INotes[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      ascDesc: ascDesc
    };
   return this.httpClient.post<any>(this.api + '/notes/all', body)
      ;
  }

  // Retrieves request notes
getRequestNotes(requestId: number, affiliationLookupId: number): Observable<INotes[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      requestId: requestId,
    };
   return this.httpClient.post<any>(this.api + '/notes/request', body)      ;
  }

    // Retrieves meeting notes
  getMeetingNotes(meetingId: number, affiliationLookupId: number): Observable<INotes[]> {
      const body = {
        affiliationLookupId: affiliationLookupId,
        meetingId: meetingId,
      };
     return this.httpClient.post<any>(this.api + '/notes/meeting', body)
       ;
    }

  // Save note
savetNote(iNotes: INotes): Observable<INotes> {

   return this.httpClient.post<any>(this.api + '/notes', iNotes)
      ;
  }

  // Update note
updateNote(iNotes: INotes): Observable<INotes> {

   return this.httpClient.put<any>(this.api + '/notes', iNotes)
      ;
  }

  // Delete note
deleteNote(noteId: number): Observable<INotes> {

   return this.httpClient.delete<any>(this.api + '/notes/' + noteId) ;
  }

}
