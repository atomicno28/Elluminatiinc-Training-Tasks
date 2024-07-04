import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHttpOptions(): any {
    const token = this.authService.getTokenFromLocalStorage();
    const username = this.authService.getUsernameFromLocalStorage();

    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    headers = headers.set('auth-token', token || '');
    headers = headers.set('username', username || '');

    return { headers };
  }

  getCountries(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/getCountries`,
      this.getHttpOptions()
    );
  }

  getCities(countryName: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/getCities/${countryName}`,
      this.getHttpOptions()
    );
  }

  addCity(city: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/addCity`,
      {
        country: city.country,
        city: city.city,
        coordinates: city.coordinates, // Include the coordinates here
      },
      this.getHttpOptions()
    );
  }

  updateCity(city: any): Observable<any> {
    return this.http.put<any>(
      `${this.apiUrl}/updateCity`,
      {
        id: city.id,
        coordinates: city.coordinates, // Include the updated coordinates here
      },
      this.getHttpOptions()
    );
  }
}
