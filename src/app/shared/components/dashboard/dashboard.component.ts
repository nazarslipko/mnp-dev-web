import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';


import { NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet,  NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  hello = 'Welcome to dashboards!!'
  loggedIn = false;
  showHidePrayerSidebarMenu = false;
  showHideMeetingSidebarMenu = false;
  showHideRequestSidebarMenu = false;

  prayerSidebarMenu = [
   // { label: 'Home', link: '/prayers', icon: 'house-chimney' },
    { label: 'Prayers', link: '/prayers', icon: 'person-praying' },
    { label: 'Devotions', link: '/prayers', icon: 'list' },
    { label: 'Praises', link: '/prayers', icon: 'quote-left' }
   // { label: 'Settings', link: '/settings', icon: 'gears' }
  ];
  meetingSidebarMenu = [
   // { label: 'Home', link: '/prayers', icon: 'house-chimney' },
    { label: 'Meetings', link: '/meetings', icon: 'users' }
    //{ label: 'Devotions', link: '/prayers', icon: 'list' },
    //{ label: 'Praises', link: '/prayers', icon: 'quote-left' },
    //{ label: 'Settings', link: '/settings', icon: 'gears' }
  ];
  requestSidebarMenu = [

   // { label: 'Home', link: '/prayers', icon: 'house-chimney' },
    { label: 'Requests', link: '/requests', icon: 'person-praying' },
    { label: 'Answered', link: '/claimed', icon: 'hand' },
    { label: 'Request Prayer', link: '/prayers', icon: 'file-lines' }
    //{ label: 'Settings', link: '/settings', icon: 'gears' }
  ];

  ngOnInit() {
    this.showHidePrayerSidebarMenu = true;

  }

}
