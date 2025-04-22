import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService } from '../../../data/services/request.service';
import { IRequest } from '../../../core/models/IRequest';
import { CommonModule } from '@angular/common';
import {
  NgbModal,
  NgbModalOptions,
  NgbPopover,
} from '@ng-bootstrap/ng-bootstrap';
import { ReactionService } from '../../../data/services/reaction.service';
import {
  IContact,
  IReaction,
  IRequestStatus,
} from '../../../core/models/IHelpers';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ProfileService } from '../../../data/utils/profile.service';
import { NoteService } from '../../../data/services/note.service';
import { HelperService } from '../../../data/utils/helper.service';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { INotes } from '../../../core/models/INotes';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-prayer-requests',
  standalone: true,
  imports: [
    CommonModule,
    NgbPopover,
    InfiniteScrollModule,
    ReactiveFormsModule,
  ],
  templateUrl: './prayer-requests.component.html',
  styleUrl: './prayer-requests.component.css',
})
export class PrayerRequestsComponent implements OnInit {
  iContact: IContact;
  noteForm!: FormGroup;
  submitted = false;
  prayerRequests: any[] = [];
  requestType = '';

  //pagination properties
  isLoading: boolean = false;
  prayerOnCall: boolean = false;
  sortScrollByAscDesc = 0;
  affiliationLookupId!: number;
  serviceTypeLookupId?: any = 0;
  pageNumber = 1;
  pageSize = 100;
  searchValue!: string;

  errors: any;
  confidential = 1;

  iRequestStatus: IRequestStatus = {
    RequestStatusId: 0,
    UserId: 0,
    RequestId: 0,
    TakeRelease: 0,
    Prayed: 0,
    InProgress: 0,
  };

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

  iNote: INotes = {
    Note: '',
    RequestId: 0,
    MeetingId: 0,
    UserId: 0,
    RespondUserId: 0,
    Visible: false,
  };

  togggleOnCallRequest = () => (this.prayerOnCall = !this.prayerOnCall);
  toggleLoading = () => (this.isLoading = !this.isLoading);

  constructor(
    private router: Router,
    private requestService: RequestService,
    private profileService: ProfileService,
    private formBuilder: NonNullableFormBuilder,
    private modal: NgbModal,
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute,
    private helperService: HelperService,
    private reactionService: ReactionService
  ) {
    this.iContact = profileService.getProfile() as IContact;
  }

  ngOnInit() {
    this.requestType = this.activatedRoute.snapshot.params['requesttype'];
    this.getRequestData();
  }

  // initialize request data
  async getRequestData() {
    this.toggleLoading();
    this.affiliationLookupId = 0;
    this.serviceTypeLookupId = 0;
    // this.pageNumber = 1;
    // this.pageSize = 2;
    this.searchValue = 'All';

    if (this.requestType?.toLowerCase() === 'confidential') {
      // confidential prayer requests
      this.confidential = 2;
      this.requestService
        .getRequests(
          this.affiliationLookupId,
          this.serviceTypeLookupId,
          this.pageNumber,
          this.pageSize,
          this.confidential,
          this.sortScrollByAscDesc,
          this.searchValue
        )
        .pipe(
          switchMap((requests: IRequest[]) => {
            this.prayerRequests = requests;
            return this.prayerRequests;
          })
        )
        .subscribe({
          next: (requests: IRequest[]) => {
            console.log('Retrieve Confidential Requests');
          },
          error: (err: any) => {
            console.log(err.error.Message);
          },
          complete: () => {
            this.toggleLoading();
          },
        });
    } else if (this.requestType?.toLowerCase() === 'prayed') {
      // answered prayer requests by user
      this.confidential = 0;
      this.requestService
        .getAnsweredPrayerRequests(
          this.iContact.UserId,
          this.affiliationLookupId,
          this.serviceTypeLookupId,
          this.pageNumber,
          this.pageSize,
          this.confidential,
          this.sortScrollByAscDesc,
          this.searchValue
        )
        .pipe(
          switchMap((requests: IRequest[]) => {
            this.prayerRequests = requests;
            return this.prayerRequests;
          })
        )
        .subscribe({
          next: (requests: IRequest[]) => {
            console.log('Retrieve Non Confidential Requests');
          },
          error: (err: any) => {
            console.log(err.error.Message);
          },
          complete: () => {
            this.toggleLoading();
          },
        });
    } else {
      // non confidental prayer requests
      this.confidential = 1;
      this.requestService
        .getRequests(
          this.affiliationLookupId,
          this.serviceTypeLookupId,
          this.pageNumber,
          this.pageSize,
          this.confidential,
          this.sortScrollByAscDesc,
          this.searchValue
        )
        .pipe(
          switchMap((requests: IRequest[]) => {
            this.prayerRequests = requests;

            return this.prayerRequests;
          })
        )
        .subscribe({
          next: (requests: IRequest[]) => {
            console.log('Retrieve Non Confidential Requests');
          },
          error: (err: any) => {
            console.log(err.error.Message);
          },
          complete: () => {
            this.toggleLoading();
          },
        });
    }
  }

  // instatiate ngx-infinite-scroll  with data
  onScroll() {
    this.loadRequests();
  }

  // instatiate ngx-infinite-scroll  with data
  async loadRequests() {
    this.toggleLoading();
    this.sortScrollByAscDesc = 0;
    this.affiliationLookupId = 0;
    this.pageNumber++;
    // this.pageSize = 100;
    this.searchValue = 'All';

    if (this.requestType?.toLowerCase() === 'confidential') {
      // confidential prayer requests
      this.confidential = 2;
      this.requestService
        .getRequests(
          this.affiliationLookupId,
          this.serviceTypeLookupId ?? 0,
          this.pageNumber,
          this.pageSize,
          this.confidential,
          this.sortScrollByAscDesc,
          this.searchValue
        )
        .pipe(
          switchMap((requests: IRequest[]) => {
            this.prayerRequests = [...this.prayerRequests, ...requests];
            return this.prayerRequests;
          })
        )
        .subscribe({
          next: (requests: IRequest[]) => {
            console.log('Retrieve prayer requests');
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            this.toggleLoading();
          },
        });
    } else if (this.requestType?.toLowerCase() === 'prayed') {
      // answered prayer requests by user

      this.confidential = 0;
      this.requestService
        .getAnsweredPrayerRequests(
          this.iContact.UserId,
          this.affiliationLookupId,
          this.serviceTypeLookupId,
          this.pageNumber,
          this.pageSize,
          this.confidential,
          this.sortScrollByAscDesc,
          this.searchValue
        )
        .pipe(
          switchMap((requests: IRequest[]) => {
            this.prayerRequests = [...this.prayerRequests, ...requests];
            return this.prayerRequests;
          })
        )
        .subscribe({
          next: (requests: IRequest[]) => {
            console.log('Retrieved Answer Prayers');
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            this.toggleLoading();
          },
        });
    } else {
      // non confidental prayer requests
      this.confidential = 1;
      this.requestService
        .getRequests(
          this.affiliationLookupId,
          this.serviceTypeLookupId ?? 0,
          this.pageNumber,
          this.pageSize,
          this.confidential,
          this.sortScrollByAscDesc,
          this.searchValue
        )
        .pipe(
          switchMap((requests: IRequest[]) => {
            this.prayerRequests = [...this.prayerRequests, ...requests];
            return this.prayerRequests;
          })
        )
        .subscribe({
          next: (requests: IRequest[]) => {
            console.log('Retrieve non confidental prayer requests ');
          },
          error: (err: any) => {
            console.log(err);
          },
          complete: () => {
            this.toggleLoading();
          },
        });
    }
  }

  // filters scroll in ascending and descending order
  filterRequest(sort: any) {
    this.sortScrollByAscDesc = sort;
    this.getRequestData();
  }

  // save user reactions
  async requestReactions(requestId: any, reaction: any) {
    if (typeof this.iContact?.UserId !== 'undefined' || Number.isNaN(this.iContact?.UserId)){
    const data: IReaction = {
      AffiliationLookupId: this.iContact.AffiliationLookupId,
      UserId: this.iContact.UserId,
      RequestId: requestId,
      ScrollId: 0,
      ReactionId: 0,
      MeetingId: 0,
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
          console.log('Save request reactions');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
          console.log(this.errors);
        },
        complete: () => {
          this.loadRequests();
        },
      });
    }
  }

  // save request Status
  async requestStatus(requestId: any, reaction: any) {

    if (typeof this.iContact?.UserId !== 'undefined' || Number.isNaN(this.iContact?.UserId)) {
       
    let data = this.iRequestStatus;
    data.RequestId = requestId;
    data.UserId = this.iContact.UserId;
    data.Prayed = reaction == 'prayed' ? 1 : 0;
    data.InProgress = reaction == 'progress' ? 1 : 0;
    data.TakeRelease = 1;
    // save request status
    this.requestService
      .saveRequestStatus(data)
      .pipe(
        switchMap((iRequestStatus: IRequestStatus) => {
          this.iRequestStatus = iRequestStatus;
          return of(this.iRequestStatus);
        })
      )
      .subscribe({
        next: (iRequestStatus: IRequestStatus) => {
          console.log('Save request status');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
        },
        complete: () => {
          this.loadRequests();
        },
      });
    }
  }

  async composeNote(request: any, noteModal: any) {
    this.submitted = false;
    if (request) {
      const options: NgbModalOptions = {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        centered: true,
      };
      this.modal.open(noteModal, options);
      this.iNote.RequestId = request.RequestId;
      this.iNote.UserId = request.UserId;
      this.buildNoteForm();
    }
  }

  // note form
  buildNoteForm() {
    this.noteForm = this.formBuilder.group({
      Note: [
        this.iNote.Note,
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.minLength(2),
        ],
      ],
      RequestId: [this.iNote.RequestId],
      UserId: [this.iNote.UserId],
      NoteId: [this.iNote.NoteId],
    });
  }

  // get note form validation errors
  noteFormErrorMessage(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }

  async onSendNoteForm() {
    //save and close modal
    this.submitted = false;
    if (this.noteForm.invalid) {
      this.submitted = true;
      return this.noteForm.markAsUntouched();
    }

    const data: INotes = {
      NoteId: this.noteForm.get('NoteId')?.value,
      Note: this.noteForm.get('Note')?.value,
      RequestId: this.noteForm.get('RequestId')?.value,
      MeetingId: 0,
      UserId: this.noteForm.get('UserId')?.value,
      RespondUserId: this.iContact.UserId,
      Visible: true,
    };

    if (Number(data.NoteId) === 0 && data.Note) {
      // save Note
      this.noteService
        .savetNote(data)
        .pipe(
          switchMap((iNote: INotes) => {
            this.iNote = iNote;

            return of(this.iNote);
          })
        )
        .subscribe({
          next: (iNote: INotes) => {
            console.log('Sending request note');
          },
          error: (err: any) => {
            this.errors = err.error.Message;
          },
          complete: () => {
            console.log('Message: Note is send');
          },
        });
    }

    if (data.NoteId) {
      // update note
      this.noteService
        .updateNote(data)
        .pipe(
          switchMap((iNote: INotes) => {
            this.iNote = iNote;
            return of(this.iNote);
          })
        )
        .subscribe({
          next: (iNote: INotes) => {
            console.log('Updating request note');
          },
          error: (err: any) => {
            this.errors = err.error.Message;
          },
          complete: () => {
            console.log('Message: Note is updated');
          },
        });
    }

    this.modal.dismissAll();
  }
  onCloseNoteModal() {
    this.modal.dismissAll();
  }
}
