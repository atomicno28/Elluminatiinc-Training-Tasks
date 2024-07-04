import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SettingService } from '../../Services/setting.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  Duration = [10, 20, 30, 45, 60, 90, 120];
  Stops = [1, 2, 3, 4, 5];
  selectedDuration: number;
  selectedStop: number;

  constructor(private settingService: SettingService) {}

  ngOnInit() {
    this.settingService.getAdminSettings().subscribe(
      (settings) => {
        this.selectedDuration = settings.duration;
        this.selectedStop = settings.stop;
      },
      (err) => console.error('Error occurred while fetching settings', err)
    );
  }

  addSetting() {
    this.settingService
      .setAdminSettings(this.selectedDuration, this.selectedStop)
      .subscribe(
        (res) => console.log('Setting added successfully'),
        (err) => console.error('Error occurred while adding setting', err)
      );
  }
}
