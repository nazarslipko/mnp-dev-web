import { CommonModule, NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { IMeeting } from '../../../../core/models/IMeeting';
import { MeetingService } from '../../../../data/services/meeting.service';
import { ParticipantService } from '../../../../data/services/participant.service';
import { ProfileService } from '../../../../data/utils/profile.service';
import { HelperService } from '../../../../data/utils/helper.service';
import { IContact } from '../../../../core/models/IHelpers';

@Component({
  selector: 'app-meetings-siderbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './meetings-siderbar.component.html',
  styleUrl: './meetings-siderbar.component.css'
})
export class MeetingsSiderbarComponent implements OnInit {

  iContact!: IContact;
  @Input() sidebarMenuItems?: any[];


  constructor(private router: Router
  ) {
  }

  ngOnInit() { }

  navigateToHome() {
    // this.router.navigate(['/prayers/letuspray', 'god']);
    //const navigationExtras: NavigationExtras = {
    //  queryParams: { id: 0 }
    //};
    //this.router.navigate(['prayers/letuspray'], navigationExtras);
    this.router.navigateByUrl('/requests', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/prayers/letuspray', 'god'])
    );
  }

  goToMyMeetings() {
    this.router.navigate(['/community/mymeetings'], { queryParams: { tab: 'meetings' } });
  }
}
