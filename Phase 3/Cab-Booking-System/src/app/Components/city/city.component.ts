import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
  OnInit,
} from '@angular/core';
import { CityService } from '../../Services/city.service';

declare var google: any;

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
})
export class CityComponent implements AfterViewInit, OnInit {
  @ViewChild('zoneInput') zoneInput: ElementRef;
  savedCountry = [];
  selectedCountry = null;
  selectedCity: string;
  FetchedCity = [];
  autocomplete: any;
  responseMessage: string;
  map: any;
  drawingManager: any;
  currentPolygon: any;
  directionsService: any;
  directionsRenderer: any;

  constructor(private ngZone: NgZone, private cityService: CityService) {}

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this.cityService.getCountries().subscribe((countries) => {
      this.savedCountry = countries.map((country) => ({
        Name: country.Name,
        CountryCode: country.CountryCode,
      }));
    });
  }

  ngAfterViewInit() {
    this.setupAutocomplete();
  }

  setupAutocomplete() {
    if (this.selectedCountry) {
      this.autocomplete = new google.maps.places.Autocomplete(
        this.zoneInput.nativeElement,
        {
          types: ['(cities)'],
          componentRestrictions: { country: this.selectedCountry.CountryCode },
        }
      );

      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          let place = this.autocomplete.getPlace();
          this.selectedCity = place.name;

          this.initMap(place.geometry.location);
          this.fetchCities();
        });
      });
    }
  }

  initMap(location) {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: location,
      zoom: 13,
    });

    this.drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        fillColor: '#808080',
        fillOpacity: 0.5,
        strokeWeight: 2,
        clickable: false,
        editable: true,
        zIndex: 1,
      },
    });

    this.drawingManager.setMap(this.map);
    this.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);

    google.maps.event.addListener(
      this.drawingManager,
      'polygoncomplete',
      (polygon) => {
        const vertices = polygon.getPath();
        let coordinates = [];
        for (let i = 0; i < vertices.getLength(); i++) {
          const xy = vertices.getAt(i);
          coordinates.push({ lat: xy.lat(), lng: xy.lng() });
        }

        this.currentPolygon = polygon;
      }
    );

    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);
  }

  onCountryChange(countryName: string) {
    this.selectedCountry = this.savedCountry.find(
      (country) => country.Name === countryName
    );
    if (!this.autocomplete) {
      this.setupAutocomplete();
    } else {
      this.autocomplete.setComponentRestrictions({
        country: this.selectedCountry.CountryCode,
      });
    }
    this.fetchCities();
    this.responseMessage = '';
  }

  fetchCities() {
    this.cityService.getCities(this.selectedCountry.Name).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.FetchedCity = response;
          console.log(this.FetchedCity);
        } else {
          console.log('No cities found for the selected country');
          this.FetchedCity = [];
        }
      },
      (error) => {
        console.error('Error getting country details', error);
        this.FetchedCity = [];
      }
    );
  }

  updateCity(cityId) {
    const vertices = this.currentPolygon.getPath();
    let coordinates = [];
    for (let i = 0; i < vertices.getLength(); i++) {
      const xy = vertices.getAt(i);
      coordinates.push({ lat: xy.lat(), lng: xy.lng() });
    }

    this.cityService
      .updateCity({
        id: cityId,
        coordinates: coordinates,
      })
      .subscribe(
        (response) => {
          this.responseMessage = 'City updated successfully';
          this.loadCountries();
          this.fetchCities();

          if (this.currentPolygon) {
            this.currentPolygon.setMap(null);
            this.currentPolygon = null;
          }

          this.drawingManager.setDrawingMode(null);
          this.drawingManager.setMap(null);
          this.drawingManager = null;

          this.setupAutocomplete();
        },
        (error) => {
          console.error('Error updating city', error);
          if (error.status === 400) {
            this.responseMessage = 'Error: ' + error.error.error;
          } else if (error.status === 403) {
            this.responseMessage = 'Error: Token not verified';
          } else {
            this.responseMessage = 'Error updating city';
          }
        }
      );
  }

  editCity(city) {
    if (this.currentPolygon) {
      this.currentPolygon.setMap(null);
      this.currentPolygon = null;
    }

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: city.coordinates[0],
      zoom: 13,
    });

    this.currentPolygon = new google.maps.Polygon({
      paths: city.coordinates,
      fillColor: '#808080',
      fillOpacity: 0.5,
      strokeWeight: 2,
      clickable: false,
      editable: true,
      zIndex: 1,
    });

    this.currentPolygon.setMap(this.map);
    this.map.setCenter(city.coordinates[0]);
  }

  addCity() {
    if (this.selectedCountry && this.currentPolygon) {
      this.cityService
        .addCity({
          country: this.selectedCountry.Name,
          city: this.selectedCity,
          coordinates: this.currentPolygon
            .getPath()
            .getArray()
            .map((coord) => ({ lat: coord.lat(), lng: coord.lng() })),
        })
        .subscribe(
          (response) => {
            this.responseMessage = 'City added successfully';
            this.loadCountries();
            this.fetchCities();

            if (this.currentPolygon) {
              this.currentPolygon.setMap(null);
              this.currentPolygon = null;
            }

            this.drawingManager.setDrawingMode(null);
            this.drawingManager.setMap(null);
            this.drawingManager = null;

            this.setupAutocomplete();
          },
          (error) => {
            console.error('Error adding city', error);
            if (error.status === 400) {
              this.responseMessage = 'Error: ' + error.error.error;
            } else if (error.status === 403) {
              this.responseMessage = 'Error: Token not verified';
            } else {
              this.responseMessage = 'Error adding city';
            }
          }
        );
    }
  }
}
