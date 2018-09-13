import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from './../models/Order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/orders', order);
  }

  fetch(params: any = {}): Observable<Order[]> {
    return this.http.get<Order[]>('/api/orders', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }
}
