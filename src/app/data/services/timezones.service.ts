import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "./config.service";
import { Observable, map } from "rxjs";
import { ITimeZones } from "../../core/models/ITimeZones";
import { IDelete } from "../../core/models/IHelpers";


@Injectable({
  providedIn: 'root'
})
export class TimeZonesService {

  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve country timezones
getCountryTimezone(countryCode: any): Observable<ITimeZones[]> {
    const body = {
      countryCode: 'US',
      standardTime: 0
    };
   return this.httpClient.post<any>(this.api + '/timezones/country', body);
  }

  // get Timezone
getimezone(id: string): Observable<ITimeZones> {

   return this.httpClient.get<any>(this.api + '/timezones' + id);
  }

  // Retrieve all timezones
getTimezones(): Observable<ITimeZones[]> {

   return this.httpClient.get<any>(this.api + '/timezones',);
  }

  // saves Timezone
saveTimezone(iTimezone: ITimeZones): Observable<ITimeZones> {

   return this.httpClient.post<any>(this.api + '/timezones', iTimezone);
  }

  // Edits Timezone
updateTimezonel(iTimezone: ITimeZones): Observable<ITimeZones> {

   return this.httpClient.put<any>(this.api + '/timezones', iTimezone);
  }

  // Removes Timezone
deleteTimezone(id: string): Observable<IDelete> {
   return this.httpClient.delete<any>(this.api + '/timezones' + id);
  }

}
