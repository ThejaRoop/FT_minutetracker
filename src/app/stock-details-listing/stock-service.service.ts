import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';




@Injectable({ providedIn: 'root' })
export class StockService {

  private heroesUrl = 'api/heroes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

    getStockDetails(symbol, fromStamp, toStamp, resolution = 1): any {
        return new Promise((resolve, reject) => {
            return this.http.get('https://finnhub.io/api/v1/stock/candle?symbol='+symbol+'&resolution='+resolution+'&from='+fromStamp+'&to='+toStamp+'&token=c68t22qad3ibppardpig')
            .pipe(map(this.extractObserverData), catchError(this.handleError('getHeroes', [])))
            .subscribe((data) => {
                resolve(data);
              }, err => {
                reject(err);
              });
        })
     // return this.http.get('https://finnhub.io/api/v1/stock/candle?symbol='+symbol+'&resolution='+resolution+'&from='+fromStamp+'&to='+toStamp+'&token=brg4p17rh5rc8dj2rtj0').pipe(map(this.extractObserverData), catchError(this.handleError<Hero[]>('getHeroes', [])));
    }


  private extractObserverData(res: Response) {
    console.log(res);
    if (res.status < 200 || res.status >= 300) {
      throw new Error('ServiceManagementService - Response status: ' + res.status);
    }
  
    return res;
}


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption


      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  
}
