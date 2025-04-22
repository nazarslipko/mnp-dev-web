import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { IMeeting } from '../../../../../core/models/IMeeting';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  IAddress,
  IConfidential,
  IContact,
  IDayReminder,
  IDelete,
  IHourlyReminder,
  IRecurrence,
  IRecurrenceValues,
  IReminders,
  ITime,
} from '../../../../../core/models/IHelpers';
import { ProfileService } from '../../../../../data/utils/profile.service';
import { MeetingService } from '../../../../../data/services/meeting.service';
import { TimeZonesService } from '../../../../../data/services/timezones.service';
import { HelperService } from '../../../../../data/utils/helper.service';
import { LookupService } from '../../../../../data/services/lookup.service';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITimeZones } from '../../../../../core/models/ITimeZones';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-editmeeting',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbDatepickerModule],
  templateUrl: './editmeeting.component.html',
  styleUrl: './editmeeting.component.css',
})
export class EditmeetingComponent implements OnInit, OnChanges {
  meetingForm!: FormGroup;
  iContact: IContact;
  @Input() meeting: any | null;
  errors: any;
  meetingDateError: any;
  meetingTimeError: any;
  meetingRecurringEndDateError: any;
  meetingId: any;
  data: any;

  // arrays
  iTime: ITime[] = [];
  iRecurrence: IRecurrenceValues[] = [];
  iDayReminder: IDayReminder[] = [];
  iHourlyReminder: IHourlyReminder[] = [];
  countryTimezone: ITimeZones[] = [];
  @ViewChild('confirmDelete') confirmDeleteTemplate: any;

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

  constructor(
    private lookupService: LookupService,
    private timeZoneService: TimeZonesService,
    private helperService: HelperService,
    private meetingService: MeetingService,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private deleteModal: NgbModal
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {
    this.meetingId = this.activatedRoute.snapshot.queryParamMap.get('id');
    //  this.data= this.meeting;

    /*
    if(this.meeting){

    }else{    
      this.meetingId = this.activatedRoute.snapshot.queryParamMap.get('id');
     
     
     if((this.meetingId-0)>0){   
      await (
        await this.meetingService.getMeeting(this.meetingId-0)
      .pipe(switchMap()).subscribe({
        next: (iMeeting: IMeeting) => {        
         debugger;
      this.data= this.iMeeting as any; 
        },
      });
     }
    
    }   
    */

    /*

    if (this.meeting?.MeetingId) {
      const recurrence = JSON.parse(this.meeting?.Recurrence);
      const confidential = JSON.parse(this.meeting?.Confidential);
      const reminders = JSON.parse(this.meeting?.Reminders);

      const iRecurrence: IRecurrence = {
        Recurring: recurrence.Recurring,
        RecurringEndDate: this.formatDateToInput(recurrence.RecurringEndDate),
      };

      const iConfidential: IConfidential = {
        IsPublic: confidential.IsPublic,
        IsOnline: confidential.IsOnline,
        InPerson: confidential.InPerson,
        Hybrid: confidential.Hybrid,
      };
      const iReminders: IReminders = {
        Days: reminders.Days,
        Hours: reminders.Hours,
      };

      const iAddress: IAddress = {
        Street1: this.meeting?.Street1,
        Street2: this.meeting?.Street2,
        City: this.meeting?.City,
        StateProvince: this.meeting?.StateProvince,
        Country: this.meeting?.Country,
        Zipcode: this.meeting?.Zipcode,
      };

      this.iMeeting.MeetingId = this.meeting?.MeetingId;
      this.iMeeting.AffiliationLookupId = this.meeting?.AffiliationLookupId;
      this.iMeeting.UserId = this.meeting?.UserId;
      this.iMeeting.Title = this.meeting?.Title;
      this.iMeeting.Story = this.meeting?.Story;
      this.iMeeting.Location = iAddress;
      this.iMeeting.Tags =
        this.meeting?.Tags === ''
          ? ''
          : this.meeting?.Tags?.replaceAll('|', ',');

      this.iMeeting.StartTime = this.meeting?.StartTime;
      this.iMeeting.EndTime = this.meeting?.EndTime;
      this.iMeeting.StartDate = this.formatDateToInput(this.meeting?.StartDate);
      this.iMeeting.EndDate = this.formatDateToInput(this.meeting?.EndDate);
      this.iMeeting.Banner = this.meeting?.Banner;
      this.iMeeting.Recurrence = iRecurrence;
      this.iMeeting.Reminders = iReminders;
      this.iMeeting.Confidential = iConfidential;
      this.iMeeting.Restriction = this.meeting?.Restriction;
      this.iMeeting.TimeZone = this.meeting?.TimeZone;
      this.iMeeting.Inappropriate = this.meeting?.Inappropriate;
      this.iMeeting.CreatedDate = this.meeting?.CreatedDate;
      this.iMeeting.ModifiedDate = this.meeting?.ModifiedDate;
    }

    this.iTime = this.helperService.getTime();
    this.iHourlyReminder = this.helperService.getHourlyReminder();
    this.iDayReminder = this.helperService.getDayReminder();
    this.iRecurrence = this.helperService.getReccurence();
    await this.getCountryTimezone('US');

    // form
    this.buildMeetingForm();
    */
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['meeting'] && changes['meeting'].currentValue) {
     const meetingData= [...this.meeting ];
      this.data = meetingData[0];
     
      if (this.data?.MeetingId) {
        const recurrence = JSON.parse(this.data?.Recurrence);
        const confidential = JSON.parse(this.data?.Confidential);
        const reminders = JSON.parse(this.data?.Reminders);

        const iRecurrence: IRecurrence = {
          Recurring: recurrence?.Recurring,
          RecurringEndDate: recurrence?.RecurringEndDate
            ? this.formatDateToInput(recurrence?.RecurringEndDate)
            : null,
        };

        const iConfidential: IConfidential = {
          IsPublic: confidential.IsPublic,
          IsOnline: confidential.IsOnline,
          InPerson: confidential.InPerson,
          Hybrid: confidential.Hybrid, 
        };
        const iReminders: IReminders = {
          Days: reminders.Days,
          Hours: reminders.Hours,
        };

        const iAddress: IAddress = {
          Street1: this.data?.Street1,
          Street2: this.data?.Street2,
          City: this.data?.City,
          StateProvince: this.data?.StateProvince,
          Country: this.data?.Country,
          Zipcode: this.data?.Zipcode,
        };

        this.iMeeting.MeetingId = this.data?.MeetingId;
        this.iMeeting.AffiliationLookupId = this.data?.AffiliationLookupId;
        this.iMeeting.UserId = this.data?.UserId;
        this.iMeeting.Title = this.data?.Title;
        this.iMeeting.Story = this.data?.Story;
        this.iMeeting.Location = iAddress;
        this.iMeeting.Tags =
          this.data?.Tags === '' ? '' : this.data?.Tags?.replaceAll('|', ',');

        this.iMeeting.StartTime = this.data?.StartTime;
        this.iMeeting.EndTime = this.data?.EndTime;
        this.iMeeting.StartDate = this.formatDateToInput(this.data?.StartDate);
        this.iMeeting.EndDate = this.formatDateToInput(this.data?.EndDate);
        this.iMeeting.Banner = this.data?.Banner;
        this.iMeeting.Recurrence = iRecurrence;
        this.iMeeting.Reminders = iReminders;
        this.iMeeting.Confidential = iConfidential;
        this.iMeeting.Restriction = this.data?.Restriction;
        this.iMeeting.TimeZone = this.data?.TimeZone;
        this.iMeeting.Inappropriate = this.data?.Inappropriate;
        this.iMeeting.CreatedDate = this.data?.CreatedDate;
        this.iMeeting.ModifiedDate = this.data?.ModifiedDate;
      }

      this.iTime = this.helperService.getTime();
      this.iHourlyReminder = this.helperService.getHourlyReminder();
      this.iDayReminder = this.helperService.getDayReminder();
      this.iRecurrence = this.helperService.getReccurence();
      await this.getCountryTimezone('US');

      // form
      this.buildMeetingForm();
    }
  }

  formatDateToInput(dateValue: string): string {
    const validDate = dateValue + '0';
    const date = new Date(dateValue);
    return date.toISOString().split('T')[0];
  }

  // meeting form
  private buildMeetingForm() {
    const tagPattern = '^#[a-zA-Z]+(,#[a-zA-Z]+)*$';
    this.meetingForm = this.formBuilder.group({
      MeetingId: [this.iMeeting.MeetingId],

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
  // validate meeting form
  meetingFormValidation(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
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

  // retrieve Country Timezones
  getCountryTimezone(countryCode: any) {
    this.timeZoneService
      .getCountryTimezone(countryCode)
      .pipe(
        switchMap((iTimezone: any[]) => {
          this.countryTimezone = iTimezone;
          return this.countryTimezone;
        })
      )
      .subscribe({
        next: (iTimezone) => {
          console.log('Retrived Timezones');
        },
        error: (err) => console.log('Error Retrieving TimeZones: ' + err),
      });
  }

  //create prayer meeting
  async onSaveMeeting() {
    // validate form
    if (!this.meetingForm.valid) {
      return this.meetingForm.markAllAsTouched();
    }

    const tags = this.meetingForm.get('Tags')?.value;
    this.iMeeting.MeetingId = this.meetingForm.get('MeetingId')?.value;
    this.iMeeting.UserId = this.iContact.UserId;
    this.iMeeting.AffiliationLookupId = this.iContact.AffiliationLookupId;
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
      .updateMeeting(this.iMeeting)
      .pipe(
        switchMap((iMeeting: IMeeting) => {
          this.iMeeting = iMeeting;
          return of(this.iMeeting);
        })
      )
      .subscribe({
        next: (iMeeting: IMeeting) => {
          console.log('Updated Meeting');
        },
        error: (err: any) => {
          // display api error
          console.log(err);
        },
        complete: () => {
          // redirect to pray meeting resource managment page
          console.log('Successfully created meeting prayer.');
        },
      });
  }

  //#region  Delete
  openConfirmDeleteModal() {
    this.deleteModal
      .open(this.confirmDeleteTemplate, { keyboard: false, backdrop: 'static' })
      .result.then(
        (result) => {
          if (result === 'confirmed') {
            this.onDeleteMeeting();
          }
        },
        (dismiss) => {
          this.deleteModal.dismissAll();
        }
      );
  }

  closeDeleteMeetingModal(modal: any) {
    modal.close();
  }

  confirmDeleteMeeting(modal: any) {
    modal.close('confirmed');
  }

  onDeleteMeeting() {
    if (this.meeting?.MeetingId - 0 > 0) {
      this.meetingService
        .deleteMeeting(this.meeting?.MeetingId)
        .pipe(
          switchMap((iDelete: IDelete) => {
            return of(iDelete);
          })
        )
        .subscribe({
          next: (iDelete: IDelete) => {
            console.log('Delete Meeting');
          },
          error: (err) => console.log('Error deleting meeting'),
          complete: () => console.log('Completed deleting record'),
        });
    }
  }
  //#endregion
}
