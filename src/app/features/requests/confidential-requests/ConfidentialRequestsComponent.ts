import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RequestService } from '../../../data/services/request.service';
import { ReactionService } from '../../../data/services/reaction.service';
import { IContact, IReaction, IRequestStatus } from '../../../core/models/IHelpers';
import { IRequest } from '../../../core/models/IRequest';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModal, NgbModalOptions, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../data/utils/profile.service';
import { INotes } from '../../../core/models/INotes';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NoteService } from '../../../data/services/note.service';
import { HelperService } from '../../../data/utils/helper.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-confidential-requests',
  standalone: true,
  imports: [CommonModule, NgbPopover, InfiniteScrollModule, ReactiveFormsModule],
  templateUrl: './confidential-requests.component.html',
  styleUrl: './confidential-requests.component.css'
})
export class ConfidentialRequestsComponent implements OnInit {
  // @ViewChild('notesDiv', { static: false }) notesDiv: ElementRef<HTMLDivElement> = {} as ElementRef;
  iContact!: IContact;
  noteForm!: FormGroup;
  submitted = false;

  iRequest: any;
  prayerRequests: any[] = [];

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

  iReaction: IReaction = { ReactionId: 0, AffiliationLookupId: 0, MeetingId: 0, UserId: 0, RequestId: 0, ScrollId: 0, Loves: 0, Likes: 0, Downloads: 0, Listened: 0, Shared: 0, Star: 0, Inappropriate: 0, Prayed: 0 };
  iNote: INotes = {
    Note: '',
    RequestId: 0,
    UserId: 0,
    RespondUserId: 0,
    Visible: false,
  };
  iRequestStatus: IRequestStatus = {
    RequestStatusId: 0,
    UserId: 0,
    RequestId: 0,
    TakeRelease: 0,
    Prayed: 0,
    InProgress: 0
  };
  togggleOnCallRequest = () => this.prayerOnCall = !this.prayerOnCall;
  toggleLoading = () => this.isLoading = !this.isLoading;

  constructor(
    private router: Router,
    private requestService: RequestService,
    private profileService: ProfileService,
    private modal: NgbModal,
    private noteService: NoteService,
    private helperService: HelperService,
    private formBuilder: NonNullableFormBuilder,
    private reactionService: ReactionService) {
    this.iContact = this.profileService.getProfile();
  }

  ngOnInit() {
    this.getScrollData();
  }

  // initialize scroll data
  async getScrollData() {
    this.toggleLoading();
    this.affiliationLookupId = 0;
    this.serviceTypeLookupId = 0;
    this.pageNumber = 1;
    this.pageSize = 2;
    this.searchValue = 'All';
    await this.getprayerRequests(this.affiliationLookupId, this.serviceTypeLookupId ?? 0, this.pageNumber, this.pageSize, this.confidential, this.sortScrollByAscDesc, this.searchValue);
  }

  // Retrieve all stories posted on the scroll
  async getprayerRequests(affiliationLookupId: number, serviceTypeLookupId: number, pageNumber: number, pageSize: number, confidential: number, sortAscDesc: number, searchValue: string) {

    this.requestService.getRequests(affiliationLookupId, serviceTypeLookupId, pageNumber, pageSize, confidential, sortAscDesc, searchValue).pipe(switchMap(
      (requests: IRequest[]) => {
        this.prayerRequests = requests;
        return this.prayerRequests
      },

    )).subscribe({
      next: () => {
        console.log("Succeeded retrieving prayer requests");
      },
      error: (err: any) => {
        console.error('Error retrieveing  prayer request data: ' + err.error.Message);
      },
      complete: () => {
        this.toggleLoading();
      }
    });
  }


  // instatiate ngx-infinite-scroll  with data
  onScroll() {
    this.loadRequests();
  }
  // loads paginated data and appends to existing
  async loadRequests() {
    this.toggleLoading();
    this.sortScrollByAscDesc = 0;
    this.affiliationLookupId = 0;
    this.pageNumber++;
    this.pageSize = 2;
    this.searchValue = 'All';

    this.requestService.getRequests(this.affiliationLookupId, this.serviceTypeLookupId ?? 0, this.pageNumber, this.pageSize, this.confidential, this.sortScrollByAscDesc, this.searchValue).pipe(switchMap(
      (requests: IRequest[]) => {
        this.prayerRequests = [...this.prayerRequests, ...requests];
        return this.prayerRequests;
      }

    )).subscribe({
      next: () => {
        console.log('Successfully retrieved request data.');
      },
      error: (err: any) => {
        console.error('Error retrieveing  prayer request data: ' + err.error.Message);
      },
      complete: () => {
        this.toggleLoading();
      }
    });
  }

  // filters scroll in ascending and descending order
  filterRequest(sort: any) {
    this.sortScrollByAscDesc = sort;
    this.getScrollData();
    /* this.ngOnInit();*/
  }


  // save user reactions
  async requestReactions(requestId: any, reaction: any) {
    debugger;

    if (typeof this.iContact?.UserId !== 'undefined' || Number.isNaN(this.iContact?.UserId)) {
      const data: IReaction = {
        AffiliationLookupId: this.iContact?.AffiliationLookupId,
        UserId: this.iContact?.UserId,
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
        Prayed: reaction == 'prayed' ? 1 : 0
      }

      // save reaction  
      this.reactionService.SaveReaction(data).pipe(
        switchMap((iReaction: IReaction) => {
          this.iReaction = iReaction;
          return of(this.iReaction);
        })
      ).subscribe({
        next: () => {
          console.log('Succeeded saving prayer request');

        },
        error: (err: any) => {
          this.errors = err.error.Message;
          console.error('Error saving  prayer request reaction: ' + err.error.Message);
        },
        complete: () => {
          this.loadRequests();
        }
      });
    }
  }

  releaseRequest(request: IRequest) {
  }

  async takeRequest(req: any) {
    if (!req) {
      return;
    }

    const data = req as IRequest;
    this.iRequest = {
      RequestId: data.RequestId,
      TakeRelease: true,
      AssignedUserId: this.iContact.UserId,
      AssignedDate: Date.UTC
    };

    this.requestService.takeReleaseRequest(this.iRequest).pipe(switchMap(
      (iRequest: IRequest) => {
        this.iRequest = iRequest;
        this.ngOnInit();
        return of(this.iRequest);
      }
    )).subscribe({
      next: (iRequest: IRequest) => {
        console.log("succeeded taking Prayer request");

      },
      error: (err: any) => {
        this.errors = err.error.Message;
        console.error('Error taking prayer request: ' + err.error.Message);
        // show popup page why prayer request is not saved
      },
      complete: () => {
        //To Do: add popup page acknowledging user successfuly submitted prayer request
        console.log('Successfully created data on the request.');
        this.ngOnInit();
      }
    });
  }

  // save request Status
  /*  async requestStatus(availabilityModal:any, request: any, reaction: any) {*/
  async requestStatus(request: any, reaction: any) {
    debugger;

    if (!request) {
      // display modal nothing saved
      //const options: NgbModalOptions = { size: 'lg', backdrop: 'static', keyboard: true, centered: true };
      //this.modal.open(availabilityModal, options);
    } else {
      let data = this.iRequestStatus;
      data.RequestId = request.RequestId;
      data.UserId = this.iContact.UserId;
      data.Prayed = reaction == 'prayed' ? 1 : 0;
      data.InProgress = reaction == 'progress' ? 1 : 0;
      data.TakeRelease = 1;
      // save request status  
      this.requestService.saveRequestStatus(data).pipe(switchMap(
        (iRequestStatus: IRequestStatus) => {
          this.iRequestStatus = iRequestStatus;
          return of(this.iRequestStatus);
        }

      )).subscribe({
        next: (iRequestStatus: IRequestStatus) => {
          console.log('Succeed geeting prayer request status');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
          console.log('Error retrieving prayer request status: ' + err.error.Message);
        },
        complete: () => {
          this.loadRequests();
        }
      });
    }
  }

  // build form
  buildNoteForm() {
    this.noteForm = this.formBuilder.group({
      Note: [this.iNote.Note, [Validators.required, Validators.maxLength(500)]],
      RequestId: [this.iNote.RequestId],
      UserId: [this.iNote.UserId],
      NoteId: [this.iNote.NoteId]
    });
  }

  composeNote(request: any, noteModal: any) {

    this.submitted = false;
    if (request) {
      const options: NgbModalOptions = { size: 'lg', backdrop: 'static', keyboard: true, centered: true };
      this.modal.open(noteModal, options);
      this.iNote.RequestId = request.RequestId;
      this.iNote.UserId = request.UserId;
      this.buildNoteForm();
    }
  }

  // get note form validation errors
  noteFormErrorMessage(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }


  async onSendNoteForm() {
    //save and close modal
    this.submitted = false;
    if (!this.noteForm.valid) {
      this.submitted = true;
      return this.noteForm.markAsUntouched();
    }

    const data: INotes = {
      Note: this.noteForm.get('Note')?.value,
      RequestId: this.noteForm.get('RequestId')?.value,
      UserId: this.noteForm.get('UserId')?.value,
      RespondUserId: this.iContact.UserId,
      Visible: true
    }

    // send note 
    this.noteService.savetNote(data).pipe(switchMap(
      (iNote: INotes) => {
        this.iNote = iNote;

        return of(this.iNote);
      }
    )).subscribe({
      next: (iNote: INotes) => {
        console.log('Succeeded sending pray request note.');
      },
      error: (err: any) => {
        this.errors = err.error.Message;
        console.log('Error sending prayer request note: ' + err.error.Message);
      },
      complete: () => {
        this.loadRequests();
      }
    });
    this.closeModal();
  }

  onCloseNoteModal() {
    this.closeModal();
  }

  closeModal() {
    this.modal.dismissAll();
  }

}
