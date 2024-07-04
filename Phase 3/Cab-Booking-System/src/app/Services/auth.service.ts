import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'http://localhost:3000/user'; // replace with your backend URL
  private username = new BehaviorSubject<string>(
    this.getUsernameFromLocalStorage()
  );

  public userLoggedOut = new EventEmitter<void>();

  private token = new BehaviorSubject<string>(this.getTokenFromLocalStorage());

  constructor(private http: HttpClient) {}

  getHttpOptions(): any {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.set('auth-token', token || '');
    headers = headers.set('username', username || '');

    return { headers };
  }

  getUsernameFromLocalStorage(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('username') || '';
    }
    return '';
  }

  setUsername(name: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('username', name);
    }
    this.username.next(name);
  }

  getUsername(): Observable<string> {
    return this.username.asObservable();
  }

  getTokenFromLocalStorage(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  setToken(token: string) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('token', token);
    }
    this.token.next(token);
  }

  getToken(): Observable<string> {
    return this.token.asObservable();
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { username, password });
  }
}
