import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { IMeeting } from '../../../core/models/IMeeting';
import { MeetingService } from '../../../data/services/meeting.service';
import { IContact, IReaction } from '../../../core/models/IHelpers';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  NgbModal,
  NgbModalOptions,
  NgbPopover,
} from '@ng-bootstrap/ng-bootstrap';
import { INotes } from '../../../core/models/INotes';
import { ReactionService } from '../../../data/services/reaction.service';
import { ProfileService } from '../../../data/utils/profile.service';
import { IParticipant } from '../../../core/models/IParticipant';
import { ParticipantService } from '../../../data/services/participant.service';
import { HelperService } from '../../../data/utils/helper.service';
import { NoteService } from '../../../data/services/note.service';
import { state } from '@angular/animations';
import { lastValueFrom, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-meetnpray',
  standalone: true,
  imports: [
    CommonModule,
    NgbPopover,
    InfiniteScrollModule,
    ReactiveFormsModule,
  ],
  templateUrl: './meetnpray.component.html',
  styleUrl: './meetnpray.component.css',
})
export class MeetnprayComponent implements OnInit {
  iContact!: IContact;
  noteForm!: FormGroup;
  submitted = false;

  iMeetings: any;
  meetnPray: any[] = [];
  iReaction: IReaction = {
    ReactionId: 0,
    AffiliationLookupId: 0,
    MeetingId: 0,
    UserId: 0,
    RequestId: 0,
    ScrollId: 0,
    Loves: 0,
    Likes: 0,
    Downloads: 0,
    Listened: 0,
    Shared: 0,
    Star: 0,
    Inappropriate: 0,
    Prayed: 0,
  };

  iMeeting: IMeeting = {
    MeetingId: 0,
    AffiliationLookupId: 0,
    UserId: 0,
    Title: '',
    Story: '',
    Location: {
      Street1: '',
      Street2: '',
      City: '',
      StateProvince: '',
      Country: '',
      Zipcode: '',
    },
    Tags: '',
    StartTime: '',
    EndTime: '',
    StartDate: '',
    EndDate: '',
    Banner: '',
    Confidential: {
      IsPublic: true,
      IsOnline: false,
      Hybrid: false,
      InPerson: false,
    },
    Recurrence: { Recurring: '', RecurringEndDate: '' },
    Reminders: { Days: '', Hours: '' },
    Restriction: '',
    TimeZone: '',
    Inappropriate: false,
    CreatedDate: '',
    ModifiedDate: '',
  };
  //pagination properties
  isLoading: boolean = false;
  prayerOnCall: boolean = false;
  sortScrollByAscDesc = 0;
  affiliationLookupId!: number;
  serviceTypeLookupId?: any = 0;
  pageNumber!: number;
  pageSize!: number;
  searchValue!: string;
  errors: any;
  confidential = 2;
  confirmParticipant = '';

  toggleLoading = () => (this.isLoading = !this.isLoading);

  iParticipant: IParticipant = {
    ParticipantId: 0,
    AffiliationLookupId: 0,
    UserId: 0,
    MeetingId: 0,
    RequestId: 0,
    RoomId: 0,
    Invited: false,
    Accepted: false,
    Declined: false,
    Attended: false,
    Revoked: false,
    Login: '',
    Passcode: '',
    CreatedDate: null,
    ModifiedDate: null,
  };

  iNote: INotes = {
    Note: '',
    RequestId: 0,
    MeetingId: 0,
    UserId: 0,
    RespondUserId: 0,
    Visible: false,
  };

  constructor(
    private router: Router,
    private meetingService: MeetingService,
    private reactionService: ReactionService,
    private modal: NgbModal,
    private noteService: NoteService,
    private participantService: ParticipantService,
    private profileService: ProfileService,
    private helperService: HelperService,
    private formBuilder: NonNullableFormBuilder
  ) {
    this.iContact = profileService.getProfile() as IContact;
  }

  ngOnInit() {
    this.getMeetnPray();
  }

  // initialize meet-n-pray
  async getMeetnPray() {
    this.toggleLoading();
    this.affiliationLookupId = 0;
    this.pageNumber = 1;
    this.pageSize = 2;
    this.searchValue = 'All';
    await this.getMeetnPrayData(
      this.affiliationLookupId,
      this.pageNumber,
      this.pageSize,
      this.sortScrollByAscDesc,
      this.searchValue
    );
  }

  // Retrieve all meet-n-pray
  getMeetnPrayData(
    affiliationLookupId: number,
    pageNumber: number,
    pageSize: number,
    sortAscDesc: number,
    searchValue: string
  ) {
    this.meetingService
      .getMeetings(
        affiliationLookupId,
        pageNumber,
        pageSize,
        sortAscDesc,
        searchValue
      )
      .pipe(
        switchMap((meetings: IMeeting[]) => {
          this.meetnPray = meetings;
          return this.meetnPray;
        })
      )
      .subscribe({
        next: (meetings: IMeeting[]) => {
          console.log('Retrieved meeting');
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          this.toggleLoading();
        },
      });
  }

  // instatiate ngx-infinite-scroll  with data
  onScroll() {
    this.loadMeetnPray();
  }
  // loads paginated data and appends to existing
  loadMeetnPray() {
    this.toggleLoading();
    this.affiliationLookupId = 0;
    this.pageNumber++;
    this.pageSize = 2;
    this.searchValue = 'All';

    this.meetingService
      .getMeetings(
        this.affiliationLookupId,
        this.pageNumber,
        this.pageSize,
        this.sortScrollByAscDesc,
        this.searchValue
      )
      .pipe(
        switchMap((meetings: IMeeting[]) => {
          this.meetnPray = [...this.meetnPray, ...meetings];
          return this.meetnPray;
        })
      )
      .subscribe({
        next: (meetings: IMeeting[]) => {
          console.log('Successfully retrieved meetings');
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          this.toggleLoading();
        },
      });
  }

  // filters scroll in ascending and descending order
  filterRequest(sort: any) {
    this.sortScrollByAscDesc = sort;
    this.getMeetnPray();
  }

   requestStatus(request: any, reaction: any) {
    if (!request) {
      // display modal nothing saved
      //const options: NgbModalOptions = { size: 'lg', backdrop: 'static', keyboard: true, centered: true };
      //this.modal.open(availabilityModal, options);
    } else {
      /*
          let data = this.iRequestStatus;
          data.RequestId = request.RequestId;
          data.UserId = this.iContact.UserId;
          data.Prayed = reaction == 'prayed' ? 1 : 0;
          data.InProgress = reaction == 'progress' ? 1 : 0;
          data.TakeRelease = 1;
          // save request status  
           this.requestService.saveRequestStatus(data).pipe(switchMap()).subscribe({
            next: (iRequestStatus: IRequestStatus) => {
              this.iRequestStatus = iRequestStatus;
            },
            error: (err: any) => {
              this.errors = err.error.Message;
            },
            complete: () => {
              this.loadRequests();
            }
          });
          */
    }
  }

  moreInformation(meeting: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: { id: meeting.MeetingId },
    };

    if (this.iContact.UserId) {    
      this.router.navigate(['/community/meeting'], navigationExtras);
    } else {
      // window.open('meeting?id=' + meeting.MeetingId, '_blank');

      const baseUrl = '/community/meeting';
      const queryParams = new URLSearchParams(
        navigationExtras.queryParams!
      ).toString();
      const fullUrl = `${baseUrl}?${queryParams}`;
      window.open(fullUrl, '_blank');
    }
  }

  // save user reactions
   reactions(meeting: any, reaction: any) {
    const data: IReaction = {
      AffiliationLookupId: this.iContact.AffiliationLookupId,
      UserId: this.iContact.UserId,
      RequestId: 0,
      ScrollId: 0,
      ReactionId: 0,
      MeetingId: meeting.MeetingId,
      Likes: reaction == 'liked' ? 1 : 0,
      Loves: reaction == 'loved' ? 1 : 0,
      Shared: reaction == 'shared' ? 1 : 0,
      Downloads: reaction == 'downloaded' ? 1 : 0,
      Inappropriate: reaction == 'inappropriate' ? 1 : 0,
      Listened: reaction == 'listened' ? 1 : 0,
      Star: reaction == 'favorite' ? 1 : 0,
      Prayed: reaction == 'prayed' ? 1 : 0,
    };

    // save reaction
    this.reactionService
      .SaveReaction(data)
      .pipe(
        switchMap((iReaction: IReaction) => {
          this.iReaction = iReaction;
          return of(this.iReaction);
        })
      )
      .subscribe({
        next: (iReaction: IReaction) => {
          console.log('Saved Reaction');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
        },
        complete: () => {
          // flag meeting
          this.flagMeeting(meeting);
        },
      });
  }

  // flags meet-n-pray. ToDO make inappeopriate json and add reason

  async flagMeeting(meeting: any) {
    if (meeting) {
      this.iMeeting.MeetingId = meeting.MeetingId;
      this.iMeeting.Inappropriate = true;
      this.iMeeting.UserId = this.iContact.UserId;
      this.iMeeting.AffiliationLookupId = this.iContact.AffiliationLookupId;
      this.iMeeting.Tags =
        meeting.Tags.length > 0 ? meeting.Tags.split('|') : [];
      this.iMeeting.Title = meeting.Title;
      this.iMeeting.Story = meeting.Story;
      this.iMeeting.StartDate = meeting.StartDate;
      this.iMeeting.EndDate = meeting.EndDate;
      this.iMeeting.StartTime = meeting.StartTime;
      this.iMeeting.EndTime = meeting.EndTime;
      this.iMeeting.Restriction = meeting.Restriction;
      this.iMeeting.TimeZone = meeting.TimeZone;
      this.iMeeting.Banner = meeting.Banner;

      this.iMeeting.Location = {
        Street1: meeting.Street1,
        Street2: meeting.Street2,
        City: meeting.City,
        StateProvince: meeting.StateProvince,
        Country: meeting.Country,
        Zipcode: meeting.Zipcode,
      };
      if (meeting?.Recurrence) {
        const recurrence = JSON.parse(meeting?.Recurrence);
        this.iMeeting.Recurrence = {
          RecurringEndDate: recurrence.RecurringEndDate,
          Recurring: recurrence.Recurring,
        };
      }
      if (meeting?.Reminders) {
        const reminders = JSON.parse(meeting?.Reminders);
        this.iMeeting.Reminders = {
          Days: reminders.Days,
          Hours: reminders.Hours,
        };
      }
      if (meeting?.Confidential) {
        const confidential = JSON.parse(meeting?.Confidential);
        this.iMeeting.Confidential = {
          InPerson: confidential.InPerson,
          IsOnline: confidential.IsOnline,
          IsPublic: confidential.IsPublic,
          Hybrid: confidential.Hybrid,
        };
      }
    }
    const meetings = await lastValueFrom(
      this.meetingService.flagMeeting(this.iMeeting)
    );
   // const data = await meetings.subscribe({});
  }

  composeNote(request: any, noteModal: any) {
    this.submitted = false;
    if (request) {
      const options: NgbModalOptions = {
        size: 'lg',
        keyboard: true,
        backdrop: 'static',
        centered: true,
      };
      this.modal.open(noteModal, options);
      this.iNote.MeetingId = request?.MeetingId;
      this.iNote.RequestId = request?.RequestId;
      this.iNote.UserId = request?.UserId;
      this.buildNoteForm();
    }
  }

  // note form
  buildNoteForm() {
    this.noteForm = this.formBuilder.group({
      Note: [
        this.iNote?.Note,
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.minLength(2),
        ],
      ],
      RequestId: [this.iNote?.RequestId],
      MeetingId: [this.iNote?.MeetingId],
      UserId: [this.iNote?.UserId],
      NoteId: [this.iNote?.NoteId],
    });
  }

  // get note form validation errors
  noteFormErrorMessage(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }

  async onSaveNote(modal: any) {
    //save and close modal
    this.submitted = false;
    if (!this.noteForm.valid) {
      this.submitted = true;
      return this.noteForm.markAsUntouched();
    }

    const data: INotes = {
      Note: this.noteForm.get('Note')?.value,
      MeetingId: this.noteForm.get('MeetingId')?.value,
      RequestId: 0,
      UserId: this.noteForm.get('UserId')?.value,
      RespondUserId: this.iContact.UserId,
      Visible: true,
    };

    // save note

    this.noteService
      .savetNote(data)
      .pipe(
        switchMap((iNote: any) => {
          this.iNote = iNote;
          return of(this.iNote);
        })
      )
      .subscribe({
        next: (iNote: any) => {
          console.log('Saved Note');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
        },
        complete: () => {
          this.loadMeetnPray();
        },
      });
    this.onCloseNoteModal(modal);
  }

  onCloseNoteModal(modal: any) {
    modal.close();
  }

  // participant confirms if they have to join meet-n-pray
  openConfirmParticipantModal(meeting: any, confirmParticipantModal: any) {
    if (meeting) {
      const options: NgbModalOptions = {
        size: 'lg',
        backdrop: 'static',
        keyboard: true,
        centered: true,
      };
      this.modal
        .open(confirmParticipantModal, options)
        .result.then((result) => {
          if (result === 'confirmed') {
            // call participant method
            this.saveParticipant(meeting);
          }
        });
      this.confirmParticipant = meeting.Title;
    }
  }

  async saveParticipant(meeting: any) {
    const data: IParticipant = {
      AffiliationLookupId: this.iContact?.AffiliationLookupId,
      UserId: this.iContact?.UserId,
      MeetingId: meeting.MeetingId,
      RequestId: 0,
      RoomId: 0,
      Invited: true,
      Accepted: true,
      Declined: false,
      Attended: true,
      Revoked: false,
      Login: '',
      Passcode: '',
      CreatedDate: null,
      ModifiedDate: null,
    };

    this.participantService
      .SaveParticipant(data)
      .pipe(
        switchMap((result: any) => {
          this.iParticipant = result;
          return of(this.iParticipant);
        })
      )
      .subscribe({
        next: (iParticipant) => {
          console.log('Successfully saved Participant');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
        },
        complete: () => {
          // window.open('/community/meeting?id=' + meeting.MeetingId, '_blank');
          this.moreInformation(meeting);
        },
      });
  }
  async onParticipantConfirm(confirmParticipantModal: any) {
    confirmParticipantModal.close('confirmed');
  }

  onCloseParticipantConfirm(confirmParticipantModal: any) {
    confirmParticipantModal.close();
  }
}
