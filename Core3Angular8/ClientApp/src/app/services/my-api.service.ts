import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpModels } from '../models/http.models';

@Injectable({
  providedIn: 'root'
})
export class MyApiService {

  //*********NB:Faire attention avec l'URL mettre HTTPS au lieu de HTTP*************

  constructor(private http: HttpClient) {

  }

  public postWithObjectReturn<T> (url: string, body, options?: HttpModels.OptionOverrides): Observable<T>{
   return this.http.post<T>(url, body, new HttpModels.GetJsonOptions(null, options));
  }

  public postWithTextReturn(url: string, body: any): Observable<any> {
    return this.http.post(url, body, { responseType: 'text' });
  }

  public getData(url: string, options?: HttpModels.OptionOverrides): Observable<any> {
    return this.http.get(url, new HttpModels.GetJsonOptions(null, options));
  }

  public putData(url: string, body: any, options?: HttpModels.OptionOverrides): Observable<any> {
    return this.http.put(url, body, new HttpModels.GetJsonOptions(null, options));
  }

}
