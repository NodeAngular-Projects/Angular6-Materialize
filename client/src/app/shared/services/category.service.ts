import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Category } from '../models/Category';
import { Message } from '../models/Message';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) { }

  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/categories/${id}`);
  }

  create(name: string, image?: File): Observable<Category> {
    const formData = new FormData();

    if (image) {
      formData.append('image', image, image.name);
    }
    formData.append('name', name);

    return this.http.post<Category>('/api/categories', formData);
  }

  update(id: string, name: string, image?: File): Observable<Category> {
    const formData = new FormData();

    if (image) {
      formData.append('image', image, image.name);
    }
    formData.append('name', name);

    return this.http.patch<Category>(`/api/categories/${id}`, formData);
  }

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/categories/${id}`);
  }
}
