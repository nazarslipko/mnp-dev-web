import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-prayer-settings',
  standalone: true,
  imports: [],
  templateUrl: './prayer-settings.component.html',
  styleUrl: './prayer-settings.component.css'
})
export class PrayerSettingsComponent implements OnInit {
  hello = "Welcome to Prayers Settings Page!";

  constructor() { }

  ngOnInit() { }

}
