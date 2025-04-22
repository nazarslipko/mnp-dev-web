import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  NgbActiveModal,
  NgbDatepickerModule,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { IComponent } from '../../../../../core/models/IComponent';
import { IContact } from '../../../../../core/models/IHelpers';
import { ProfileService } from '../../../../../data/utils/profile.service';
import { ActivatedRoute } from '@angular/router';
import { MeetingComponentService } from '../../../../../data/services/meeting.component.service';
import { HelperService } from '../../../../../data/utils/helper.service';
import { CommonModule } from '@angular/common';
import { lastValueFrom, of, switchMap } from 'rxjs';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-meeting-components',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgbDatepickerModule],
  templateUrl: './meeting-components.component.html',
  styleUrl: './meeting-components.component.css',
})
export class MeetingComponentsComponent implements OnInit {
  componentsForm!: FormGroup;
  iContact: IContact;
  dateError: any;
  @Input() meetingId: any;
  @Input() meetingComponentId: any;
  @Input() componentLookupTypeId: any;
  @Input() modalTitle: any;
  @ViewChild('confirmDelete') confirmDeleteTemplate: any;

  iComponent: IComponent = {
    MeetingComponentId: 0,
    MeetingId: 0,
    ComponentLookupTypeId: 0,
    Title: '',
    StartDate: null,
    EndDate: null,
    IsPublished: false,
    Contributions: [],
    Questionnaire: [],
    Signups: [],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: NonNullableFormBuilder,
    private profileService: ProfileService,
    private meetingComponentService: MeetingComponentService,
    private deleteModal: NgbModal,
    private helperService: HelperService
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {
    if (this.meetingComponentId === 0) {
      this.iComponent.MeetingId = this.meetingId;
      this.iComponent.ComponentLookupTypeId = this.componentLookupTypeId;
    } else {

      const data = await lastValueFrom(
        this.meetingComponentService.getMeetingComponent(
          this.meetingComponentId
        )
      );
      this.iComponent = data[0] as IComponent;
    }
    this.buildComponentsForm();
  }

  formatDate(date: any) {
    if (date) {
      const meetingDate = parseISO(date);
      // validate date input.
      const validDate = isNaN(meetingDate.getTime());
      if (!validDate) {
        return format(meetingDate, 'yyyy-MM-dd');
      } else return null;
    } else return null;
  }

  // meeting form
  buildComponentsForm() {
    this.componentsForm = this.formBuilder.group({
      MeetingComponentId: [this.iComponent.MeetingComponentId],
      MeetingId: [this.iComponent.MeetingId],
      ComponentLookupTypeId: [this.iComponent.ComponentLookupTypeId],
      Title: [
        this.iComponent.Title,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(4),
        ],
      ],

      StartDate: [
        this.formatDate(this.iComponent.StartDate),
        [Validators.required, this.validateDate],
      ],
      EndDate: [
        this.formatDate(this.iComponent.EndDate),
        [Validators.required, this.validateDate],
      ],
      IsPublished: [this.iComponent.IsPublished],
    });
  }
  // validate form
  componentsFormValidation(controlName: string, error: any) {
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
    const startDate = this.componentsForm.get('StartDate')?.value;
    const endDate = this.componentsForm.get('EndDate')?.value;
    const today = new Date().toISOString().split('T')[0];
    this.dateError = '';

    if (endDate < startDate && endDate !== '') {
      this.dateError = 'End date cannot be less than start date.';
      return;
    }
    if (startDate < today && startDate !== '') {
      this.dateError = 'Start date cannot be less than today date.';
      return;
    }
  }
  //#region  Create/update
  onCreateUpdateMeetingComponent() {
    // validate form
    if (!this.componentsForm.valid) {
      return this.componentsForm.markAllAsTouched();
    }

    this.iComponent.MeetingComponentId =
      this.componentsForm.get('MeetingComponentId')?.value;
    this.iComponent.MeetingId = this.componentsForm.get('MeetingId')?.value;
    this.iComponent.ComponentLookupTypeId = this.componentsForm.get(
      'ComponentLookupTypeId'
    )?.value;
    this.iComponent.Title = this.componentsForm.get('Title')?.value;
    this.iComponent.StartDate = this.componentsForm.get('StartDate')?.value;
    this.iComponent.EndDate = this.componentsForm.get('EndDate')?.value;
    this.iComponent.IsPublished = this.componentsForm.get('IsPublished')?.value;

    if (this.iComponent.MeetingComponentId > 0) {
      // edit
      this.meetingComponentService
        .updateMeetingComponent(this.iComponent)
        .pipe(
          switchMap((iComponent) => {
            this.iComponent = iComponent;
            this.closeModal();
            return of(this.iComponent);
          })
        )
        .subscribe({
          next: (iComponent: IComponent) => {
            console.log('Successfully updated meeting component');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully updated meeting component.');
          },
        });
    } else {
      // insert
      this.meetingComponentService
        .createMeetingComponent(this.iComponent)
        .pipe(
          switchMap((iComponent: IComponent) => {
            this.iComponent = iComponent;
            this.closeModal();
            return of(this.iComponent);
          })
        )
        .subscribe({
          next: (iComponent: IComponent) => {
            console.log('Successfully created meeting component.');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully created meeting component.');
          },
        });
    }
  }

  //#endregion
  //#region  Delete
  openConfirmDeleteModal(compenentId: any) {
    this.deleteModal
      .open(this.confirmDeleteTemplate, { keyboard: false, backdrop: 'static' })
      .result.then(
        (result) => {
          if (result === 'confirmed') {
            this.onDeleteMeetingComponent(compenentId);
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

  onDeleteMeetingComponent(compenentId: any) {
    if (compenentId > 0) {
      this.meetingComponentService
        .deleteMeetingComponent(compenentId)
        .pipe(
          switchMap((iComponent) => {
            this.iComponent = iComponent;
            this.closeModal();
            return of(this.iComponent);
          })
        )
        .subscribe({
          next: (iComponent: IComponent) => {
            console.log('Successfully deleted meeting component');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully deleted meeting component.');
          },
        });
    }
  }
  //#endregion
  closeModal() {
    this.activeModal.close();
  }
}
