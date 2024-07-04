import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

// delcaring outside the scope for references issue...
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'google-map-task3';
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  @ViewChild('autocomplete', { static: false })
  autocompleteElement!: ElementRef;

  // Initially it is set to Pune.
  center: google.maps.LatLngLiteral = { lat: 18.51957, lng: 73.85535 };
  zoom = 5;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 5,
  };

  // It allows us to draw polygon..
  drawingManager!: google.maps.drawing.DrawingManager;
  polygon!: google.maps.Polygon;

  // Gets triggered after complete initialisation
  ngAfterViewInit() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      this.initDrawingManager();
      setTimeout(() => this.initAutocomplete(), 0);
    }
  }

  // It initialises the drawing of polygon
  initDrawingManager() {
    if (typeof google === 'object' && typeof google.maps === 'object') {
      this.drawingManager = new google.maps.drawing.DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.POLYGON,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: {
          fillColor: '#ffff00',
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          zIndex: 1,
        },
      });

      google.maps.event.addListener(
        this.drawingManager,
        'polygoncomplete',
        (polygon: google.maps.Polygon) => {
          this.polygon = polygon;
        }
      );

      this.drawingManager.setMap(this.map.googleMap!);
    }
  }

  // Google AutoComplete Feature...
  initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteElement.nativeElement
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      const latLng = new google.maps.LatLng(
        place.geometry.location.lat(),
        place.geometry.location.lng()
      );

      // Setting the value of div depends on the region.
      const messageElement = document.getElementById('message');
      if (google.maps.geometry.poly.containsLocation(latLng, this.polygon)) {
        messageElement!.innerText =
          'Yes, Your entered location belongs to drawn zone.';
        messageElement!.style.color = 'green';
      } else {
        messageElement!.innerText =
          'Sorry! Entered location doesn’t belong to drawn zone.';
        messageElement!.style.color = 'red';
      }
    });
  }
}
