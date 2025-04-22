import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Injectable } from "@angular/core";
import { IComponent } from "../../core/models/IComponent";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class MeetingComponentService {
  private api: unknown = '';
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve component
  getMeetingComponent(id: string): Observable<any> {
    return this.httpClient.get<any>(this.api + '/components/' + id);
  }

  // Retrieves components
  getMeetingComponentsByLookup(
    meetingId: number,
    componentLookupTypeId: number,
    published: number
  ): Observable<any[]> {
    const body = {
      meetingId: meetingId,
      componentLookupTypeId: componentLookupTypeId,
      published: published
    };
    return this.httpClient.post<any[]>(this.api + '/components/all', body);
  }

  // Retrieves components
  getMeetingComponents(
    meetingId: number   
  ): Observable<any[]> {
    const body = {
      meetingId: meetingId      
    };
    return this.httpClient.post<any[]>(this.api + '/components/meeting', body);
  }

  // createcomponent
  createMeetingComponent(iComponent: IComponent): Observable<any> {
    return this.httpClient.post<any>(this.api + '/components', iComponent);
  }

  // Update component
  updateMeetingComponent(iComponent: IComponent): Observable<any> {
    return this.httpClient.put<any>(this.api + '/components', iComponent);
  }

  // Delete component
  deleteMeetingComponent(componentId: number): Observable<any> {
    return this.httpClient.delete<any>(this.api + '/components/' + componentId);
  }
}
