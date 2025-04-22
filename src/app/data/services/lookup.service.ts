import { HttpClient } from "@angular/common/http";
import { ConfigService } from "./config.service";
import { Observable, catchError, map } from "rxjs";
import { ILookup } from "../../core/models/ILookup";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieves all  lookups
getLookups(): Observable<ILookup[]> {
  return this.httpClient.get<any>(this.api + '/lookups');
    
  }

SaveLookup(iLookup: ILookup): Observable<ILookup[]> {
    const body = {
      LookupName: iLookup.LookupName,
      Category: iLookup.Category,
      Description: iLookup.Description,
      CreatedDate: new Date(),
      ModifiedDate: null
    }
  return this.httpClient.post<any>(this.api + '/lookups', body);
  }

  // Updates lookup
updateLookup(iLookup: ILookup): Observable<ILookup[]> {
    const body = {
      LookupId: iLookup.LookupId,
      LookupName: iLookup.LookupName,
      Category: iLookup.Category,
      Description: iLookup.Description,
      CreatedDate: iLookup.CreatedDate,
      ModifiedDate: new Date()      
    }
  return this.httpClient.put<any>(this.api + '/lookups', body);
  }

  // Deletes lookup
deleteLookup(id: string): Observable<ILookup[]> {
   return this.httpClient.delete<any>(this.api + '/lookups/' + id);
  }

  // Retrieves lookup
getLookup(id: string): Observable<ILookup> {
    const body = {
      lookupId: id
    };

   return this.httpClient.post<any>(this.api + '/lookups/lookup', body);
  }

  // Retrieves lookup by category
  getLookupByCategory(category: string): Observable<any[]> {
    const body = {
      category: category
    };
    return  this.httpClient.post<any[]>(this.api + '/lookups/category', body);
  }

}
