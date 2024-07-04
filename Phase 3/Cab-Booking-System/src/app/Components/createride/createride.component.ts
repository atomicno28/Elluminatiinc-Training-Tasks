import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { SettingService } from '../../Services/setting.service';
import { VehicleService } from '../../Services/vehicles.service';
import { VehiclePricingService } from '../../Services/vehiclepricing.service';

declare var google: any;

@Component({
  selector: 'app-createride',
  templateUrl: './createride.component.html',
  styleUrls: ['./createride.component.css'],
})
export class CreaterideComponent implements AfterViewInit {
  isUserFound = false;
  checked = false;
  phoneNumber = '';
  paymentOption = '';
  pickupLocation = '';
  dropOffLocation = '';
  stopLocation = '';
  stops: string[] = [];
  serviceType = '';
  schedule = 'Now';
  maxStop: number;
  scheduleDateTime = '';

  distance: string = '';
  time: string = '';

  showMap = false;
  availableVehicles: any[] = [];

  @ViewChild('pickupLocationInput', { static: false })
  pickupLocationInput!: ElementRef;
  @ViewChild('dropOffLocationInput', { static: false })
  dropOffLocationInput!: ElementRef;
  @ViewChild('stopLocationInput', { static: false })
  stopLocationInput!: ElementRef;
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  map!: google.maps.Map;
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsService = new google.maps.DirectionsService();
  geocoder = new google.maps.Geocoder();

  constructor(
    private userService: UserService,
    private settingService: SettingService,
    private vehicleService: VehicleService,
    private vehiclePricingService: VehiclePricingService
  ) {}

  ngOnInit() {
    this.settingService.getAdminSettings().subscribe(
      (settings) => {
        this.maxStop = settings.stop;
        console.log(this.maxStop);
      },
      (err) => console.error('Error occurred while fetching settings', err)
    );
  }

  ngAfterViewInit() {
    this.setupAutocomplete(this.pickupLocationInput.nativeElement, 'pickup');
    this.setupAutocomplete(this.dropOffLocationInput.nativeElement, 'dropoff');
    this.setupAutocomplete(this.stopLocationInput.nativeElement, 'stop');
  }

  selectVehicle(vehicleId: string) {
    this.serviceType = vehicleId;
  }

  calculateFare(vehicle: any, d: string, t: string): number {
    const perUnitDistance = vehicle.pricePerUnitDistance;
    const perUnitTime = vehicle.pricePerUnitTime;
    const basePrice = vehicle.basePrice;

    const distance = parseFloat(d);
    const totalDuration = parseFloat(t);

    // Calculate fare based on the formula provided
    const fare =
      (distance - 1) * perUnitDistance +
      basePrice +
      (totalDuration / 3600) * perUnitTime;

    // Ensure minimum fare
    return fare;
  }
  setupAutocomplete(inputElement: HTMLInputElement, type: string) {
    if (typeof google !== 'undefined') {
      const autocomplete = new google.maps.places.Autocomplete(inputElement);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (type === 'pickup') {
          this.pickupLocation = place.formatted_address;
          this.fetchCityFromCoordinates(place.geometry.location, 'pickup');
        } else if (type === 'dropoff') {
          this.dropOffLocation = place.formatted_address;
        } else if (type === 'stop') {
          this.stopLocation = place.formatted_address;
        }
        if (this.pickupLocation && this.dropOffLocation) {
          this.showMap = true;
          this.initializeMap();
        }
      });
    }
  }

  fetchCityFromCoordinates(location: google.maps.LatLng, type: string) {
    this.geocoder.geocode({ location: location }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const city = this.extractCityName(results[0].address_components);
        console.log('City:', city);
        if (type === 'pickup') {
          this.getAvailableVehicles(city);
        }
      } else {
        console.error(
          'Reverse geocode was not successful for the following reason:',
          status
        );
      }
    });
  }

  extractCityName(
    addressComponents: google.maps.GeocoderAddressComponent[]
  ): string | null {
    for (const component of addressComponents) {
      if (
        component.types.includes('locality') ||
        component.types.includes('administrative_area_level_2')
      ) {
        return component.long_name;
      }
    }
    return null;
  }

  getAvailableVehicles(city: string) {
    this.vehiclePricingService.getAvailableVehicles(city).subscribe(
      (vehicles) => {
        this.availableVehicles = vehicles;
        console.log('Available Vehicles:', this.availableVehicles);
      },
      (err) => console.error('Error fetching available vehicles:', err)
    );
  }

  addStop() {
    if (this.stopLocation !== '') {
      if (this.stops.length < this.maxStop) {
        this.stops.push(this.stopLocation);
        this.stopLocation = '';
        this.initializeMap();
      } else {
        alert(
          `You can't add more than ${this.maxStop} stops as it is limited by the admin.`
        );
        this.stopLocation = '';
      }
    }
  }

  initializeMap() {
    if (!this.map && this.mapContainer?.nativeElement) {
      this.map = new google.maps.Map(this.mapContainer.nativeElement, {
        zoom: 7,
        center: { lat: 41.85, lng: -87.65 },
      });
      this.directionsRenderer.setMap(this.map);
    }
    this.calculateAndDisplayRoute();
  }

  calculateAndDisplayRoute() {
    if (this.pickupLocation && this.dropOffLocation) {
      const waypoints = this.stops
        .filter((stop) => stop !== '')
        .map((stop) => ({
          location: stop,
          stopover: true,
        }));

      this.directionsService.route(
        {
          origin: this.pickupLocation,
          destination: this.dropOffLocation,
          waypoints: waypoints,
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK') {
            this.directionsRenderer.setDirections(response);

            let totalDistance = 0;
            let totalDuration = 0;

            const route = response.routes[0];
            for (let i = 0; i < route.legs.length; i++) {
              totalDistance += route.legs[i].distance.value;
              totalDuration += route.legs[i].duration.value;
            }

            this.distance = (totalDistance / 1000).toFixed(2) + ' km';
            const hours = Math.floor(totalDuration / 3600);
            const minutes = Math.floor((totalDuration % 3600) / 60);
            this.time = `${hours} hr ${minutes} min`;
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        }
      );
    }
  }

  checkUser() {
    this.checked = true;
    if (!this.isPhoneNumber(this.phoneNumber)) {
      console.error('Phone number must be a number');
      return;
    }
    this.userService.getUserByPhoneNumber(this.phoneNumber).subscribe(
      (user) => {
        this.isUserFound = !!user;
      },
      (error) => {
        console.error(error);
        if (error.status === 404) {
          this.isUserFound = false;
        } else {
        }
      }
    );
  }

  isPhoneNumber(phoneNumber: string): boolean {
    return /^\d+$/.test(phoneNumber);
  }

  onSubmit() {
    if (this.validate()) {
      const rideDetails = {
        phoneNumber: this.phoneNumber,
        pickupLocation: this.pickupLocation,
        dropOffLocation: this.dropOffLocation,
        stops: this.stops,
        serviceType: this.serviceType,
        schedule: this.schedule,
        scheduleDateTime: this.scheduleDateTime,
        paymentOption: this.paymentOption,
      };
      console.log('Ride booked with details:', rideDetails);
    }
  }

  validate() {
    return true;
  }
}
