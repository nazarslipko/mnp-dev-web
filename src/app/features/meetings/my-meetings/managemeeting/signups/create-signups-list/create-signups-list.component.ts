import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IContact, ITime } from '../../../../../../core/models/IHelpers';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../../../../../data/services/lookup.service';
import { MeetingComponentService } from '../../../../../../data/services/meeting.component.service';
import { HelperService } from '../../../../../../data/utils/helper.service';
import { MeetingService } from '../../../../../../data/services/meeting.service';
import { ProfileService } from '../../../../../../data/utils/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingSignupsService } from '../../../../../../data/services/meeting.signups.service';
import { ISignups } from '../../../../../../core/models/ISignups';
import { lastValueFrom, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-signups-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-signups-list.component.html',
  styleUrl: './create-signups-list.component.css',
})
export class CreateSignupsListComponent implements OnInit {
  signupsForm!: FormGroup;
  iContact: IContact;
  isLoading: boolean = false;
 isSubmitted = false;
  subTitle = '';
  signupTimeError: any;

  @Input() meetingId: any;
  @Input() meetingComponentId: any;
  @Input() meetingSignupId: any;
  @Input() modalTitle: any;
  @ViewChild('confirmDelete') confirmDeleteTemplate: any;

  iTime: ITime[] = [];

  iSignups: ISignups = {
    MeetingSignupId: 0,
    MeetingId: 0,
    MeetingComponentId: 0,
    Title: '',
    TimeSlot: { StartTime: '', EndTime: '' },
    PeopleNeeded: 1,
    Description: '',
    CreatedUserId: 0,
    CreatedDate: null,
  };

  constructor(
    public activeModal: NgbActiveModal,
    //private formBuilder: NonNullableFormBuilder,
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private meetingComponentService: MeetingComponentService,
    private meetingSignupsService: MeetingSignupsService,
    private helperService: HelperService,
    private meetingService: MeetingService,
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private deleteModal: NgbModal
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {
    if (this.meetingSignupId === 0) {
      this.subTitle = 'Create';
      this.iSignups.MeetingId = this.meetingId;
      this.iSignups.MeetingComponentId = this.meetingComponentId;
    } else {
      this.subTitle = 'Edit';
      const signupsData = await lastValueFrom(
        this.meetingSignupsService.getMeetingSignup(this.meetingSignupId)
      );    
      this.iSignups = signupsData[0] as ISignups;
    }
    this.iTime = this.helperService.getTime();
    this.buildSignupsForm();
  }

  // validate form
  contributionFormValidation(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }

  onTimeChange() {
    const startTime =
      this.signupsForm.controls['TimeSlot']?.get('StartTime')?.value;
    const endTime = this.signupsForm.controls['TimeSlot'].get('EndTime')?.value;
    this.signupTimeError = '';
    if (startTime === endTime && endTime !== '') {
      this.signupTimeError = 'Start time cannot be equal to end time.';
      return;
    }
  }

  buildSignupsForm() {
    this.signupsForm = this.formBuilder.group({
      MeetingSignupId: [this.iSignups.MeetingSignupId],
      MeetingComponentId: [this.iSignups.MeetingComponentId],
      MeetingId: [this.iSignups.MeetingId],
      Title: [
        this.iSignups.Title,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(2),
        ],
      ],
      TimeSlot: this.formBuilder.group({
        StartTime: [this.iSignups.TimeSlot.StartTime, [Validators.required]],
        EndTime: [this.iSignups.TimeSlot.EndTime, [Validators.required]],
      }),
      Description: [
        this.iSignups.Description,
        [Validators.maxLength(50), Validators.minLength(4)],
      ],
      PeopleNeeded: [this.iSignups.PeopleNeeded, [Validators.required]],
    });
  }

  //#region  Create/update

  getFormData(): ISignups {
    this.iSignups.MeetingSignupId =
      this.signupsForm.get('MeetingSignupId')?.value;
    this.iSignups.MeetingComponentId =
      this.signupsForm.get('MeetingComponentId')?.value;
    this.iSignups.MeetingId = this.signupsForm.get('MeetingId')?.value;

    this.iSignups.Title = this.signupsForm.get('Title')?.value;
    this.iSignups.TimeSlot = {
      StartTime: this.signupsForm.controls['TimeSlot']?.get('StartTime')?.value,
      EndTime: this.signupsForm.controls['TimeSlot']?.get('EndTime')?.value,
    };

    this.iSignups.PeopleNeeded = this.signupsForm.get('PeopleNeeded')?.value;
    this.iSignups.Description = this.signupsForm.get('Description')?.value;
    this.iSignups.CreatedUserId = this.iContact.UserId;

    this.iSignups.CreatedDate = null;

    return this.iSignups;
  }

  // creates and saves contribution items and then
  onCreateUpdateAndCloseListingContributionItems() {
    // validate form
    if (!this.signupsForm.valid) {
      return this.signupsForm.markAllAsTouched();
    }

    this.isSubmitted=true;
    //get form data
    const formData = this.getFormData();
    if (formData.MeetingSignupId > 0) {
      // update
      this.meetingSignupsService
        .updateMeetingSignup(formData)
        .pipe(
          switchMap((iSignup) => {
            this.iSignups = iSignup;
            this.closeModal();
            return of(this.iSignups);
          })
        )
        .subscribe({
          next: (iContribtution) => {
            console.log('Successfully updated signup.');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully updated signup.');
          },
        });
    } else {
      // insert
      this.meetingSignupsService
        .savetMeetingSignup(formData)
        .pipe(
          switchMap((iSignups: ISignups) => {
            this.iSignups = iSignups;
            this.closeModal();
            return of(this.iSignups);
          })
        )
        .subscribe({
          next: (iContribution: ISignups) => {
            console.log('Successfully created signup.');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully created singup.');
          },
        });
    }
    this.isSubmitted=false;
  }

  // Saves and resets form to add more items on list
  onSaveAndListMoreSignups() {
    // validate form
    if (!this.signupsForm.valid) {
      return this.signupsForm.markAllAsTouched();
    }

    this.isSubmitted= true;
    //get Form Data
    const formData = this.getFormData();
    // insert
    this.meetingSignupsService
      .savetMeetingSignup(formData)
      .pipe(
        switchMap((iSignups: ISignups) => {
          this.iSignups = iSignups;
          this.signupsForm.reset();         
          return of(this.iSignups);
        })
      )
      .subscribe({
        next: (iContribution: ISignups) => {
          console.log('Successfully created signup.');
        },
        error: (err: any) => {
          // display api error
          console.log(err);
        },
        complete: () => {
          console.log('Successfully created singup.');
        },
      });
      this.isSubmitted=false;
  }
  //#endregion

  //#region  Delete
  openConfirmDeleteModal(contributionId: any) {
    this.deleteModal
      .open(this.confirmDeleteTemplate, { keyboard: false, backdrop: 'static' })
      .result.then(
        (result) => {
          if (result === 'confirmed') {
            this.onDeleteContribution(contributionId);
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

  onDeleteContribution(signupId: any) {
    if (signupId > 0) {
      this.meetingSignupsService
        .deleteMeetingSignup(signupId)
        .pipe(
          switchMap((iSignups) => {
            this.iSignups = iSignups;
            this.closeModal();
            return of(this.iSignups);
          })
        )
        .subscribe({
          next: (iSignups: ISignups) => {
            console.log('Successfully deleted signups');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully deleted signups.');
          },
        });
    }
  }
  //#endregion
  closeModal() {
    this.activeModal.close();
  }
}
