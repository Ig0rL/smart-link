import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export abstract class BaseHttpProvider {
  protected readonly httpService: HttpService;
  
  protected constructor(baseURL: string, timeout: number) {
    this.httpService = new HttpService();
    this.httpService.axiosRef.defaults.baseURL = baseURL;
    this.httpService.axiosRef.defaults.timeout = timeout;
  }
  
  get<T>(url: string): Observable<AxiosResponse<T>> {
    return this.httpService.get<T>(url);
  }
  
  post<T>(url: string, data?: any): Observable<AxiosResponse<T>> {
    return this.httpService.post<T>(url, data);
  }
}
