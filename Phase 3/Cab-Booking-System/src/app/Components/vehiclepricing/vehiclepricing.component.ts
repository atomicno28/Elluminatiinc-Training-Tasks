import { CountryService } from '../../Services/country.service';
import { Component, OnInit } from '@angular/core';
import { VehiclePricingService } from '../../Services/vehiclepricing.service';
import { VehicleService } from '../../Services/vehicles.service';

@Component({
  selector: 'app-vehiclepricing',
  templateUrl: './vehiclepricing.component.html',
  styleUrls: ['./vehiclepricing.component.css'],
})
export class VehiclepricingComponent implements OnInit {
  existingCountry = [];
  cities = [];
  vehicleType = [];
  selectedCountry: any;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  vehiclePricing = {
    country: '',
    city: '',
    type: '',
    driverProfit: '80',
    minFare: '25',
    distanceForBasePrice: '1',
    basePrice: '20',
    pricePerUnitDistance: '10',
    pricePerUnitTime: '1',
    maxSpace: '',
  };

  constructor(
    private countryService: CountryService,
    private vehiclePricingService: VehiclePricingService,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.countryService.getCountries().subscribe((countries) => {
      this.existingCountry = countries.map((country) => ({
        name: country.Name,
        _id: country._id,
      }));
    });
    this.loadVehicles();
  }

  loadVehicles() {
    this.vehicleService.getVehicles().subscribe(
      (vehicles) => {
        this.vehicleType = vehicles;
        console.log(this.vehicleType);
      },
      (err) => {
        console.error(err);
      }
    );
  }

  onCountryChange(countryId: string) {
    this.vehiclePricingService
      .getCitiesByCountryId(countryId)
      .subscribe((cities) => {
        this.cities = cities;
      });
  }

  // VehiclepricingComponent.ts
  addVehiclePricing() {
    if (Number(this.vehiclePricing.driverProfit) <= 0) {
      this.errorMessage = 'Driver Profit must be greater than 0.';
      this.successMessage = null;
      return;
    }

    if (Number(this.vehiclePricing.minFare) <= 0) {
      this.errorMessage = 'Min. Fare must be greater than 0.';
      this.successMessage = null;
      return;
    }

    if (Number(this.vehiclePricing.distanceForBasePrice) <= 0) {
      this.errorMessage = 'Distance for Base Price must be greater than 0.';
      this.successMessage = null;
      return;
    }

    if (Number(this.vehiclePricing.basePrice) <= 0) {
      this.errorMessage = 'Base Price must be greater than 0.';
      this.successMessage = null;
      return;
    }

    if (Number(this.vehiclePricing.pricePerUnitDistance) <= 0) {
      this.errorMessage = 'Price Per Unit Distance must be greater than 0.';
      this.successMessage = null;
      return;
    }

    if (Number(this.vehiclePricing.pricePerUnitTime) <= 0) {
      this.errorMessage = 'Price Per Unit Time must be greater than 0.';
      this.successMessage = null;
      return;
    }

    if (
      Number(this.vehiclePricing.maxSpace) <= 0 ||
      !Number.isInteger(Number(this.vehiclePricing.maxSpace))
    ) {
      this.errorMessage = 'Max Space must be an integer greater than 0.';
      this.successMessage = null;
      return;
    }

    this.vehiclePricingService.addVehiclePricing(this.vehiclePricing).subscribe(
      (res) => {
        this.successMessage = 'Vehicle pricing added successfully!';
        this.errorMessage = null;
        this.resetForm();
      },
      (err) => {
        this.errorMessage = err.error.message;
        this.successMessage = null;
      }
    );
  }

  resetForm() {
    this.vehiclePricing = {
      country: '',
      city: '',
      type: '',
      driverProfit: '80',
      minFare: '25',
      distanceForBasePrice: '1',
      basePrice: '20',
      pricePerUnitDistance: '10',
      pricePerUnitTime: '1',
      maxSpace: '',
    };
    this.selectedCountry = null;
  }
}
