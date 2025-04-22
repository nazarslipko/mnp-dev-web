import { IConfig } from "../../core/models/IConfig";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IClient } from "../../core/models/IClient";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config = {} as IConfig;
  private clientConfig = {};

  constructor(private httpClient: HttpClient) {   
      this.config.MAP_API_ENDPOINT = 'http://65.38.96.107:5000/api' 
  
  }
  get appConfig(): IConfig {
    return this.config;
  }
   loadClient(client: string): Observable<IClient> {
   return this.httpClient.get<any>(this.config.MAP_API_ENDPOINT + '/clients/' + client);     
   
  }

  //public getRole(id: string): Observable<IRole> {
  //  const body = {
  //    roleId: id
  //  };
  //  return this.httpClient.post<any>(this.api + '/roles/role', body)
  //    .pipe(
  //      map((res) => {        
  //        const jsonData = res;
  //        const data = jsonData as IRole;
  //        return data;
  //      })
  //    );
  //}
}
