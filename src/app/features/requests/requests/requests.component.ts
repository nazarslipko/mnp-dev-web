import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RequestsSiderbarComponent } from './requests-siderbar/requests-siderbar.component';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RequestsSiderbarComponent],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  hello = "Welcome to Prayer Request Pages";

  @Input() showHideRequestSidebarMenu = true;
  ngOnInit() { }

}
