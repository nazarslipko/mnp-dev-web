import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PrayersSiderbarComponent } from './prayers-siderbar/prayers-siderbar.component';


@Component({
  selector: 'app-prayers',
  standalone: true,
  imports: [CommonModule, RouterOutlet, PrayersSiderbarComponent],
  templateUrl: './prayers.component.html',
  styleUrl: './prayers.component.css'
})
export class PrayersComponent implements OnInit {  
  ngOnInit() { }

}
