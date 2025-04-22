import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMeeting } from '../../../../core/models/IMeeting';
import { MeetingService } from '../../../../data/services/meeting.service';
import { CommonModule } from '@angular/common';
import { forkJoin, lastValueFrom, of, switchMap } from 'rxjs';
import { MeetingComponentService } from '../../../../data/services/meeting.component.service';
import { IComponent } from '../../../../core/models/IComponent';
import {
  AbstractControl,
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IQuestionnaire } from '../../../../core/models/IQuestionnaire';
import { MeetingQuestionnaireService } from '../../../../data/services/meeting.questionnaire.service';
import { IQuestionnaireParticipant } from '../../../../core/models/IQuestionnaireParticipant';
import { debug } from 'node:console';
import { ProfileService } from '../../../../data/utils/profile.service';
import { IContact } from '../../../../core/models/IHelpers';
import { QuestionnaireParticipantService } from '../../../../data/services/questionnaire.participant.service';
import { IContributionParticipant } from '../../../../core/models/IContributionParticipant';
import { ContributionParticipantService } from '../../../../data/services/contribution.participant.service';
import { ISignupsParticipant } from '../../../../core/models/ISignupsParticipant';
import { SignupsParticipantService } from '../../../../data/services/signups.participant.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css',
})
export class MeetingComponent implements OnInit {
  participantQuestionnaireForm!: FormGroup;
  participantContributionForm!: FormGroup;
  participantSignupsForm!: FormGroup;
  selectedComponent: string = '';// for now
  isSelectedComponent: boolean = false;
  buttonName: string = 'Sign up'
  signupTimeSlot: string = '';
  totalContributionQuantity: string = '';
  totalSignups: string = '';
  norecordfound: string = 'No record found.';


  iContact: IContact;

  meetingComponents: any[] = [];

  meetingId: any;
  contributionComponentLookupTypeId: any;
  signupComponentLookupTypeId: any;
  questionnaireComponentLookupTypeId: any;
  meetingContributionComponents: IComponent[] = [];
  meetingQuestionnaireComponents: IComponent[] = [];
  meetingSignupsComponents: IComponent[] = [];
  meeting: any;
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  meetingContributionContribitors: any[] = [];
  meetingSignupParticipants: any[] = [];
  signupTitle: string = ''
  contributionTitle: string = '';
  submitButtonName: string = 'Submit';
  published: number = 1;

  /*
  isParticipantQuestionnaireForm: boolean = false;
  isParticipantContributionForm: boolean = false;
  isParticipantSignupForm: boolean = false;
  */


  iQuestionnaireParticipant: IQuestionnaireParticipant = {
    MeetingQuestionnaireParticipantId: 0,
    UserId: 0,
    MeetingComponentId: 0,
    MeetingQuestionnaireId: 0,
    QuestionAnswer: '',
    CreatedDate: null,
  };

  iContributionParticipant: IContributionParticipant = {
    MeetingContributionParticipantId: 0,
    UserId: 0,
    MeetingComponentId: 0,
    MeetingContributionId: 0,
    Amount: 0,
    Quantity: 0
  }

  iSignupsParticipant: ISignupsParticipant = {
    MeetingSignupParticipantId: 0,
    UserId: 0,
    MeetingComponentId: 0,
    MeetingSignupId: 0,
    CreatedUserId: 0,
    CreatedDate: null,
    ModifiedUserId: 0,
    ModifiedDate: null
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private meetingService: MeetingService,
    private meetingComponentService: MeetingComponentService,
    private formBuilder: NonNullableFormBuilder,
    private profileService: ProfileService,
    private questionnaireParticipantService: QuestionnaireParticipantService,
    private contributionParticipantService: ContributionParticipantService,
    private signupsParticipantService: SignupsParticipantService,
    private modal: NgbModal,
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {

    this.activateRoute.queryParams.subscribe((params) => {
      this.meetingId = params['id'];
    });
    if (this.meetingId > 0) {
      this.meeting = await lastValueFrom(
        this.meetingService.getMeeting(this.meetingId)
      );
    }
   
    if (this.meeting) {
      // retrieve meeting components
      const components = await lastValueFrom(
        this.meetingComponentService.getMeetingComponents(
          this.meeting[0].MeetingId
        )
      );

      //remove duplicates
      type componentWithIds = { ComponentLookupTypeId: string | number } & Record<string, any>;
      const removeDuplicateComponents = (componentArray: componentWithIds[]): componentWithIds[] => {
        const uniqueComponentMap = new Map<string | number, componentWithIds>();
        for (const component of componentArray) {
          //keep first object
          if (!uniqueComponentMap.has(component.ComponentLookupTypeId)) {
            uniqueComponentMap.set(component.ComponentLookupTypeId, component);
          }
        }
        return Array.from(uniqueComponentMap.values());
      };

      this.meetingComponents = removeDuplicateComponents(components);

      // etract meeting component by type
      if (this.meetingComponents) {        
        this.meetingComponents.map((obj) => {
          const componentType = obj['ComponentLookup'];
          // contributions       
          if (componentType[0]?.LookupName.startsWith('Contributions')) {
            this.contributionComponentLookupTypeId = componentType[0]?.LookupId;
            if (!this.isSelectedComponent){
              this.isSelectedComponent=true;
              this.selectedComponent = 'contribution'
            }else{
              this.isSelectedComponent = false;
            }         
          }

          // questionnaire
          if (componentType[0]?.LookupName.startsWith('Questionnaire')) {
            this.questionnaireComponentLookupTypeId = componentType[0]?.LookupId;
            if (!this.isSelectedComponent) {
              this.isSelectedComponent = true;
              this.selectedComponent = 'questionnaire'
            } else {
              this.isSelectedComponent = false;
            } 
          }

          //signups     
          if (componentType[0]?.LookupName.startsWith('Signups')) {
            this.signupComponentLookupTypeId = componentType[0]?.LookupId;
            if (!this.isSelectedComponent) {
              this.isSelectedComponent = true;
              this.selectedComponent = 'signups'
            } else {
              this.isSelectedComponent = false;
            } 
          }
        });
      }

      // retrieve components by types
      this.isLoading = true;
      forkJoin([

        (this.meetingContributionComponents =
          this.contributionComponentLookupTypeId > 0
            ? await lastValueFrom(
              this.meetingComponentService.getMeetingComponentsByLookup(
                this.meetingId,
                this.contributionComponentLookupTypeId,
                this.published
              )
            )
            : []),

        (this.meetingQuestionnaireComponents =
          this.questionnaireComponentLookupTypeId > 0
            ? await lastValueFrom(
              this.meetingComponentService.getMeetingComponentsByLookup(
                this.meetingId,
                this.questionnaireComponentLookupTypeId,
                this.published
              )
            )
            : []),
        (this.meetingSignupsComponents =
          this.signupComponentLookupTypeId > 0
            ? await lastValueFrom(
              this.meetingComponentService.getMeetingComponentsByLookup(
                this.meetingId,
                this.signupComponentLookupTypeId,
                this.published
              )
            )
            : []),
      ]).subscribe({
        next: (component) => {
          console.log('Succeeded in retrieving meeting components');
          // loading
          this.isLoading = false;
        },
        error:(err) => {
          console.error('Error retrieving meeting components: ' + err);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }

    this.buildParticipantQuestionnaireForm();
    this.buildParticipantContributionForm();
    this.buildParticipantSignupForm();
    this.enableComponentForms();
  }

  onSelectComponent(event: any) {
    this.selectedComponent = event.target.value;
    this.enableComponentForms()
  }

  enableComponentForms() {

    switch (this.selectedComponent) {
      case 'contribution': {

        this.submitButtonName = 'Contribute';
        // participantContributionForm
        Object.keys(this.participantContributionForm.controls).forEach((control) => {
          this.participantContributionForm.controls[control].enable();
        });

        // participantQuesstionnaireForm
        Object.keys(this.participantQuestionnaireForm.controls).forEach((control) => {
          this.participantQuestionnaireForm.controls[control].disable();
        });
        // participantSignupForm
        Object.keys(this.participantSignupsForm.controls).forEach((control) => {
          this.participantSignupsForm.controls[control].disable();
        });
        break;

      }
      case 'questionnaire': {
        this.submitButtonName = 'Submit';
        // participantQuesstionnaireForm
        Object.keys(this.participantQuestionnaireForm.controls).forEach((control) => {
          this.participantQuestionnaireForm.controls[control].enable();
        });

        // participantContributionForm
        Object.keys(this.participantContributionForm.controls).forEach((control) => {
          this.participantContributionForm.controls[control].disable();
        });

        // participantSignupForm
        Object.keys(this.participantSignupsForm.controls).forEach((control) => {
          this.participantSignupsForm.controls[control].disable();
        });
        break;
      }
      case 'signups': {

        this.submitButtonName = 'Signup';
        // participantSignupForm
        Object.keys(this.participantSignupsForm.controls).forEach((control) => {
          this.participantSignupsForm.controls[control].enable();
        });

        // participantContributionForm
        Object.keys(this.participantContributionForm.controls).forEach((control) => {
          this.participantContributionForm.controls[control].disable();
        });
        // participantQuesstionnaireForm
        Object.keys(this.participantQuestionnaireForm.controls).forEach((control) => {
          this.participantQuestionnaireForm.controls[control].disable();
        });
        break;
      }
    }
  }

  //forms

  //#region  Participant Signups Form
  buildParticipantSignupForm() { 
    this.participantSignupsForm = this.formBuilder.group({});
    this.meetingSignupsComponents[0]?.Signups?.flatMap((signup) => {
      this.participantSignupsForm.addControl(
        'checkbox-' + signup.MeetingSignupId.toString(),
        //add form control and validation
        this.formBuilder.control('')
      );
    });
  }
  //#endregion

  //#region  Participant Contribution Form
  buildParticipantContributionForm() {  
    this.participantContributionForm = this.formBuilder.group({});
    this.meetingContributionComponents[0]?.Contributions?.flatMap((contribution) => {
      this.participantContributionForm.addControl(
        contribution.MeetingContributionId.toString(),
        //add form control and validation
        this.formBuilder.control(this.iContributionParticipant.MeetingContributionId, [Validators.pattern("^[0-9]*$"), Validators.maxLength(3)])

      );
    });
  }
  //#endregion

  // #region Questionnaire Participant form
  buildParticipantQuestionnaireForm() {  
    this.participantQuestionnaireForm = this.formBuilder.group({});
    this.meetingQuestionnaireComponents[0]?.Questionnaire?.forEach(
      (question) => {
        this.participantQuestionnaireForm.addControl(
          question?.MeetingQuestionnaireId.toString(),
          this.createQuestionControl(question)
        );
      }
    );
  }

  // Create form control for each question
  createQuestionControl(question: any) {
    let validators;
    if (question.QuestionType === 'MultipleChoices') {

      validators = question.Required ? [this.checkboxValidator()] : [];

      return this.formBuilder.control([], validators);
    } else if (
      question.QuestionType === 'SingleChoice' ||
      question.QuestionType === 'Dropdownlist' ||
      question.QuestionType === 'TrueFalse'
    ) {
      validators = question.Required ? Validators.required : [];
      return this.formBuilder.control('', validators);
    } else if (question.QuestionType === 'LongAnswer') {
      // textarea
      validators = question.Required
        ? [Validators.required, Validators.minLength(150)]
        : [];
      return this.formBuilder.control('', validators);
    } else {
      // return text box: 'ShortAsnswer'
      validators = question.Required
        ? [Validators.required, Validators.minLength(60)]
        : [];
      return this.formBuilder.control('', validators);
    }
  }

  // Helper to split options
  splitOptions(options: string): string[] {
    return options.split(',').map((option) => option.trim());
  }

  // checkbox validator
  checkboxValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const value = control.value;
      if (Array.isArray(value) && value.length > 0) {
        return null; // Valid
      }
      return { required: true }; // Invalid
    };
  }

  onCheckboxChange(event: any, questionId: number) {
    const control = this.participantQuestionnaireForm.get(
      questionId.toString()
    );

    if (control) {
      let selectedOptions = control?.value || [];

      // ensure it is always an array
      if (!Array.isArray(selectedOptions)) {
        selectedOptions = [];
      }

      if (event.target.checked) {
        // add selected value return;
        selectedOptions.push(event.target.value);
      } else {
        // remove unselected value
        selectedOptions = selectedOptions.filter((option: any) => option !== event.target.value);
      }

      // update form
      control.setValue(selectedOptions);
      control.markAsTouched(); // ensure validation is triggered
      control?.updateValueAndValidity(); // force validation check
    } else {
      console.error(
        `Form control with Id= '${questionId.toString()}' not found.`
      );
    }
  }

  // #endregion

  onSubmit() {
    this.isSubmitted = false;

    if (this.selectedComponent === 'contribution') {

      //#region  Contribution form
      if (this.participantContributionForm.invalid) {
        return this.participantContributionForm.markAllAsTouched();
      }
      const contributionItems = this.meetingContributionComponents[0]?.Contributions?.filter(c => c.Category === 'Items');

      // extract Contribution form data
      const contributionParticipant =
        contributionItems?.filter(c => c.MeetingComponentId > 0)?.map((contribution) => {
          const contributionValue = this.participantContributionForm.get(
            contribution?.MeetingContributionId.toString()
          )?.value;

          return (this.iContributionParticipant = {
            MeetingContributionParticipantId: 0,
            UserId: this.iContact.UserId,
            MeetingComponentId: contribution.MeetingComponentId,
            MeetingContributionId: contribution.MeetingContributionId,
            Amount: 0,
            Quantity: contributionValue,
            CreatedDate: null,
            ModifiedDate: null
          });
        });

      this.isSubmitted = true;

      // send to api endpoint
      this.contributionParticipantService
        .saveContributionParticipant(contributionParticipant)
        .pipe(
          switchMap((iContributionParticipant: any) => {
            this.iContributionParticipant = iContributionParticipant;

            // resest form      
            this.participantContributionForm.reset();
            return of(this.iContributionParticipant);
          })
        )
        .subscribe({
          next: (iContributionParticipant: any) => {
            console.log('Successfully saved participant contribution response.');
          },
          error: (err: any) => {
            // display api error
            console.error('Error saving participant contribution responses:', err);
          },
          complete: () => {
            console.log('Successfully saved participant contribution response.');
          },
        });

      //#endregion
    } else if (this.selectedComponent === 'questionnaire') {

      //#region  Questionnaire form
      if (this.participantQuestionnaireForm.invalid) {
        return this.participantQuestionnaireForm.markAllAsTouched();
      }

      // extract questionniare form data
      const questionnaireParticipant =
        this.meetingQuestionnaireComponents[0]?.Questionnaire?.map((question) => {
          const answer = this.participantQuestionnaireForm.get(
            question?.MeetingQuestionnaireId.toString()
          )?.value;

          // get question answer
          const questionAnswer =
            question.QuestionType === 'MultipleChoices'
              ? answer.join(',')
              : answer;

          return (this.iQuestionnaireParticipant = {
            MeetingQuestionnaireParticipantId: 0,
            UserId: this.iContact.UserId,
            MeetingComponentId: question.MeetingComponentId,
            MeetingQuestionnaireId: question.MeetingQuestionnaireId,
            QuestionAnswer: questionAnswer,
            CreatedUserId: this.iContact.UserId,
            CreatedDate: null,
          });
        });

      this.isSubmitted = true;

      // insert
      this.questionnaireParticipantService
        .saveQuestionnaireParticipant(questionnaireParticipant)
        .pipe(
          switchMap((iQuestionnaireParticipant: any) => {
            this.iQuestionnaireParticipant = iQuestionnaireParticipant;
            // resest form       
            this.resetForm();

            return of(this.iQuestionnaireParticipant);
          })
        )
        .subscribe({
          next: (iQuestionnaireParticipant: any) => {
            console.log('Successfully saved participant questionnaire response.');
          },
          error: (err: any) => {
            // display api error
            console.error('Error saving responses:', err);
          },
          complete: () => {
            console.log('Successfully saved participant questionnaire response.');
          },
        });

      //#endregion
    } else {

      //#region  signups form
      if (this.participantSignupsForm.invalid) {
        return this.participantSignupsForm.markAllAsTouched();
      }

      // extract Signup form data
      const signupParticipant = this.meetingSignupsComponents[0]?.Signups?.map((signup) => {

        // get signup value    
        const signupValue = (this.participantSignupsForm.get('checkbox-' + signup?.MeetingSignupId.toString())?.value ? signup?.MeetingSignupId : 0);

        // model          
        return (this.iSignupsParticipant = {
          MeetingSignupParticipantId: 0,
          UserId: this.iContact.UserId,
          MeetingComponentId: signup.MeetingComponentId,
          MeetingSignupId: signupValue,
          CreatedUserId: this.iContact.UserId,
          CreatedDate: null,
          ModifiedDate: null
        });
      });

      this.isSubmitted = true;

      // send to api endpoint
      this.signupsParticipantService
        .saveSignupParticipant(signupParticipant)
        .pipe(
          switchMap((iSignupsParticipant: any) => {
            this.iSignupsParticipant = iSignupsParticipant;

            // resest form      
            this.participantSignupsForm.reset();
            return of(this.iSignupsParticipant);
          })
        )
        .subscribe({
          next: (iSignupsParticipant: any) => {
            console.log('Successfully saved participant signups response.');
          },
          error: (err: any) => {
            // display api error
            console.error('Error saving participant signups responses:', err);
          },
          complete: () => {
            console.log('Successfully saved participant signups response.');
          },
        });
      //#endregion
    }
    this.isSubmitted = false;
  }

  // reset form
  resetForm() {
    this.participantQuestionnaireForm.reset();
    this.meetingQuestionnaireComponents[0]?.Questionnaire?.map((question) => {
      if (question.QuestionType === 'MultipleChoices') {
        const answer = this.participantQuestionnaireForm.get(
          question?.MeetingQuestionnaireId.toString()
        )?.setValue([]);
      }

    });
  }

  //#region Contribution Partitipants

  async openContributorModal(contribution: any, participantModal: any) {

    if (contribution) {
      this.contributionTitle = contribution.ItemName;
      this.meetingContributionContribitors = await lastValueFrom(
        this.contributionParticipantService.getContributionParticipants(
          contribution.MeetingContributionId,
          contribution.MeetingComponentId
        )
      );

      const totalContribution = this.meetingContributionContribitors.reduce((sum, contribution) => sum + contribution.Quantity, 0);
      this.totalContributionQuantity = totalContribution + ' out of ' + contribution.Quantity;
      if (contribution.Quantity === totalContribution) {
        this.norecordfound = 'Contribution for this item is filled. Thank you for willing to help.'
        this.meetingContributionContribitors = [];
      }

      const options: NgbModalOptions = {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        centered: true,
      };
      this.modal.open(participantModal, options);
    }
  }

  async cancelContribution(contribution: any) {
    if (contribution) {
      if (this.iContact.UserId === contribution.UserId) {
        this.meetingContributionContribitors = await lastValueFrom(
          this.contributionParticipantService.deleteContributionParticipant(
            contribution.MeetingContributionParticipantId
          )
        );
      }
    }
    this.onCloseModal();
  }

  onCloseModal() {
    this.modal.dismissAll();
  }
  //#endregion

  async openSignupModal(signup: any, signupModal: any) {

    if (signup) {
      this.signupTitle = signup.Title;
      this.signupTimeSlot = (signup?.TimeSlot?.StartTime + '&nbsp;-&nbsp;' + signup?.TimeSlot?.StartTime);

      this.meetingSignupParticipants = await lastValueFrom(
        this.signupsParticipantService.getSignupParticipants(
          signup.MeetingSignupId,
          signup.MeetingComponentId
        )
      );

      this.totalSignups = this.meetingSignupParticipants.length + ' out of ' + signup.PeopleNeeded;

      if (signup.PeopleNeeded === this.meetingSignupParticipants.length) {
        this.norecordfound = 'Signup for this time slot is filled. Thank you for willing to help.'
        this.meetingSignupParticipants = [];
      }
      const options: NgbModalOptions = {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
        centered: true,
      };

      this.modal.open(signupModal, options);
    }
  }

  async cancelSignup(signup: any) {
    if (signup) {
      if (this.iContact.UserId === signup.UserId) {
        this.meetingSignupParticipants = await lastValueFrom(
          this.signupsParticipantService.deleteSignupParticipant(
            signup.MeetingSignupParticipantId
          )
        );
      }
    }
    this.onCloseModal();
  }

}
