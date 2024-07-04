/// <reference types="@types/googlemaps" />

import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.css'],
})
export class GooglemapComponent implements AfterViewInit {
  @ViewChild('source') sourceInput!: ElementRef;
  @ViewChild('destination') destinationInput!: ElementRef;

  distance!: string;
  time!: string;

  ngAfterViewInit() {
    this.setupAutocomplete(this.sourceInput.nativeElement);
    this.setupAutocomplete(this.destinationInput.nativeElement);
  }

  setupAutocomplete(inputElement: HTMLInputElement) {
    if (typeof google !== 'undefined') {
      const autocomplete = new google.maps.places.Autocomplete(inputElement);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        // You can do further processing with the selected place if needed
      });
    }
  }

  calculateDistanceAndTime() {
    if (typeof google !== 'undefined') {
      const source = this.sourceInput.nativeElement.value;
      const destination = this.destinationInput.nativeElement.value;

      // Create a map centered at the source location
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -34.397, lng: 150.644 }, // You can update the center coordinates
      });

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      // Set the map that the directionsRenderer will use
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: source,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (
          response: google.maps.DirectionsResult,
          status: google.maps.DirectionsStatus
        ) => {
          if (status === 'OK') {
            // Set the directions response on the DirectionsRenderer
            directionsRenderer.setDirections(response);

            const leg = response.routes[0].legs[0];
            this.distance = leg.distance.text;
            this.time = leg.duration.text;
          } else {
            this.distance = 'Distance calculation error';
            this.time = 'Time calculation error';
          }
        }
      );
    }
  }
}
