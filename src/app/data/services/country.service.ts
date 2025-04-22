import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Observable, map } from "rxjs";
import { ICountry } from "../../core/models/ICountry";
import { IDelete } from "../../core/models/IHelpers"


@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve all countries
getCountries(): Observable<ICountry[]> {
    const body = {
      country: 'all'
    };
  return this.httpClient.post<any>(this.api + '/countries/all', body);
  }

  // Retrieve Country By Id
getCountryById(id: string): Observable<ICountry> {
    const body = {
      countryId: id
    };
  return this.httpClient.post<any>(this.api + '/countries/country', body);
  }
  // Retrieve country by Code
getCountryByCode(coutryCode: string): Observable<ICountry> {
    const body = {
      code: coutryCode
    }; 
    
  return this.httpClient.post<any>(this.api + '/countries/code', body)
    ;
  }

  // Saves Country
SaveCountry(iCountry: ICountry): Observable<ICountry[]> {
    const body = {
      Name: iCountry.Name,
      TwoCode: iCountry.TwoCode,
      ThreeCode: iCountry.ThreeCode,
      NumberCode: iCountry.NumberCode,
      CreatedDate: new Date()
    }
  return this.httpClient.post<any>(this.api + '/countries', body);
  }

  // Updates Country
updateCountry(iCountry: ICountry): Observable<ICountry[]> {
    const body = {
      CountryId: iCountry.CountryId,
      Name: iCountry.Name,
      TwoCode: iCountry.TwoCode,
      ThreeCode: iCountry.ThreeCode,
      NumberCode: iCountry.NumberCode
    }
   return this.httpClient.put<any>(this.api + '/countries', body);
  }

  // Deletes Country
deleteLookup(id: string): Observable<IDelete> {
   return this.httpClient.delete<any>(this.api + '/countries/' + id);
  }

}
