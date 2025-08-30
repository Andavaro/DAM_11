// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private base = environment.apiUrl;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.base}${path}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.base}${path}`, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.base}${path}`, body, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.base}${path}`, { headers: this.headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API error', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
