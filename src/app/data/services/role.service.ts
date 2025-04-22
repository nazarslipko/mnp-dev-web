import { HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from '../services/config.service';
import { IRole } from "../../core/models/IRole";
import { IDelete } from "../../core/models/IHelpers";
import { lastValueFrom, Observable, of } from 'rxjs';
import { map, catchError, } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private api: unknown = '';
  constructor(private httpClient: HttpClient, private configService: ConfigService) {
    this.api = configService.appConfig.MAP_API_ENDPOINT;
  }

  createAuthorizationHeader(headers: HttpHeaders) {
    //return headers = headers.append("Authorization", "Basic " + "pwangota:ABCD123"); //username:password enco to base64
    return headers = headers.set("Authorization", "Basic " + "pwangota:ABCD123")
  }

  //public createRole(iRole: IRole): Observable<IRole>{
  //  const body = {
  //    Name: iRole.Name,
  //    Description: iRole.Description,
  //    CreatedDate: iRole.CreatedDate,
  //    ModifiedDate: iRole.ModifiedDate
  //  }
  //  return this.httpClient.post<any>(this.api + '/roles', body).pipe(
  //    map(res => {
  //     // const jsonData = eval(res);
  //      const data = res as IRole;
  //      return data;
  //    })
  //  );
  //}

  //public updateRole(iRole: IRole): Observable<IRole> {
  //  const body = {
  //    RoleId: iRole.RoleId,
  //    Name: iRole.Name,
  //    Description: iRole.Description,
  //    CreatedDate: iRole.CreatedDate,
  //    ModifiedDate: iRole.ModifiedDate
  //  }
  //  return this.httpClient.put<any>(this.api + '/roles', body).pipe(
  //    map(res => {
  //     // const jsonData = eval(res);
  //      const data = res as IRole;
  //      return data;
  //    })
  //  );
  //}

  //public deleteRole(id: string): Observable<IDelete> {

  //  let httpHeaders = new HttpHeaders(); 
  //  /* httpHeaders = httpHeaders.append("X-Pr-Data", "ABC123")*/
  //  httpHeaders = httpHeaders.set("X-Pr-Data", "ABC123")
  //  httpHeaders =  this.createAuthorizationHeader(httpHeaders);
  //  const httpOptions = {
  //    headers: httpHeaders
  //  }    

  //  return this.httpClient.delete<any>(this.api + '/roles/' + id, httpOptions ).pipe(
  //    map(res => {
  //      //const jsonData = eval(res);
  //      const data = res as IDelete;
  //      return data;
  //    })      
  //  );
  //}

 getRoles(): Observable<any[]> {

   return  this.httpClient.get<any[]>(this.api + '/roles');
  }

createRole(iRole: IRole): Observable<any[]> {
    const body = {
      Name: iRole.Name,
      Description: iRole.Description,
      CreatedDate: new Date(),
      ModifiedDate: iRole.ModifiedDate
    }
   return this.httpClient.post<any[]>(this.api + '/roles', body);
  }

updateRole(iRole: IRole): Observable<any[]> {
    const body = {
      RoleId: iRole.RoleId,
      Name: iRole.Name,
      Description: iRole.Description,
      CreatedDate: iRole.CreatedDate,
      ModifiedDate: new Date()
    }
   return this.httpClient.put<any[]>(this.api + '/roles', body);
  }

deleteRole(id: string): Observable<any[]> {

    let httpHeaders = new HttpHeaders();
    /* httpHeaders = httpHeaders.append("X-Pr-Data", "ABC123")*/
    httpHeaders = httpHeaders.set("X-Pr-Data", "ABC123")
    httpHeaders = this.createAuthorizationHeader(httpHeaders);
    const httpOptions = {
      headers: httpHeaders
    }
   return this.httpClient.delete<any[]>(this.api + '/roles/' + id, httpOptions);
  }


getRole(id: string): Observable<any> {
    const body = {
      roleId: id
    };
   return this.httpClient.post<any>(this.api + '/roles/role', body);
  } 


  private handleError<T>(operation = 'operation', result?: T) {
    return (error?: any): Observable<T> => {
      console.error(error);
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


  private handleHttpStatusError(error: any) {
    if (error instanceof HttpErrorResponse) {
      let errorMessage = '';
      try {
        if (error.status == HttpStatusCode.BadRequest) {
          errorMessage = error.statusText;// add custom Message
        }
      } catch (err) {
        errorMessage = error.statusText;
      }
      return Error(errorMessage);
    }
    return Error(error);
  }

  private log(message: string) {
    /*  this.messageService.add(`HeroService: ${message}`);*/
    console.log(`Error: ${message}`);
  }

}
