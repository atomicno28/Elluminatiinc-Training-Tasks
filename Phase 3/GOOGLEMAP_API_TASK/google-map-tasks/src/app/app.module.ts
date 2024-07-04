import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { GoogleMapsModule } from '@angular/google-maps';
import { AppComponent } from './app.component';
import { GooglemapComponent } from './googlemap/googlemap.component';

@NgModule({
  declarations: [AppComponent, GooglemapComponent],
  imports: [BrowserModule, GoogleMapsModule],
  providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
