import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  IContact,
  IQuestionType,
} from '../../../../../../core/models/IHelpers';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IQuestionnaire } from '../../../../../../core/models/IQuestionnaire';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../../../../../data/services/lookup.service';
import { MeetingComponentService } from '../../../../../../data/services/meeting.component.service';
import { HelperService } from '../../../../../../data/utils/helper.service';
import { MeetingService } from '../../../../../../data/services/meeting.service';
import { ProfileService } from '../../../../../../data/utils/profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingQuestionnaireService } from '../../../../../../data/services/meeting.questionnaire.service';
import { lastValueFrom, of, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-questionnaire',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-questionnaire.component.html',
  styleUrl: './create-questionnaire.component.css',
})
export class CreateQuestionnaireComponent implements OnInit {
  questionnaireForm!: FormGroup;
  iContact: IContact;
  isLoading: boolean = false;
  hideShowAnswerOptionsControl = false;
  isSubmitted = false;
  isNewQuestion = false;
  subTitle = '';
  signupTimeError: any;

  questionTypes: IQuestionType[] = [];
  @Input() meetingId: any;
  @Input() meetingComponentId: any;
  @Input() meetingQuestionnaireId: any;
  @Input() modalTitle: any;
  @ViewChild('confirmDelete') confirmDeleteTemplate: any;

  iQuestionnaire: IQuestionnaire = {
    MeetingQuestionnaireId: 0,
    MeetingId: 0,
    MeetingComponentId: 0,
    Question: '',
    Description: '',
    AnswerOptions: '',
    QuestionType: '',
    SequenceNumber: 1,
    Required: false,
    CreatedUserId: 0,
    CreatedDate: null,
    ModifiedUserId: 0,
    ModifiedDate: null,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: NonNullableFormBuilder,
    private meetingQuestionnaireService: MeetingQuestionnaireService,
    private helperService: HelperService,
    private profileService: ProfileService,
    private deleteModal: NgbModal
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {
    this.questionTypes = this.helperService.getQuestionTypes();
    if (this.meetingQuestionnaireId === 0) {
      this.subTitle = 'List Question';
      this.iQuestionnaire.MeetingId = this.meetingId;
      this.iQuestionnaire.MeetingComponentId = this.meetingComponentId;
      this.isNewQuestion = true;
    } else {
      this.isNewQuestion = false;

      this.subTitle = 'Edit Question';
      const questionnaireData = await lastValueFrom(
        this.meetingQuestionnaireService.getQuestionnaire(
          this.meetingQuestionnaireId
        )
      );

      this.iQuestionnaire = questionnaireData[0] as IQuestionnaire;
    }

    this.buildQuestionnaireForm();

    // only get new sequence number if it is a new question

    if (this.isNewQuestion) {
      await this.setSequenceNumberControlValue();
    }

    // on dropdown change
    this.questionnaireForm
      .get('QuestionType')
      ?.valueChanges.subscribe((value) => {
        this.toggleAnswerOptionsControl(value);
      });
  }

  async setSequenceNumberControlValue() {
    const sequenceNumber = await lastValueFrom(
      this.meetingQuestionnaireService.getQuestionnaireSequenceNumber(
        this.meetingComponentId
      )
    );

    this.questionnaireForm
      .get('SequenceNumber')
      ?.patchValue(sequenceNumber[0]?.SequenceNumber + 1);
  }

  // hide or show div
  get questionTypeSelectedValue() {
    const answerOptions = this.questionnaireForm.get('QuestionType')?.value;

    if (
      answerOptions.toLowerCase() === 'truefalse' ||
      answerOptions.toLowerCase() === 'shortanswer' ||
      answerOptions.toLowerCase() === 'longanswer'
    ) {
      this.hideShowAnswerOptionsControl = true;
    } else {
      this.hideShowAnswerOptionsControl = false;
    }

    return this.hideShowAnswerOptionsControl;
  }

  // toggle control answers
  toggleAnswerOptionsControl(value: any) {
    const answerOptionsControl = this.questionnaireForm.get('AnswerOptions');
    const answerOptionsRegex = '^([a-zA-Z0-9]+)(,[a-zA-Z0-9]+)*$';

    if (
      value.toLowerCase() === 'truefalse' ||
      value.toLowerCase() === 'shortanswer' ||
      value.toLowerCase() === 'longanswer'
    ) {
      answerOptionsControl?.clearValidators();
      answerOptionsControl?.reset();
    } else {
      answerOptionsControl?.setValidators([
        Validators.required,
        Validators.maxLength(80),
        Validators.minLength(4),
        Validators.pattern(answerOptionsRegex),
      ]);
    }
    answerOptionsControl?.updateValueAndValidity();
  }

  // validate form
  questionnaireFormValidation(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }

  buildQuestionnaireForm() {
    this.questionnaireForm = this.formBuilder.group({
      MeetingQuestionnaireId: [this.iQuestionnaire.MeetingQuestionnaireId],
      MeetingComponentId: [this.iQuestionnaire.MeetingComponentId],
      MeetingId: [this.iQuestionnaire.MeetingId],
      Question: [
        this.iQuestionnaire.Question,
        [
          Validators.required,
          Validators.maxLength(80),
          Validators.minLength(4),
        ],
      ],
      AnswerOptions: [this.iQuestionnaire.AnswerOptions],

      QuestionType: [this.iQuestionnaire.QuestionType, [Validators.required]],
      SequenceNumber: [
        this.iQuestionnaire.SequenceNumber,
        [Validators.required],
      ],

      Description: [
        this.iQuestionnaire.Description,
        [Validators.maxLength(50), Validators.minLength(4)],
      ],
      Required: [this.iQuestionnaire.Required],
    });
  }

  //#region  Create/update

  getFormData(): IQuestionnaire {
    this.iQuestionnaire.MeetingQuestionnaireId = this.questionnaireForm.get(
      'MeetingQuestionnaireId'
    )?.value;
    this.iQuestionnaire.MeetingComponentId =
      this.questionnaireForm.get('MeetingComponentId')?.value;
    this.iQuestionnaire.MeetingId =
      this.questionnaireForm.get('MeetingId')?.value;

    this.iQuestionnaire.Question =
      this.questionnaireForm.get('Question')?.value;

    this.iQuestionnaire.Description =
      this.questionnaireForm.get('Description')?.value;
    this.iQuestionnaire.AnswerOptions =
      this.questionnaireForm.get('QuestionType')?.value === 'TrueFalse'
        ? 'Yes,No'
        : this.questionnaireForm.get('AnswerOptions')?.value;

    this.iQuestionnaire.QuestionType =
      this.questionnaireForm.get('QuestionType')?.value;

    this.iQuestionnaire.SequenceNumber =
      this.questionnaireForm.get('SequenceNumber')?.value;
    this.iQuestionnaire.Required =
      this.questionnaireForm.get('Required')?.value;

    this.iQuestionnaire.CreatedUserId = this.iContact.UserId;

    this.iQuestionnaire.ModifiedUserId = this.iContact.UserId;

    this.iQuestionnaire.CreatedDate = null;
    this.iQuestionnaire.ModifiedDate = null;

    return this.iQuestionnaire;
  }

  // creates and saves contribution items and then
  onCreateUpdateAndCloseListingContributionItems() {
    // validate form
    if (!this.questionnaireForm.valid) {
      return this.questionnaireForm.markAllAsTouched();
    }
    this.isSubmitted = true;
    //get form data
    const formData = this.getFormData();
    if (formData.MeetingQuestionnaireId > 0) {
      // update
      this.meetingQuestionnaireService
        .updateQuestionnaire(formData)
        .pipe(
          switchMap((iQuestionnaire: IQuestionnaire) => {
            this.iQuestionnaire = iQuestionnaire;
            this.closeModal();
            return of(this.iQuestionnaire);
          })
        )
        .subscribe({
          next: (iContribtution) => {
            console.log('Successfully updated questionnaire.');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully updated questionnaire.');
          },
        });
    } else {
      // insert
      this.meetingQuestionnaireService
        .saveQuestionnaire(formData)
        .pipe(
          switchMap((iQuestionnaire: IQuestionnaire) => {
            this.iQuestionnaire = iQuestionnaire;

            this.closeModal();
            return of(this.iQuestionnaire);
          })
        )
        .subscribe({
          next: (iQuestionnaire: IQuestionnaire) => {
            console.log('Successfully created questionnaire.');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully created questionnaire.');
          },
        });
    }
    this.isSubmitted = false;
  }

  // Saves and resets form to add more items on list

  onSaveAndListMoreContributionItems() {
    // validate form
    if (!this.questionnaireForm.valid) {
      return this.questionnaireForm.markAllAsTouched();
    }
    this.isSubmitted = true;
    //get Form Data
    const formData = this.getFormData();

    // insert
    this.meetingQuestionnaireService
      .saveQuestionnaire(formData)
      .pipe(
        switchMap((iQuestionnaire: IQuestionnaire) => {
          this.iQuestionnaire = iQuestionnaire;
          this.questionnaireForm.reset();
          this.setSequenceNumberControlValue();
          return of(this.iQuestionnaire);
        })
      )
      .subscribe({
        next: (iQuestionnaire: IQuestionnaire) => {
          console.log('Successfully created questionnaire.');
        },
        error: (err: any) => {
          // display api error
          console.log(err);
        },
        complete: () => {
          console.log('Successfully created questionnaire.');
        },
      });
    this.isSubmitted = false;
  }
  //#endregion

  //#region  Delete
  openConfirmDeleteModal(contributionId: any) {
    this.deleteModal
      .open(this.confirmDeleteTemplate, { keyboard: false, backdrop: 'static' })
      .result.then(
        (result) => {
          if (result === 'confirmed') {
            this.onDeleteQuestionnaire(contributionId);
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

  onDeleteQuestionnaire(questionnaireId: any) {
    if (questionnaireId > 0) {
      this.meetingQuestionnaireService
        .deleteQuestionnaire(questionnaireId)
        .pipe(
          switchMap((iQuestionnaire) => {
            this.iQuestionnaire = iQuestionnaire;
            this.closeModal();
            return of(this.iQuestionnaire);
          })
        )
        .subscribe({
          next: (iQuestionnaire: IQuestionnaire) => {
            console.log('Successfully deleted questionnaire.');
          },
          error: (err: any) => {
            // display api error
            console.log(err);
          },
          complete: () => {
            console.log('Successfully deleted questionnaire.');
          },
        });
    }
  }
  //#endregion
  closeModal() {
    this.activeModal.close();
  }
}
