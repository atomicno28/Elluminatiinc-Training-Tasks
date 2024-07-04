import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private url = 'http://localhost:3000/user'; // replace with your actual API URL

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHttpOptions(): any {
    const token = this.authService.getTokenFromLocalStorage();
    const username = this.authService.getUsernameFromLocalStorage();

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.set('auth-token', token || '');
    headers = headers.set('username', username || '');

    return { headers };
  }
  setAdminSettings(duration: number, stops: number): Observable<any> {
    return this.http.put(
      `${this.url}/setsettings`,
      { duration, stops },
      this.getHttpOptions()
    );
  }

  getAdminSettings(): Observable<any> {
    return this.http.get(`${this.url}/getsettings`, this.getHttpOptions());
  }
}
