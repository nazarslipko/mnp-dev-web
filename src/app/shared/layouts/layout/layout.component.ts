import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LayoutFooterComponent } from '../layout-footer/layout-footer.component';
import { LayoutHeaderComponent } from '../layout-header/layout-header.component';

import { MeetingComponent } from '../../../features/meetings/meetnpray/meeting/meeting.component';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, LayoutFooterComponent, LayoutHeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  currentUser: any;
  ngOnInit() {

    this.currentUser = sessionStorage?.getItem('CurrentUser');

  }

}
