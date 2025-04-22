import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IScroll } from '../../../core/models/IScroll';
import { ScrollService } from '../../../data/services/scroll.service';
import { LookupService } from '../../../data/services/lookup.service';
import { ILookup } from '../../../core/models/ILookup';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  NgbDatepickerModule,
  NgbModal,
  NgbModalOptions,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { ReactionService } from '../../../data/services/reaction.service';
import {
  IContact,
  IDayReminder,
  IHourlyReminder,
  IReaction,
  IRecurrence,
  IRecurrenceValues,
  IScrollRequestCombined,
  ITime,
} from '../../../core/models/IHelpers';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { IRequest } from '../../../core/models/IRequest';
import { RequestService } from '../../../data/services/request.service';
import { HelperService } from '../../../data/utils/helper.service';
import { ITimeZones } from '../../../core/models/ITimeZones';
import { TimeZonesService } from '../../../data/services/timezones.service';
import {
  Observable,
  combineLatest,
  interval,
  merge,
  of,
  switchMap,
} from 'rxjs';
import { MeetingService } from '../../../data/services/meeting.service';
import { IMeeting } from '../../../core/models/IMeeting';
import { ActivatedRoute } from '@angular/router';
import { debug } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfileService } from '../../../data/utils/profile.service';

@Component({
  selector: 'app-howtopray',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    ReactiveFormsModule,
    CommonModule,
    NgbPopoverModule,
    InfiniteScrollModule,
    NgbDatepickerModule,
  ],
  templateUrl: './howtopray.component.html',
  styleUrl: './howtopray.component.css',
})
export class HowtoprayComponent implements OnInit {
  iContact!: IContact;
  theScrollForm!: FormGroup;
  meetingForm!: FormGroup;
  scrollRequest!: string;
  errors: any;
  meetingDateError: any;
  meetingTimeError: any;
  meetingRecurringEndDateError: any;

  // arrays
  iTime: ITime[] = [];
  iRecurrence: IRecurrenceValues[] = [];
  iDayReminder: IDayReminder[] = [];
  iHourlyReminder: IHourlyReminder[] = [];
  theScroll: IScroll[] = [];
  scrollCategory: ILookup[] = [];
  requestServiceCategory: ILookup[] = [];
  countryTimezone: ITimeZones[] = [];
  selectedRequestServiceTypeLookupId: string[] = [];

  // models
  iScroll: IScroll = {
    ScrollId: 0,
    UserId: 0,
    AffiliationLookupId: 0,
    CategoryLookupId: 0,
    Title: '',
    Story: '',
    Tags: '',
    Inappropriate: false,
    CreatedDate: '',
    ModifiedDate: '',
  };

  // form combining both the scroll and request inputs
  iScrollRequestCombined: IScrollRequestCombined = {
    ScrollId: 0,
    UserId: 0,
    AffiliationLookupId: 0,
    CategoryLookupId: 0,
    Title: '',
    Story: '',
    Tags: '',
    Inappropriate: false,
    CreatedDate: new Date(),
    ModifiedDate: new Date(),
    RequestId: 0,
    ServiceTypeLookupId: 0,
    Purpose: '',
    Request: '',
    Availability: { RequestDate: '', RequestTime: '', Timezone: '' },
    Confidential: false,
    Videoconference: false,
    AcceptNotifications: false,
    AcceptSharing: false,
    Answered: false,
    InSession: false,
  };
  // lookups
  iScrollCategoryLookup: ILookup = {
    LookupId: 6,
    LookupName: '',
    Category: '',
    Description: '',
    CreatedDate: new Date(),
    ModifiedDate: new Date(),
  };
  iRequestServiceTypeLookup: ILookup = {
    LookupId: 0,
    LookupName: '',
    Category: '',
    Description: '',
    CreatedDate: '',
    ModifiedDate: '',
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
  iRequest: IRequest = {
    RequestId: 0,
    AffiliationLookupId: 0,
    UserId: 0,
    ServiceTypeLookupId: 0,
    Purpose: '',
    Request: '',
    Availability: { RequestDate: '', RequestTime: '', Timezone: '' },
    Tags: '',
    Confidential: false,
    Videoconference: false,
    AcceptNotifications: false,
    AcceptSharing: false,
    Answered: false,
    InSession: false,
    Inappropriate: false,
    TakeRelease: false,
    AssignedUserId: 0,
    AssignedDate: '',
    CreatedDate: '',
    ModifiedDate: '',
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

  // placeholder variable
  titlePlaceholderMessage: string = '';
  storyPlaceholderMessage: string = '';
  tagPlaceholderMessage: string = '';

  //pagination properties
  isLoading: boolean = false;
  prayerOnCall: boolean = false;
  sortScrollByAscDesc = 0;
  affiliationLookupId!: number;
  categoryLookupId = 0;
  pageNumber!: number;
  pageSize!: number;
  searchValue!: string;

  togggleOnCallRequest = () => (this.prayerOnCall = !this.prayerOnCall);
  toggleLoading = () => (this.isLoading = !this.isLoading);

  constructor(
    private scrollService: ScrollService,
    private reactionService: ReactionService,
    private lookupService: LookupService,
    private requestService: RequestService,
    private timeZoneService: TimeZonesService,
    private helperService: HelperService,
    private meetingService: MeetingService,
    private modal: NgbModal,
    private activateRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  ngOnInit() {
    this.sortScrollByAscDesc = 0;
    this.scrollRequest = 'scroll';
    this.getLookupByCategory('scroll');
    this.buildScrollForm();
    this.getScrollData();
  }

  // retrieve the scroll lookup types
  getLookupByCategory(category: any) {
    this.lookupService
      .getLookupByCategory(category)
      .pipe(
        switchMap((lookups: ILookup[]) => {
          if (category === 'scroll') {
            this.scrollCategory = lookups;
            return this.scrollCategory;
          } else {
            this.requestServiceCategory = lookups;
            return this.requestServiceCategory;
          }
        })
      )
      .subscribe({
        next: (lookups) => {
          console.log('Retrieved the scroll and request lookups');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 0) {
            console.log(error.error);
          } else {
            console.log(error.error);
          }
        },
      });
  }

  // build the scroll form
  buildScrollForm() {
    const tagPattern = '^#[a-zA-Z]+(,#[a-zA-Z]+)*$'; // '^[0-9a-zA-Z]+(,[0-9a-zA-Z]+)*$';
    this.theScrollForm = this.formBuilder.group({
      // ScrollId: [this.iScroll.ScrollId],
      //UserId: [this.iScroll.UserId],
      // AffiliationLookupId: [this.iScrollAffiliation.LookupId, [Validators.required]],// user's affiliation
      CategoryLookupId: [
        this.iScrollCategoryLookup.LookupId,
        [Validators.required],
      ],
      Title: [
        this.iScrollRequestCombined.Title,
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.minLength(4),
        ],
      ],
      Story: [
        this.iScrollRequestCombined.Story,
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(100),
        ],
      ],
      Tags: [
        this.iScrollRequestCombined.Tags,
        [Validators.pattern(tagPattern)],
      ],
      ServiceTypeLookupId: [
        this.iRequestServiceTypeLookup.LookupId,
        [Validators.required],
      ],

      Purpose: [
        this.iScrollRequestCombined.Purpose,
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.minLength(4),
        ],
      ],
      Request: [
        this.iScrollRequestCombined.Request,
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(100),
        ],
      ],
      // Availability: [this.iScrollRequestCombined.Availability, [Validators.required, Validators.maxLength(50)]],
      Availability: this.formBuilder.group({
        RequestDate: [
          this.iScrollRequestCombined.Availability?.RequestDate,
          [Validators.required, Validators.maxLength(20)],
        ],
        RequestTime: [
          this.iScrollRequestCombined.Availability?.RequestTime,
          [Validators.required, Validators.maxLength(20)],
        ],
        Timezone: [
          this.iScrollRequestCombined.Availability?.Timezone,
          [Validators.required, Validators.maxLength(20)],
        ],
      }),
      AcceptNotifications: [this.iScrollRequestCombined.AcceptNotifications],
      AcceptSharing: [this.iScrollRequestCombined.AcceptSharing],
      Confidential: [this.iScrollRequestCombined.Confidential],
      Videoconference: [this.iScrollRequestCombined.Videoconference],
    });
    // initialize placeholder message
    this.scrollCategoryChanged(6);
  }

  // show controls placeholder custom message when options chnages from prayer, devotion and praise
  scrollCategoryChanged(category: any) {
    this.scrollRequest = 'scroll';
    this.titlePlaceholderMessage = '';
    this.storyPlaceholderMessage = '';
    this.tagPlaceholderMessage = '';
    switch (category) {
      case 7: {
        this.titlePlaceholderMessage = 'Title your devotion';
        this.storyPlaceholderMessage = 'Share a devotional with people';
        this.tagPlaceholderMessage =
          '#tag your devotion. Words start with # and are comma separated: #Healing,#blessings';
        break;
      }
      case 8: {
        this.titlePlaceholderMessage = 'Title your praise/testimony';
        this.storyPlaceholderMessage = 'Tell people what God has done for you';
        this.tagPlaceholderMessage =
          '#tag your praise/testimony.Words start with # and are comma separated: #Healing,#blessings';
        break;
      }
      default: {
        this.titlePlaceholderMessage = 'Title your prayer';
        this.storyPlaceholderMessage = 'Dedicate a prayer to people';
        this.tagPlaceholderMessage =
          '#tag your prayer. Words start with # and are comma separated: #Healing,#blessings';
        break;
      }
    }
  }

  // initialize scroll data
  async getScrollData() {
    this.toggleLoading();
    this.affiliationLookupId = 0;
    //  this.categoryLookupId = 0;
    this.pageNumber = 1;
    this.pageSize = 2;
    this.searchValue = 'All';
    await this.getTheScroll(
      this.affiliationLookupId,
      this.categoryLookupId,
      this.pageNumber,
      this.pageSize,
      this.sortScrollByAscDesc,
      this.searchValue
    );
  }

  // Retrieve all stories posted on the scroll
  async getTheScroll(
    affiliationLookupId: number,
    categoryLookupId: number,
    pageNumber: number,
    pageSize: number,
    sortAscDesc: number,
    searchValue: string
  ) {
    this.scrollService
      .getTheScroll(
        affiliationLookupId,
        categoryLookupId,
        pageNumber,
        pageSize,
        sortAscDesc,
        searchValue
      )
      .pipe(
        switchMap((theScroll: IScroll[]) => {
          this.theScroll = theScroll;
          return this.theScroll;
        })
      )
      .subscribe({
        next: (theScroll) => {
          console.log('Retrieved the scroll');
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 0) {
            console.log(error.error);
          } else {
            console.log(error.error);
          }
        },
        complete: () => {
          this.toggleLoading();
          //console.log('Successfully retrieved the scroll')
        },
      });
  }

  // instatiate ngx-infinite-scroll  with data
  onScroll() {
    //  console.log('scrolled');
    this.loadScrollData();
  }
  // loads paginated data and appends to existing
  async loadScrollData() {
    this.toggleLoading();
    //this.sortScrollByAscDesc = 0;
    this.affiliationLookupId = 0;
    // this.categoryLookupId = 0;
    this.pageNumber++;
    this.pageSize = 2;
    this.searchValue = 'All';

    this.scrollService
      .getTheScroll(
        this.affiliationLookupId,
        this.categoryLookupId,
        this.pageNumber,
        this.pageSize,
        this.sortScrollByAscDesc,
        this.searchValue
      )
      .pipe(
        switchMap((scroll: IScroll[]) => {
          this.theScroll = [...this.theScroll, ...scroll];
          return this.theScroll;
        })
      )
      .subscribe({
        next: (scroll) => {
          console.log('Retrieved the scroll data');
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          this.toggleLoading();
          //console.log('Successfully retrieved the scroll')
        },
      });
  }

  // scroll form validation errors
  scrollFormErrorMessage(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }

  // filters scroll in ascending and descending order
  filterScroll(sort: any) {
    this.sortScrollByAscDesc = sort;
    this.getScrollData();
    /* this.ngOnInit();*/
  }

  // save strory on the scroll
  async postOnScroll() {
    //if (!this.theScrollForm.valid) {
    //  return this.theScrollForm.markAllAsTouched();
    //}

    // only scroll
    const title = this.theScrollForm.get('Title')?.value;
    const story = this.theScrollForm.get('Story')?.value;
    const categoryLookupId = this.theScrollForm.get('CategoryLookupId')?.value;
    const tags = this.theScrollForm.get('Tags')?.value;

    if (this.isValid(title) || this.isValid(story)) {
      return this.theScrollForm.markAllAsTouched();
    }

    // fill scroll form
    const data = this.iScroll;
    data.Title = title;
    data.Story = story;
    data.CategoryLookupId = categoryLookupId;
    data.AffiliationLookupId = 3;
    data.UserId = this.iContact.UserId;
    data.Inappropriate = false;
    //  data.CreatedDate = new Date();
    data.Tags = tags.length > 0 ? tags.split(',') : [];

    // insert record
    this.scrollService
      .createScroll(data)
      .pipe(
        switchMap((theScroll: IScroll[]) => {
          this.theScroll = theScroll;
          return this.theScroll;
        })
      )
      .subscribe({
        next: (theScroll) => {
          console.log('Posting message on scroll');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
        },
        complete: () => {
          //To Do: add guard, set session and redirect to the Scroll;
          console.log('Successfully created data on the scroll.');
          window.location.reload();
        },
      });
  }

  // save user reactions
  async scrollStoryReactions(scroll: any, reaction: any, signInModal: any) {

    if (typeof this.iContact?.UserId === 'undefined' || !Number.isNaN(this.iContact?.UserId)) {
      const options: NgbModalOptions = {
        size: 'sm',
        backdrop: 'static',
        keyboard: false,
        centered: true,
      };
      this.modal.open(signInModal, options);
    } else {

      let reactionData = this.iReaction;
      reactionData.AffiliationLookupId = scroll.Affiliation[0]?.LookupId;
      reactionData.UserId = this.iContact.UserId; // checks for both null and undefined
      reactionData.RequestId = 0;
      reactionData.ScrollId = scroll.ScrollId;
      reactionData.ReactionId = 0;
      reactionData.MeetingId = 0;
      reactionData.Likes = reaction == 'liked' ? 1 : 0;
      reactionData.Loves = reaction == 'loved' ? 1 : 0;
      reactionData.Shared = reaction == 'shared' ? 1 : 0;
      reactionData.Downloads = reaction == 'downloaded' ? 1 : 0;
      reactionData.Inappropriate = reaction == 'inappropriate' ? 1 : 0;
      reactionData.Listened = reaction == 'listened' ? 1 : 0;
      reactionData.Star = reaction == 'favorite' ? 1 : 0;
      reactionData.Prayed = reaction == 'prayed' ? 1 : 0;

      // save reaction
      this.reactionService
        .SaveReaction(reactionData)
        .pipe(
          switchMap((iReaction: IReaction) => {
            this.iReaction = iReaction;
            return of(this.iReaction);
          })
        )
        .subscribe({
          next: (iReaction: IReaction) => {
            console.log('Save the scroll reaction');
          },
          error: (err: any) => {
            this.errors = err.error.Message;
          },
          complete: () => {
            //  this.ngOnInit();
            this.loadScrollData();
            // window.location.reload();
          },
        });
    }
  }

  // show prayer request form
  async loadPrayRequest(category: any) {
    this.scrollRequest = 'requests';
    this.iTime = this.helperService.getTime();
    await this.getLookupByCategory('prayerrequest');
    await this.getCountryTimezone('US');
  }

  isValid(value: string) {
    return (value === '' || value === undefined || value.length === 0) ?? true;
  }
  requestedPrayerOnCall() {
    this.togggleOnCallRequest();
  }
  // save prayer request
  async submitPrayerRequest() {
    debugger;
    // only request properties
    // const serviceTypeLookupId = this.theScrollForm.get('ServiceTypeLookupId')?.value
    const serviceTypeLookupId = this.selectedRequestServiceTypeLookupId;
    const purpose = this.theScrollForm.get('Purpose')?.value;
    const request = this.theScrollForm.get('Request')?.value;
    const availability = this.theScrollForm.get('Availability')?.value;
    const acceptNotifications = this.theScrollForm.get(
      'AcceptNotifications'
    )?.value;
    const confidential = this.theScrollForm.get('Confidential')?.value;
    const acceptSharing = this.theScrollForm.get('AcceptSharing')?.value;
    const categoryLookupId = this.theScrollForm.get('CategoryLookupId')?.value;

    const videoconference = this.theScrollForm.get('Videoconference')?.value;
    const tags = this.theScrollForm.get('Tags')?.value;

    //validation
    if (this.isValid(purpose) || this.isValid(request)) {
      return this.theScrollForm.markAllAsTouched();
    }

    const data = this.iRequest;
    data.AcceptNotifications = acceptNotifications;
    data.Availability = availability;
    data.Confidential = confidential;
    data.AcceptSharing = acceptSharing;
    data.Videoconference = videoconference;
    data.Purpose = purpose;
    data.Request = request;
    data.ServiceTypeLookupId = serviceTypeLookupId;
    data.AffiliationLookupId = 3;
    data.UserId = this.iContact.UserId;
    data.Inappropriate = false;
    data.TakeRelease = false;
    data.AssignedUserId = 0;
    data.AssignedDate = null;
    data.CreatedDate = new Date();
    data.Tags = tags.length > 0 ? tags.split(',') : [];

    // insert record
    this.requestService
      .saveRequest(data)
      .pipe(
        switchMap((iRequest: IRequest) => {
          this.iRequest = iRequest;
          return of(this.iRequest);
        })
      )
      .subscribe({
        next: (iRequest: IRequest) => {
          console.log('Saving Request');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
          // show popup page why prayer request is not saved
        },
        complete: () => {
          //To Do: add popup page acknowledging user successfuly submitted prayer request
          console.log('Successfully created data on the request.');
          this.ngOnInit();
        },
      });
  }

  // retrieve Country Timezones
  async getCountryTimezone(countryCode: any) {
    this.timeZoneService
      .getCountryTimezone(countryCode)
      .pipe(
        switchMap((iTimezone: ITimeZones[]) => {
          this.countryTimezone = iTimezone;
          return this.countryTimezone;
        })
      )
      .subscribe({
        next: (iTimezone) => {
          console.log('Retrieve TimeZones');
        },
        error: (err) => console.log('Error Retrieving TimeZones: ' + err),
        complete: () => console.log('Completed retrieving TimeZones'),
      });
  }

  // set selected prayer needs
  changedRequestedServiceType(requestServiceTypeLookupId: any): void {
    if (
      this.selectedRequestServiceTypeLookupId.includes(
        requestServiceTypeLookupId
      )
    ) {
      this.selectedRequestServiceTypeLookupId =
        this.selectedRequestServiceTypeLookupId.filter(
          (prayerNeed) => prayerNeed !== requestServiceTypeLookupId
        );
    } else {
      this.selectedRequestServiceTypeLookupId.push(requestServiceTypeLookupId);
    }
  }

  /// Meetings

  // start prayer meeting
  async startPrayMeeting(lookupId: number, meetingModal: any) {
    //  await this.getLookupByCategory('prayerrequest');

    this.iTime = this.helperService.getTime();
    this.iHourlyReminder = this.helperService.getHourlyReminder();
    this.iDayReminder = this.helperService.getDayReminder();
    this.iRecurrence = this.helperService.getReccurence();
    await this.getCountryTimezone('US');
    this.buildMeetingForm();

    if (lookupId === 10) {
      const options: NgbModalOptions = {
        size: 'lg',
        backdrop: 'static',
        keyboard: true,
        centered: true,
      };
      this.modal.open(meetingModal, options);
      this.buildMeetingForm();
    }
  }

  // validate meeting form
  meetingFormValidation(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }

  // meeting form
  private buildMeetingForm() {
    const tagPattern = '^#[a-zA-Z]+(,#[a-zA-Z]+)*$';
    this.meetingForm = this.formBuilder.group({
      MeetingId: [this.iMeeting.MeetingId],
      //UserId: [this.iMeeting.UserId],
      //AffiliationLookupId: [this.iMeeting.AffiliationLookupId, [Validators.required]],

      Title: [
        this.iMeeting.Title,
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.minLength(4),
        ],
      ],
      Story: [
        this.iMeeting.Story,
        [
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(100),
        ],
      ],
      Tags: [this.iMeeting.Tags, [Validators.pattern(tagPattern)]],
      Location: this.formBuilder.group({
        Street1: [
          this.iMeeting.Location?.Street1,
          [
            Validators.required,
            Validators.maxLength(80),
            Validators.minLength(4),
          ],
        ],
        Street2: [this.iMeeting.Location?.Street2, [Validators.maxLength(10)]],
        City: [
          this.iMeeting.Location?.City,
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(4),
          ],
        ],
        StateProvince: [
          this.iMeeting.Location?.StateProvince,
          [Validators.maxLength(50)],
        ],
        Country: ['US', [Validators.required]],
        Zipcode: [
          this.iMeeting.Location?.City,
          [Validators.maxLength(20), Validators.minLength(5)],
        ],
      }),
      StartTime: [this.iMeeting.StartTime, [Validators.required]],
      EndTime: [this.iMeeting.EndTime, [Validators.required]],
      StartDate: [
        this.iMeeting.StartDate,
        [Validators.required, this.validateDate],
      ],
      EndDate: [
        this.iMeeting.EndDate,
        [Validators.required, this.validateDate],
      ],
      TimeZone: [this.iMeeting.TimeZone, [Validators.required]],
      Banner: [this.iMeeting.Banner],
      Recurrence: this.formBuilder.group({
        Recurring: [this.iMeeting.Recurrence?.Recurring],
        RecurringEndDate: [this.iMeeting.Recurrence?.RecurringEndDate],
      }),
      Reminders: this.formBuilder.group({
        Days: [this.iMeeting.Reminders?.Days],
        Hours: [this.iMeeting.Reminders?.Hours],
      }),
      Confidential: this.formBuilder.group({
        IsPublic: [this.iMeeting.Confidential?.IsPublic],
        IsOnline: [this.iMeeting.Confidential?.IsOnline],
        InPerson: [this.iMeeting.Confidential?.InPerson],
        Hybrid: [this.iMeeting.Confidential?.Hybrid],
      }),
      Restriction: [this.iMeeting.Restriction],
    });
  }
  validateDate(control: AbstractControl) {
    const value = control.value;

    //min date 01/01/1850
    if (value === null || value === '' || value <= '1850-01-01') {
      return { required: true };
    } else {
      return null;
    }
  }

  onDateChange() {
    const startDate = this.meetingForm.get('StartDate')?.value;
    const endDate = this.meetingForm.get('EndDate')?.value;
    const today = new Date().toISOString().split('T')[0];
    this.meetingDateError = '';

    if (endDate < startDate && endDate !== '') {
      this.meetingDateError = 'End date cannot be less than start date.';
      return;
    }
    if (startDate < today && startDate !== '') {
      this.meetingDateError = 'Start date cannot be less than today date.';
      return;
    }
  }

  onTimeChange() {
    const startTime = this.meetingForm.get('StartTime')?.value;
    const endTime = this.meetingForm.get('EndTime')?.value;
    this.meetingTimeError = '';
    if (startTime === endTime && endTime !== '') {
      this.meetingTimeError = 'Start time cannot be equal to end time.';
      return;
    }

    if (endTime < startTime && endTime !== '') {
      this.meetingTimeError = 'End time cannot be less than start time.';
      return;
    }
  }

  recurringChanged() {
    const recurringEndDate =
      this.meetingForm.controls['Recurrence']?.get('RecurringEndDate')?.value;
    const recurring =
      this.meetingForm.controls['Recurrence']?.get('Recurring')?.value;
    this.meetingRecurringEndDateError = '';
    if (recurringEndDate === '' && recurring !== '') {
      this.meetingRecurringEndDateError = 'Recurrence end date is required';
      return;
    }
  }
  onRecurringDateChange() {
    this.meetingRecurringEndDateError = '';
    const recurringEndDate =
      this.meetingForm.controls['Recurrence']?.get('RecurringEndDate')?.value;
    const endDate = this.meetingForm.get('EndDate')?.value;
    if (endDate === recurringEndDate || recurringEndDate < endDate) {
      this.meetingRecurringEndDateError =
        'Recurring date cannot be equal or less than meeting end date';
    }
    return;
  }

  //create prayer meeting
  async saveMeeting() {
    // validate form
    if (!this.meetingForm.valid) {
      return this.meetingForm.markAllAsTouched();
    }

    const tags = this.meetingForm.get('Tags')?.value;
    this.iMeeting.UserId = this.iContact.UserId;
    this.iMeeting.AffiliationLookupId = 3;
    this.iMeeting.Tags = tags.length > 0 ? tags.split(',') : [];
    this.iMeeting.Title = this.meetingForm.get('Title')?.value;
    this.iMeeting.Story = this.meetingForm.get('Story')?.value;
    this.iMeeting.StartDate = this.meetingForm.get('StartDate')?.value;
    this.iMeeting.EndDate = this.meetingForm.get('EndDate')?.value;
    this.iMeeting.StartTime = this.meetingForm.get('StartTime')?.value;
    this.iMeeting.EndTime = this.meetingForm.get('EndTime')?.value;
    this.iMeeting.Restriction = this.meetingForm.get('Restriction')?.value;
    this.iMeeting.TimeZone = this.meetingForm.get('TimeZone')?.value;
    this.iMeeting.Banner = this.meetingForm.get('Banner')?.value;

    this.iMeeting.Location = {
      Street1: this.meetingForm.controls['Location']?.get('Street1')?.value,
      Street2: this.meetingForm.controls['Location']?.get('Street2')?.value,
      City: this.meetingForm.controls['Location']?.get('City')?.value,
      StateProvince:
        this.meetingForm.controls['Location']?.get('StateProvince')?.value,
      Country: this.meetingForm.controls['Location']?.get('Country')?.value,
      Zipcode: this.meetingForm.controls['Location']?.get('Zipcode')?.value,
    };
    this.iMeeting.Recurrence = {
      RecurringEndDate:
        this.meetingForm.controls['Recurrence']?.get('RecurringEndDate')?.value,
      Recurring:
        this.meetingForm.controls['Recurrence']?.get('Recurring')?.value,
    };
    this.iMeeting.Reminders = {
      Days: this.meetingForm.controls['Reminders']?.get('Days')?.value,
      Hours: this.meetingForm.controls['Reminders']?.get('Hours')?.value,
    };
    this.iMeeting.Confidential = {
      InPerson:
        this.meetingForm.controls['Confidential']?.get('InPerson')?.value,
      IsOnline:
        this.meetingForm.controls['Confidential']?.get('IsOnline')?.value,
      IsPublic:
        this.meetingForm.controls['Confidential']?.get('IsPublic')?.value,
      Hybrid: this.meetingForm.controls['Confidential']?.get('Hybrid')?.value,
    };

    this.meetingService
      .createMeeting(this.iMeeting)
      .pipe(
        switchMap((iMeeting: IMeeting) => {
          this.iMeeting = iMeeting;
          return of(this.iMeeting);
        })
      )
      .subscribe({
        next: (iMeeting: IMeeting) => {
          console.log('Saving Meeting');
        },
        error: (err: any) => {
          // display api error
          console.log(err);
        },
        complete: () => {
          // redirect to pray meeting resource managment page
          console.log('Successfully created meeting prayer.');
          this.modal.dismissAll();
          this.ngOnInit();
        },
      });
  }
  // close modal
  closeMeetingModal() {
    this.modal.dismissAll();
    this.ngOnInit();
  }
}
