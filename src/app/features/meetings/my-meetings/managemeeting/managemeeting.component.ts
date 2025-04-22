import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { EditmeetingComponent } from "./editmeeting/editmeeting.component";
import { ContributionsComponent } from "../managemeeting/contributions/contributions.component";
import { MeetingService } from '../../../../data/services/meeting.service';
import { ProfileService } from '../../../../data/utils/profile.service';
import { HelperService } from '../../../../data/utils/helper.service';
import { ParticipantService } from '../../../../data/services/participant.service';
import { IContact } from '../../../../core/models/IHelpers';
import { IMeeting } from '../../../../core/models/IMeeting';
import { CommonModule } from '@angular/common';
import { SignupsComponent } from './signups/signups.component';
import { MeetingsettingsComponent } from './meetingsettings/meetingsettings.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-managemeeting',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive,  EditmeetingComponent, ContributionsComponent, SignupsComponent,  QuestionnaireComponent, MeetingsettingsComponent],
  templateUrl: './managemeeting.component.html',
  styleUrl: './managemeeting.component.css'
})
export class ManagemeetingComponent implements OnInit {
  activeTab = 'editmeeting';
  iContact!: IContact;
  meetingId = 0;
  iMeeting: any;

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private meetingService: MeetingService,
    private participantService: ParticipantService,
    private profileService: ProfileService,
    private helperService: HelperService

  ) {
  this.iContact= this.profileService.getProfile();
  }

  ngOnInit(): void {  
    this.activateRoute.queryParams.subscribe(params => {
      this.meetingId = params['id'];
    });
    this.loadMeeting();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    this.loadMeeting();
  }

  loadMeeting() {
     this.meetingService
       .getMeeting(this.meetingId)
       .pipe(
         switchMap((iMeeting: IMeeting) => {
           this.iMeeting = iMeeting as any;          
           return this.iMeeting;
         })
       )
       .subscribe({
         next: (iMeeting) => {
          console.log("Loaded Meeting")
         },
         error: (err: any) => {
           console.log(err);
         },
         complete: () => {},
       });
  }
}
