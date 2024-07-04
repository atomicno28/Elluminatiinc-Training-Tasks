import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { VehicletypeComponent } from './Components/vehicletype/vehicletype.component';
import { CountryComponent } from './Components/country/country.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CityComponent } from './Components/city/city.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { VehiclepricingComponent } from './Components/vehiclepricing/vehiclepricing.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { UserComponent } from './Components/user/user.component';
import { DriverComponent } from './Components/driverlist/driverlist.component';
import { HomeComponent } from './Components/home/home.component';
import { FilterPipe } from './filter.pipe';
import { CreaterideComponent } from './Components/createride/createride.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    VehicletypeComponent,
    CountryComponent,
    CityComponent,
    VehiclepricingComponent,
    SettingsComponent,
    UserComponent,
    DriverComponent,
    HomeComponent,
    FilterPipe,
    CreaterideComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
