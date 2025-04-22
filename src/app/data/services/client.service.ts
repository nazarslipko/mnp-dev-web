import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { IClient } from '../../core/models/IClient';
import { Observable, map } from 'rxjs';
import { IDelete } from '../../core/models/IHelpers';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private api: unknown = '';
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.api = configService.appConfig.MAP_API_ENDPOINT;
  }

  // Retrieve all clients
  getClients(): Observable<IClient[]> {
    const body = {
      country: 'all',
    };
    return this.httpClient.post<any>(this.api + '/clients/all', body);
  }

  // Get new API Key
  getApiKeys(clientId: any, saltKey: any): Observable<any> {
    const body = {
      clientId: clientId,
      saltKey: saltKey,
      key: true,
    };
    return this.httpClient.post<any>(this.api + '/clients/securitykey', body);
  }

  // Get new data key
  getDataKey(clientId: any, saltKey: any): Observable<any> {
    const body = {
      clientId: clientId,
      saltKey: saltKey,
      key: false,
    };
    return this.httpClient.post<any>(this.api + '/clients/securitykey', body);
  }

  // Retrieve client
  getClientById(id: string): Observable<any> {
    const body = {
      clientId: id,
    };
    return this.httpClient.post<any>(this.api + '/clients/client', body);
  }

  // Retrieve client by name
  getClientByName(coutryCode: string): Observable<any> {
    const body = {
      code: coutryCode,
    };
    return this.httpClient.post<any>(this.api + '/clients/name', body);
  }

  // Saves Client
  SaveClient(iClient: IClient): Observable<any> {
    return this.httpClient.post<any>(this.api + '/clients', iClient);
  }

  // Updates Client
  updateClient(iClient: IClient): Observable<any> {
    return this.httpClient.put<any>(this.api + '/clients', iClient);
  }

  // Deletes Client
  deleteClient(id: string): Observable<any> {
    return this.httpClient.delete<any>(this.api + '/clients/' + id);
  }
}
