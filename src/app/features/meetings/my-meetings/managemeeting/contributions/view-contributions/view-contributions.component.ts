import { Component, Input, OnInit } from '@angular/core';
import { IContact } from '../../../../../../core/models/IHelpers';
import { IContributionParticipant } from '../../../../../../core/models/IContributionParticipant';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from '../../../../../../data/utils/profile.service';
import { HelperService } from '../../../../../../data/utils/helper.service';
import { ContributionParticipantService } from '../../../../../../data/services/contribution.participant.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-contributions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-contributions.component.html',
  styleUrl: './view-contributions.component.css',
})
export class ViewContributionsComponent implements OnInit {
  contributionForm!: FormGroup;
  iContact: IContact;
  isLoading: boolean = false;
  nodatasaved = '';
  subTitle = '';

  @Input() meetingId: any;
  @Input() meetingComponentId: any;
  @Input() meetingContributionId: any;
  @Input() modalTitle: any;

  contributionParticipants: IContributionParticipant[] = [];

  iContribution: IContributionParticipant = {
    MeetingContributionParticipantId: 0,
    UserId: 0,
    MeetingComponentId: 0,
    MeetingContributionId: 0,
    Amount: 0,
    Quantity: 0,
    Contact: [],
    Contributions: [],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private contributionParticipantService: ContributionParticipantService,
    private helperService: HelperService,
    private profileService: ProfileService
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {
    // get contribution records
    if (this.meetingComponentId > 0) {
      this.contributionParticipants = await lastValueFrom(
        this.contributionParticipantService.getContributionParticipants(
          this.meetingContributionId,
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
    const contributionList = this.contributionParticipants.map((item) => {
      return {
        Contributor: item.Contact?.[0]?.FirstName + ' ' + item.Contact?.[0]?.LastName,
        Contribution:
          item.Amount! > 0
            ? '$' + item.Amount
            : item?.Contributions?.[0]?.ItemName ?? 'None',
        Quality: item.Quantity,
        Category: item.Contributions?.[0]?.Category,
      };
    });

    try {
      this.helperService.downloadCSV(contributionList, 'contributions.csv');
    } catch (ex) {
      console.log('Could not download Contribution list. Error: ' + ex);
    }
  }
}
