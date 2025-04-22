import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  hello = "Welcome to Prayer Requests Setting  page!";
  ngOnInit() { }

}
