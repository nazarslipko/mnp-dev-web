import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IMeeting } from '../../../../core/models/IMeeting';
import { IContact } from '../../../../core/models/IHelpers';
import { NavigationExtras, Router } from '@angular/router';
import { MeetingService } from '../../../../data/services/meeting.service';
import { ParticipantService } from '../../../../data/services/participant.service';
import { ProfileService } from '../../../../data/utils/profile.service';
import { HelperService } from '../../../../data/utils/helper.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-getmyparticipations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getmyparticipations.component.html',
  styleUrl: './getmyparticipations.component.css',
})
export class GetmyparticipationsComponent implements OnInit {
  @Input() allMyMeetings: IMeeting[] = [];
  iContact!: IContact;

  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private participantService: ParticipantService,
    private profileService: ProfileService,
    private helperService: HelperService
  ) {
    this.iContact = profileService.getProfile() as IContact;
  }

  ngOnInit(): void {}

  openMeeting(meeting: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: meeting.MeetingId },
    };

    if (this.iContact.UserId) {
      this.router.navigate(['/community/meeting'], navigationExtras);
    } else { 

      const baseUrl = '/community/meeting';
      const queryParams = new URLSearchParams(
        navigationExtras.queryParams!
      ).toString();
      const fullUrl = `${baseUrl}?${queryParams}`;
      window.open(fullUrl, '_blank');
    }
  }
}
