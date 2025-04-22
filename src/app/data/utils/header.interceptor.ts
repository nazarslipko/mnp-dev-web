import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { error } from 'console';
import { catchError, throwError } from 'rxjs';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { ClientService } from '../services/client.service';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {

  const clientService = inject(ClientService);
  
  const apiKey = 'DVG7Q~6I_56zXM2nQBVe_8HDcq1nomU-y-SmF1';
   
  //const apiKey = sessionStorage.getItem('clientId');
  //let clientData = '';
  //if (apiKey) {
  //  clientData = JSON.parse(apiKey);
  //}


  const clonedRequest = req.clone({
    setHeaders: {
      /*  Authorization: `Bearer ${apiKey}`,*/
      'XApiKey': apiKey,
      'X-PR-Client': 'Meet-N-Pray'
    }

  });

  return next(clonedRequest);


  //const userVo = Inject(UserService);
  //const api_tokon = sessionStorage.getItem('CurrentUser');
  //let currentUserData:any;
  //if (api_tokon != null) {
  //  currentUserData = JSON.parse(api_tokon);
  //}

  //const clonedRequest = req.clone({
  //  setHeaders: {
     
  //    //Authorization: `Bearer ${api_tokon}`
  //    /*       Authorization: `Bearer ${currentUserData.token}`*/
  //    'Authorization': `Bearer ${api_tokon}`,
  //    'X-PR-Client':'Meet-N-Pray'
  //  }

  //});

  //return next(clonedRequest).pipe(
  //  catchError(
  //    (error: HttpErrorResponse) => {

  //      if (error.status === 401) {
  //        const isRefresh = confirm('Your Session is expired. Do you want to continue?');

  //        if (isRefresh) {
  //          userVo.$refreshToken.next(true);
  //        }
  //      }

  //       return throwError(error)
  //    }    

  //  )
  //);


};
