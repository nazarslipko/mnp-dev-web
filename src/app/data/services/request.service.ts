import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { IRequest } from "../../core/models/IRequest";
import { Observable, map } from "rxjs";
import { Injectable } from "@angular/core";
import { IRequestStatus } from "../../core/models/IHelpers";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private api: unknown ='';

  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve user's request
getRequest(id: string): Observable<IRequest> {
    
   return this.httpClient.get<any>(this.api + '/requests/' + id);
  }

  // Retrieves all requests
getRequests(affiliationLookupId: number, serviceTypeLookupId: any, pageNumber: number, pageSize: number, confidential:number, ascDesc:number, searchValue: string): Observable<IRequest[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      serviceTypeLookupId: serviceTypeLookupId,
      pageNumber: pageNumber,    
      pageSize: pageSize,
      confidential: confidential,
      ascDesc: ascDesc,
      searchValue: searchValue
    };
   return this.httpClient.post<any>(this.api + '/requests/all', body) ;
  }

  // Retrieves answered prayer requests
getAnsweredPrayerRequests(userId: number, affiliationLookupId: number, serviceTypeLookupId: any, pageNumber: number, pageSize: number, confidential: number, ascDesc: number, searchValue: string): Observable<IRequest[]> {
    const body = {
      userId: userId,
      affiliationLookupId: affiliationLookupId,
      serviceTypeLookupId: serviceTypeLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      confidential: confidential,
      ascDesc: ascDesc,
      searchValue: searchValue
    };
   return this.httpClient.post<any>(this.api + '/requests/prayed', body);
  }

  // Retrieves requests by affiliation
getRequestsByAffiliation(affiliationLookupId: number, pageNumber: number, pageSize: number, date: string, searchValue: string): Observable<IRequest[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      date: date,
      searchValue: searchValue
    };
   return this.httpClient.post<any>(this.api + '/requests/affiliation', body);
  }

  // Retrieves requests by category
getRequestsByACategory(serviceTypeLookupId: number, pageNumber: number, pageSize: number, date: string, searchValue: string): Observable<IRequest[]> {
    const body = {
      serviceTypeLookupId: serviceTypeLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      date: date,
      searchValue: searchValue
    };
   return this.httpClient.post<any>(this.api + '/requests/category', body);
  }

  // Retrieves user's requests
getUserRequests(userId: number, serviceTypeLookupId: number): Observable<IRequest[]> {
    const body = {
      userId: userId,
      serviceTypeLookupId: serviceTypeLookupId      
    };
   return this.httpClient.post<any>(this.api + '/requests/user', body)
     ;
  }

  // Retrieves requests taken by user
getTakenRequest(userId: number): Observable<IRequest[]> {
    const body = {  userId: userId };
   return this.httpClient.post<any>(this.api + '/requests/taken', body);
  }

  // Flags request
flagRequest(iRequest: IRequest): Observable<IRequest[]> {

   return this.httpClient.post<any>(this.api + '/requests/flag', iRequest);
  }
  
  // Take or release Request Assignement
takeReleaseRequest(iRequest: IRequest): Observable<IRequest> {
    const body = {
      requestId: iRequest.RequestId,
      assignedUserId: iRequest.AssignedUserId,
      takeRelease: iRequest.TakeRelease    
    };

   return this.httpClient.post<any>(this.api + '/requests/takerelease', iRequest);
  }

  // Saves request
saveRequest(iRequest: IRequest): Observable<IRequest> {
   return this.httpClient.post<any>(this.api + '/requests', iRequest);
  }

  // Edits request
updateRequest(iRequest: IRequest): Observable<IRequest[]> {

   return this.httpClient.put<any>(this.api + '/requests', iRequest);
  }
  // Removes request
deleteRequest(id: string): Observable<IRequest[]> {

   return this.httpClient.delete<any>(this.api + '/requests/' + id);
  }

  // Saves request status
saveRequestStatus(iRequestStatus: IRequestStatus): Observable<IRequestStatus> {
   return this.httpClient.post<any>(this.api + '/requests/status', iRequestStatus);
  }

  // Edits request status
updateRequestStatus(iRequestStatus: IRequestStatus): Observable<IRequestStatus> {

   return this.httpClient.put<any>(this.api + '/requests/status', iRequestStatus);
  }
  // Removes request status
deleteRequestStatus(id: string): Observable<IRequestStatus> {

   return this.httpClient.delete<any>(this.api + '/requests/status' + id);
  }

}
