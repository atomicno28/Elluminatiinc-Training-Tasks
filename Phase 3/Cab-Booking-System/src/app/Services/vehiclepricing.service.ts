import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class VehiclePricingService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getHttpOptions(): any {
    const token = this.authService.getTokenFromLocalStorage();
    const username = this.authService.getUsernameFromLocalStorage();

    let headers = new HttpHeaders();
    headers = headers.set('auth-token', token || '');
    headers = headers.set('username', username || '');

    return { headers };
  }

  addVehiclePricing(vehiclePricing: any): Observable<any> {
    const vehiclePricingData = {
      country: vehiclePricing.country,
      city: vehiclePricing.city,
      type: vehiclePricing.type,
      driverProfit: vehiclePricing.driverProfit,
      minFare: vehiclePricing.minFare,
      distanceForBasePrice: vehiclePricing.distanceForBasePrice,
      basePrice: vehiclePricing.basePrice,
      pricePerUnitDistance: vehiclePricing.pricePerUnitDistance,
      pricePerUnitTime: vehiclePricing.pricePerUnitTime,
      maxSpace: vehiclePricing.maxSpace,
    };

    return this.http.post<any>(
      `${this.apiUrl}/vehiclePricing`,
      vehiclePricingData,
      this.getHttpOptions()
    );
  }

  getCitiesByCountryId(countryId: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/cities/${countryId}`,
      this.getHttpOptions()
    );
  }
  getAvailableVehicles(location: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/vehicle-availability/${location}`,
      this.getHttpOptions()
    );
  }
}
