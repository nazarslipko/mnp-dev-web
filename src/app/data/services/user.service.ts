import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { IUser } from '../../core/models/IUser';
import { Observable, Subject, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { IContact } from '../../core/models/IHelpers';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  $refreshToken = new Subject<boolean>();
  private api: unknown = '';
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.api = configService.appConfig.MAP_API_ENDPOINT;
    this.$refreshToken.subscribe((req: any) => {
      this.getRefreshedToken();
    });
  }

  async getRefreshedToken() {
    const api_tokon = sessionStorage.getItem('CurrentUser');

    let currentUserData: any;
    if (api_tokon != null) {
      currentUserData = JSON.parse(api_tokon);
    }

    const body = {
      email: currentUserData.email,
      refreshToken: currentUserData.refreshToken,
    };
    return this.httpClient.post<any>(this.api + '/users/refresh', body);
  }
  // Retrieves all users
  getUsers(
    affiliationLookupId: number,
    userTypeLookupId: number,
    pageNumber: number,
    pageSize: number,
    searchValue: number,
    active: boolean,
    blocked: boolean
  ): Observable<IUser[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      userTypeLookupId: userTypeLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchValue: searchValue,
      active: active,
      blocked: blocked,
    };
    return this.httpClient.post<any>(this.api + '/users/all', body);
  }

  // Saves User
  saveUser(iUser: IUser): Observable<IContact> {
    return this.httpClient.post<any>(this.api + '/users', iUser);
  }

  // Updates User
  updateUser(iUser: IUser): Observable<IUser> {
    return this.httpClient.put<any>(this.api + '/users', iUser);
  }

  // Flags user
  flagUser(iUser: IUser): Observable<IUser> {
    return this.httpClient.post<any>(this.api + '/users/flag', iUser);
  }

  // Deletes User
  deleteUser(id: string): Observable<IUser> {
    return this.httpClient.delete<any>(this.api + '/users/' + id);
  }

  // Retrieves User
  getUser(id: string): Observable<IUser> {
    const body = {
      userId: id,
    };
    return this.httpClient.post<any>(this.api + '/users/user', body);
  }

  // Retrieves Users by category
  getusersByCategory(
    userTypeLookupId: number,
    pageNumber: number,
    pageSize: number
  ): Observable<IUser[]> {
    const body = {
      userTypeLookupId: userTypeLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return this.httpClient.post<any>(this.api + '/users/category', body);
  }

  // Retrieves users by affiliation
  getUserByAffiliation(
    affiliationLookupId: number,
    pageNumber: number,
    pageSize: number
  ): Observable<IUser[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    return this.httpClient.post<any>(this.api + '/users/affiliation', body);
  }

  // Retrieves Intercessors
  getIntercessors(
    affiliationLookupId: number,
    pageNumber: number,
    pageSize: number,
    searchValue: string
  ): Observable<IUser[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchValue: searchValue,
    };
    return this.httpClient.post<any>(this.api + '/users/intercessor', body);
  }

  // Retrieves Moderators
  getModerators(
    affiliationLookupId: number,
    pageNumber: number,
    pageSize: number,
    searchValue: string
  ): Observable<IUser[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      searchValue: searchValue,
    };
    return this.httpClient.post<any>(this.api + '/users/moderator', body);
  }

  // Retrieves active Users
  getActiveUsers(
    affiliationLookupId: number,
    pageNumber: number,
    pageSize: number,
    active: string
  ): Observable<IUser[]> {
    const body = {
      affiliationLookupId: affiliationLookupId,
      pageNumber: pageNumber,
      pageSize: pageSize,
      active: active,
    };
    return this.httpClient.post<any>(this.api + '/users/active', body);
  }

  // Logins User
  loginUser(iUser: IUser): Observable<IContact> {
    const body = {
      userName: iUser.Email,
      password: iUser.Password,
    };
    return this.httpClient.post<any>(this.api + '/users/login', body);
  }

  //encryptDecrypt(data: string) {
  //  // nodejs library
  //  const crypto = require('crypto');

  //  if (data === 'encrypt') {
  //    const myKey = crypto.createCipher('aes-128-cbc', 'mypassword');
  //    let info = myKey.update(data, 'utf8', 'hex');
  //    return info += myKey.final('hex');
  //  } else {

  //    const myKey = crypto.createCipher('aes-128-cbc', 'mypassword');
  //    let info = myKey.update(data, 'hex', 'utf8');
  //    return info += myKey.final('utf8');
  //  }

  //  //HMAC
  //  const dataKey = 'ABC-1234-^';
  //  const hash = crypto.createHmac('sha256', dataKey).update(data).digest('hex');
  //}
}
