import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IContact } from '../../../../../../core/models/IHelpers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from '../../../../../../data/utils/helper.service';
import { ProfileService } from '../../../../../../data/utils/profile.service';
import { lastValueFrom } from 'rxjs';
import { ISignupsParticipant } from '../../../../../../core/models/ISignupsParticipant';
import { SignupsParticipantService } from '../../../../../../data/services/signups.participant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-signups-participants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-signup-participants.component.html',
  styleUrl: './view-signup-participants.component.css',
})
export class ViewSignupParticipantsComponent implements OnInit {
  contributionForm!: FormGroup;
  iContact: IContact;
  isLoading: boolean = false;
  nodatasaved = '';
  subTitle = '';

  @Input() meetingId: any;
  @Input() meetingComponentId: any;
  @Input() meetingSignupId: any;
  @Input() modalTitle: any;

  signupsParticipant: ISignupsParticipant[] = [];
  iSignup: ISignupsParticipant = {
    MeetingSignupParticipantId: 0,
    UserId: 0,
    MeetingComponentId:0,
    MeetingSignupId: 0,
    CreatedUserId: 0,
    CreatedDate: null,
    ModifiedUserId: 0,
    ModifiedDate: null,
    Contact: [],
    Signups: [],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private signupsParticipantService: SignupsParticipantService,

    private helperService: HelperService,
    private profileService: ProfileService
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {
    // get signups records
    if (this.meetingComponentId > 0) {
      this.signupsParticipant = await lastValueFrom(
        this.signupsParticipantService.getSignupParticipants(
          this.meetingSignupId,
          this.meetingComponentId
        )
      );
    }
  }

  // send email. Temporally solution. We will use the note to tie into app's messaging.
  SendEmail(email: any, subject: any) {
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailto;
  }

  //download csv file
  onDownloadCSV() {
    const signupsList = this.signupsParticipant.map((item) => {
      return {
        Participant:
          item.Contact?.[0]?.FirstName + ' ' + item.Contact?.[0]?.LastName,
        Title: item.Signups?.[0]?.Title,
        TimeSlot:
          item.Signups?.[0]?.TimeSlot.StartTime +
          '-' +
          item.Signups?.[0]?.TimeSlot.EndTime,
      };
    });

    try {
      this.helperService.downloadCSV(signupsList, 'signups.csv');
    } catch (ex) {
      console.log('Could not download Singups list. Error: ' + ex);
    }
  }
}
