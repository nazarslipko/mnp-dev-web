import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MeetingService } from '../../../data/services/meeting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipantService } from '../../../data/services/participant.service';
import { ProfileService } from '../../../data/utils/profile.service';
import { HelperService } from '../../../data/utils/helper.service';
import { IContact } from '../../../core/models/IHelpers';
import { IMeeting } from '../../../core/models/IMeeting';
import { CommonModule } from '@angular/common';
import { GetmymeetingsComponent } from './getmymeetings/getmymeetings.component';
import { GetmyparticipationsComponent } from './getmyparticipations/getmyparticipations.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-my-meetings',
  standalone: true,
  imports: [CommonModule, GetmymeetingsComponent, GetmyparticipationsComponent],
  templateUrl: './my-meetings.component.html',
  styleUrl: './my-meetings.component.css',
})
export class MyMeetingsComponent implements OnInit, OnChanges {
  activeTab: string = 'meetings';
  iContact!: IContact;
  myMeetings: IMeeting[] = [];

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private meetingService: MeetingService,
    private participantService: ParticipantService,
    private profileService: ProfileService,
    private helperService: HelperService
  ) {
    this.iContact = profileService.getProfile() as IContact;
  }

  ngOnInit() {
    this.loadMyMeetings();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setActiveTab(this.activeTab);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (this.activeTab === 'participations') {     
      this.loadMyParticipations();
    } else {
      this.loadMyMeetings();
    }
  }

  async loadMyMeetings() {
    this.meetingService.getUserMeeting(this.iContact.UserId)
      .pipe(
        switchMap(
          (meetings: IMeeting[]) => {
          this.myMeetings = meetings;
          return this.myMeetings;
        })
      ).subscribe({
        next: (meetings)=>console.log("Retrieved meeting by user"),       
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {},
      });
  }

  async loadMyParticipations() {
    this.meetingService
      .getUserMeetingMembers(this.iContact.UserId)
      .pipe(
        switchMap((meetings: IMeeting[]) => {
          this.myMeetings = meetings;
       
          return this.myMeetings;
        })
      )
      .subscribe({
        next: (meetings) => {
        console.log("Get user meeting participations");
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {},
      });
  }
}
