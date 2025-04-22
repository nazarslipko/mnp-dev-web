import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Observable, map } from "rxjs";
import { IScroll } from "../../core/models/IScroll";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class ScrollService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = this.configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve user's scroll
getScroll(id: string): Observable<IScroll> {
    const body = {
      scrollId: id
    };
   return this.httpClient.post<any>(this.api + '/thescroll/story', body);
  }

  // Retrieves user's storys posted on the scroll
getUserScroll(userId: string, categoryLookupId: any): Observable<IScroll[]> {
    const body = {
      userId: userId,
      categoryLookupId: categoryLookupId
    };
   return this.httpClient.post<any>(this.api + '/thescroll/user', body)     ;
  }

  // Retrieves all stories posted the scroll
getTheScroll(affiliationLookupId: number, categoryLookupId: number, pageNumber: number, pageSize: number,ascDesc:number, searchValue: string): Observable<IScroll[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      categoryLookupId: categoryLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      ascDesc: ascDesc,
      searchValue: searchValue
    };
   return this.httpClient.post<any>(this.api + '/thescroll/all', body) ;
  }

  // Retrieves all stories posted the scroll by affiliation
getScrollByAffiliation(affiliationLookupId: number, pageNumber: number, pageSize: number, date: string, searchValue: string): Observable<IScroll[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      date: date,
      searchValue: searchValue
    };
   return this.httpClient.post<any>(this.api + '/thescroll/affiliation', body);
  }

  // Retrieves all stories posted the scroll by category
getScrollByCategory(categoryLookupId: number, pageNumber: number, pageSize: number, date: string, searchValue: string): Observable<IScroll[]> {
    const body = {
      categoryLookupId: categoryLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      date: date,
      searchValue: searchValue
    };
   return this.httpClient.post<any>(this.api + '/thescroll/category', body);
  }

  // Retrieves all inappropriate stories posted the scroll
getInappropriateScroll(inappropriate: any): Observable<IScroll[]> {
    const body = {
      inappropriate: inappropriate
    };
   return this.httpClient.post<any>(this.api + '/thescroll/inappropriate', body)
     ;
  }

  // Flags story posted on the scroll
flagScroll(iScroll: IScroll): Observable<IScroll[]> {

   return this.httpClient.post<any>(this.api + '/thescroll/flag', iScroll);
  }

  // Posts story on the scroll
createScroll(iScroll: IScroll): Observable<IScroll[]> {

   return this.httpClient.post<any>(this.api + '/thescroll', iScroll);
  }

  // Edits story on the scroll
updateScroll(iScroll: IScroll): Observable<IScroll[]> {

   return this.httpClient.put<any>(this.api + '/thescroll', iScroll);
  }
  // Removes story on the scroll
deleteScroll(id: string): Observable<IScroll[]> {

   return this.httpClient.delete<any>(this.api + '/thescroll/' + id);
  }

}
