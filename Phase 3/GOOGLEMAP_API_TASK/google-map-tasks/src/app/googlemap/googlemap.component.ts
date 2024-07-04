import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.css'],
})
export class GooglemapComponent implements OnInit {
  @ViewChild('mapContainer') mapContainer: ElementRef;
  @ViewChild('addressDisplay') addressDisplay: ElementRef;

  map: google.maps.Map;
  marker: google.maps.Marker;
  autocomplete: google.maps.places.Autocomplete;

  center: google.maps.LatLngLiteral = { lat: 24, lng: 12 };
  zoom = 15; // Increase the zoom for a more detailed view

  ngOnInit(): void {
    this.initializeMap();
    this.initAutocomplete();
  }

  initializeMap() {
    this.getCurrentLocation(this.zoom);
  }

  getCurrentLocation(zoomLevel: number) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.centerMap(
            position.coords.latitude,
            position.coords.longitude,
            zoomLevel
          );
        },
        (error) => {
          console.error('Error getting current location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }

  centerMap(lat: number, lng: number, zoomLevel: number) {
    this.center = { lat, lng };
    this.zoom = zoomLevel;

    this.initializeGoogleMap();
  }

  initializeGoogleMap() {
    this.map = new google.maps.Map(this.mapContainer.nativeElement, {
      center: this.center,
      zoom: this.zoom,
    });

    this.marker = new google.maps.Marker({
      position: this.center,
      map: this.map,
      draggable: true, // Allow marker to be dragged
    });

    google.maps.event.addListener(this.marker, 'dragend', () => {
      this.updateMarkerPosition();
    });
  }

  updateMarkerPosition() {
    const newPosition = this.marker.getPosition() as google.maps.LatLng;
    this.center = {
      lat: newPosition.lat(),
      lng: newPosition.lng(),
    };
    // Reverse geocode to get formatted address
    this.reverseGeocode();
  }

  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete-input') as HTMLInputElement
    );

    // Attach the Autocomplete widget to the input field
    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();

      if (!place.geometry) {
        console.error('Place not found:', place);
        return;
      }

      this.center = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      this.marker.setPosition(this.center);
      this.map.setCenter(this.center);

      // Display formatted address
      this.displayFormattedAddress(place.formatted_address);
    });
  }

  displayFormattedAddress(address: string) {
    // Update the paragraph element with the formatted address
    this.addressDisplay.nativeElement.innerText = address;
  }

  reverseGeocode() {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: this.center }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const formattedAddress = results[0].formatted_address;
        this.displayFormattedAddress(formattedAddress);
      } else {
        console.error('Geocoder failed due to:', status);
      }
    });
  }
}
