import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { MeetingService } from '../../../../data/services/meeting.service';
import { ParticipantService } from '../../../../data/services/participant.service';
import { ProfileService } from '../../../../data/utils/profile.service';
import { HelperService } from '../../../../data/utils/helper.service';
import { IContact } from '../../../../core/models/IHelpers';
import { IMeeting } from '../../../../core/models/IMeeting';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-getmymeetings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getmymeetings.component.html',
  styleUrl: './getmymeetings.component.css'
})
export class GetmymeetingsComponent implements OnInit {

  @Input()allMyMeetings: IMeeting[]= [];
  iContact!: IContact;


  constructor(private router: Router, private meetingService: MeetingService,
    private participantService: ParticipantService,
    private profileService: ProfileService,
    private helperService: HelperService
  ) {
    this.iContact = profileService.getProfile() as IContact;
  }

  ngOnInit(): void { 
 
  } 
  
  openMeeting(meetingId?: number, userId?: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: meetingId }
    };
    this.router.navigateByUrl('/community', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/managemeeting'],navigationExtras)
    );
  }
}
