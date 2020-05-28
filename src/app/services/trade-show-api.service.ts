import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {TradeShowModel} from '../datamodels/trade-show-model';
import {environment} from '../../environments/environment';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradeShowApiService {
  constructor(private http: HttpClient) { }

  private static handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Server returned a code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  requestData(tradeShowModel: any) {
   return  this.http.post<TradeShowModel>(environment.origin + '/api/v1/trade-show/request-data', tradeShowModel)
     .pipe(tap(response => console.log('save data' + JSON.stringify(response))) , catchError(TradeShowApiService.handleError));
  }
}



