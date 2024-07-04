// app-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryComponent } from './Components/country/country.component';
import { CityComponent } from './Components/city/city.component';
import { VehicletypeComponent } from './Components/vehicletype/vehicletype.component';
import { VehiclepricingComponent } from './Components/vehiclepricing/vehiclepricing.component';
import { SettingsComponent } from './Components/settings/settings.component';
import { UserComponent } from './Components/user/user.component';
import { DriverComponent } from './Components/driverlist/driverlist.component';
import { HomeComponent } from './Components/home/home.component';
import { CreaterideComponent } from './Components/createride/createride.component';

const routes: Routes = [
  { path: 'country', component: CountryComponent },
  { path: 'city', component: CityComponent },
  { path: 'vehicle-type', component: VehicletypeComponent },
  { path: 'vehicle-pricing', component: VehiclepricingComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'user', component: UserComponent },
  { path: 'driver-list', component: DriverComponent },
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'create-ride', component: CreaterideComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
