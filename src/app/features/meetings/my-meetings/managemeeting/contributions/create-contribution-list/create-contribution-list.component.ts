import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IContact } from '../../../../../../core/models/IHelpers';
import { IContribution } from '../../../../../../core/models/IContribution';
import { LookupService } from '../../../../../../data/services/lookup.service';
import { MeetingComponentService } from '../../../../../../data/services/meeting.component.service';
import { MeetingContributionService } from '../../../../../../data/services/meeting.contribution.service';
import { HelperService } from '../../../../../../data/utils/helper.service';
import { MeetingService } from '../../../../../../data/services/meeting.service';
import { ProfileService } from '../../../../../../data/utils/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-contribution-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-contribution-list.component.html',
  styleUrl: './create-contribution-list.component.css',
})
export class CreateContributionListComponent implements OnInit {
  contributionForm!: FormGroup;
  iContact: IContact;
  isLoading: boolean = false;
  isSubmitted = false;
  subTitle = '';

  @Input() meetingId: any;
  @Input() meetingComponentId: any;
  @Input() meetingContributionId: any;
  @Input() modalTitle: any;
  @ViewChild('confirmDelete') confirmDeleteTemplate: any;

  iContribution: IContribution = {
    MeetingContributionId: 0,
    MeetingId: 0,
    MeetingComponentId: 0,
    ItemName: '',
    Quantity: 1,
    Measure: '',
    Category: '',
    IsMonetaryContribution: false,
    ShortDescription: '',
    LongDescription: '',
    CreatedUserId: 0,
    CreatedDate: null,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: NonNullableFormBuilder,
    private lookupService: LookupService,
    private meetingComponentService: MeetingComponentService,
    private meetingContributionService: MeetingContributionService,
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
    if (this.meetingContributionId === 0) {
      this.subTitle = 'Create a List of Items Needed';
      this.iContribution.MeetingId = this.meetingId;
      this.iContribution.MeetingComponentId = this.meetingComponentId;
    } else {
      this.subTitle = 'Edit';
      const contributionData = await lastValueFrom(
        this.meetingContributionService.getContribution(
          this.meetingContributionId
        )
      );

      this.iContribution = contributionData[0] as IContribution;
      this.iContribution.IsMonetaryContribution =
        this.iContribution.Category === 'Monetary' ? true : false;
    }
    this.buildContributionForm();

    // set form validation based on switch input behavior
    this.contributionForm
      .get('IsMonetaryContribution')
      ?.valueChanges.subscribe((checked) => {
        this.setContributionFormValidation(checked);
      });
  }

  // validate form
  contributionFormValidation(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }

  buildContributionForm() {
    this.contributionForm = this.formBuilder.group({
      MeetingContributionId: [this.iContribution.MeetingContributionId],
      MeetingComponentId: [this.iContribution.MeetingComponentId],
      MeetingId: [this.iContribution.MeetingId],
      ItemName: [this.iContribution.ItemName],
      Quantity: [this.iContribution.Quantity],
      Measure: [this.iContribution.Measure],
      Category: [this.iContribution.Category],
      ShortDescription: [this.iContribution.ShortDescription],
      LongDescription: [this.iContribution.LongDescription],
      IsMonetaryContribution: [this.iContribution.IsMonetaryContribution],
    });
  }

  setContributionFormValidation(isMonetaryContribution: boolean) { 

    if (isMonetaryContribution) {
      this.contributionForm.get('ItemName')?.clearValidators();
      this.contributionForm.get('Quantity')?.clearValidators();
      this.contributionForm.get('Measure')?.clearValidators();
      this.contributionForm.get('Category')?.clearValidators();
      this.contributionForm.get('ShortDescription')?.clearValidators();
      this.contributionForm
        .get('LongDescription')
        ?.setValidators([
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(10),
        ]);     
    } else {
      this.contributionForm
        .get('ItemName')
        ?.setValidators([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(4),
        ]);
      this.contributionForm
        .get('Quantity')
        ?.setValidators([Validators.required, Validators.minLength(1)]);
      this.contributionForm
        .get('Measure')
        ?.setValidators([Validators.minLength(2), Validators.maxLength(10)]);
      this.contributionForm
        .get('Category')
        ?.setValidators([Validators.maxLength(20), Validators.minLength(4)]);
      this.contributionForm
        .get('ShortDescription')
        ?.setValidators([Validators.maxLength(60), Validators.minLength(4)]);
      this.contributionForm.get('LongDescription')?.clearValidators();
      //this.contributionForm.updateValueAndValidity();      
    }
    this.contributionForm.updateValueAndValidity();  
    return this.contributionForm.markAsUntouched();

  }

  //#region  Create/update

  getFormData(): IContribution {
    const isMoneterayContribution = this.contributionForm.get(
      'IsMonetaryContribution'
    )?.value;
    this.iContribution.MeetingContributionId = this.contributionForm.get(
      'MeetingContributionId'
    )?.value;
    this.iContribution.MeetingComponentId =
      this.contributionForm.get('MeetingComponentId')?.value;
    this.iContribution.MeetingId =
      this.contributionForm.get('MeetingId')?.value;

    this.iContribution.ItemName = this.contributionForm.get('ItemName')?.value;
    this.iContribution.Quantity = this.contributionForm.get('Quantity')?.value;
    this.iContribution.Measure = this.contributionForm.get('Measure')?.value;
    this.iContribution.Category = isMoneterayContribution
      ? 'Monetary'
      : 'Items';
    this.iContribution.ShortDescription =
      this.contributionForm.get('ShortDescription')?.value;
    this.iContribution.LongDescription =
      this.contributionForm.get('LongDescription')?.value;
    this.iContribution.CreatedUserId = this.iContact.UserId;
    this.iContribution.CreatedDate = null;

    return this.iContribution;
  }

  // creates and saves contribution items and then
  onCreateUpdateAndCloseListingContributionItems() {
    // validate form
    if (!this.contributionForm.valid) {
      return this.contributionForm.markAllAsTouched();
    }

    this.isSubmitted=true;
    //get form data
    const formData = this.getFormData();

    if (formData.MeetingContributionId > 0) {
      // update
      this.meetingContributionService
        .updateContribution(formData)
        .pipe(
          switchMap((iContribution) => {
            this.iContribution = iContribution;
            this.closeModal();
            return of(this.iContribution);
          })
        )
        .subscribe({
          next: (iContribtution) => {
            console.log('Successfully updated contribution.');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully updated contribution.');
          },
        });
    } else {
      // insert
      this.meetingContributionService
        .saveContribution(formData)
        .pipe(
          switchMap((iContribution: IContribution) => {
            this.iContribution = iContribution;
            this.closeModal();
            return of(this.iContribution);
          })
        )
        .subscribe({
          next: (iContribution: IContribution) => {
            console.log('Successfully created contribution.');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully created contribution.');
          },
        });
    }
    this.isSubmitted=false;
  }

  // Saves and resets form to add more items on list

  onSaveAndListMoreContributionItems() {
    // validate form
    if (!this.contributionForm.valid) {
      return this.contributionForm.markAllAsTouched();
    }
this.isSubmitted=true;
    //get Form Data
    const formData = this.getFormData();
    // insert
    this.meetingContributionService
      .saveContribution(formData)
      .pipe(
        switchMap((iContribution: IContribution) => {
          this.iContribution = iContribution;
          // resest form
          this.contributionForm.reset();
          return of(this.iContribution);
        })
      )
      .subscribe({
        next: (iContribution: IContribution) => {
          console.log('Successfully created contribution.');
        },
        error: (err: any) => {
          // display api error
          console.log(err);
        },
        complete: () => {
          console.log('Successfully created contribution.');
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

  onDeleteContribution(contributionId: any) {
    if (contributionId > 0) {
      this.meetingContributionService
        .deleteContribution(contributionId)
        .pipe(
          switchMap((iContribution) => {
            this.iContribution = iContribution;
            this.closeModal();
            return of(this.iContribution);
          })
        )
        .subscribe({
          next: (iContribution: IContribution) => {
            console.log('Successfully deleted contribution');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully deleted contribution.');
          },
        });
    }
  }
  //#endregion
  closeModal() {
    this.activeModal.close();
  }
}
