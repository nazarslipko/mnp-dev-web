import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IContact } from '../../../../../../core/models/IHelpers';
import { forkJoin, lastValueFrom } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from '../../../../../../data/utils/helper.service';
import { ProfileService } from '../../../../../../data/utils/profile.service';
import { QuestionnaireParticipantService } from '../../../../../../data/services/questionnaire.participant.service';
import { IQuestionnaireParticipant } from '../../../../../../core/models/IQuestionnaireParticipant';
import { CommonModule } from '@angular/common';
import { ViewQuestionnaireParticipantComponent } from './view-questionnaire-participant/view-questionnaire-participant.component';

@Component({
  selector: 'app-view-questionnaire-participants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-questionnaire-participants.component.html',
  styleUrl: './view-questionnaire-participants.component.css',
})
export class ViewQuestionnaireParticipantsComponent implements OnInit {
  // contributionForm!: FormGroup;
  iContact: IContact;
  isLoading: boolean = false;
  nodatasaved = '';
  subTitle = '';

  @Input() meetingId: any;
  @Input() meetingComponentId: any;
  @Input() meetingQuestionnaireId: any;
  @Input() modalTitle: any;

  questionnaireParticipants: IQuestionnaireParticipant[] = [];
  questionnaireParticipantNames: any[] = [];
  iQuestionnaire: IQuestionnaireParticipant = {
    MeetingQuestionnaireParticipantId: 0,
    UserId: 0,
    MeetingComponentId: 0,
    MeetingQuestionnaireId: 0,
    QuestionAnswer: '',
    CreatedUserId: 0,
    Contact: [],
    Questionnaire: [],
  };

  constructor(
    public activeModal: NgbActiveModal,
    private questionnaireParticipantService: QuestionnaireParticipantService,
    private helperService: HelperService,
    private profileService: ProfileService,
    private modalService: NgbModal
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {
    // get signups records
    if (this.meetingComponentId > 0) {
      forkJoin([
        (this.questionnaireParticipants = await lastValueFrom(
          this.questionnaireParticipantService.getQuestionnaireParticipants(
            this.meetingQuestionnaireId,
            this.meetingComponentId
          )
        )),
        // initialize
        (this.questionnaireParticipantNames = await lastValueFrom(
          this.questionnaireParticipantService.getQuestionnaireParticipantByContact(
            0,
            this.meetingComponentId
          )
        )),
      ]);
    }
  }

  // display participant
  openQuestionnaireParticipantModal(participant: any) {
    if (participant) {
      const modalRef = this.modalService.open(
        ViewQuestionnaireParticipantComponent,
        {
          size: 'xl',
          keyboard: false,
          backdrop: 'static',
          windowClass: 'View Questionnaire Participant modal',
        }
      );
      modalRef.componentInstance.participant = participant;
      modalRef.componentInstance.modalTitle = this.modalTitle;
      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    }
  }

  // send email. Temporally solution. We will use the note to tie into app's messaging.
  SendEmail(email: any, subject: any) {
    const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailto;
  }

  //download csv file
  onDownloadCSV() {
    const signupsList = this.questionnaireParticipants.map((question) => {
      return {
        Participant:
          question.Contact?.[0]?.FirstName +
          ' ' +
          question.Contact?.[0]?.LastName,
        Question: question.Questionnaire?.[0]?.Question,
        Answers: question.QuestionAnswer,
        QuestionType: question.Questionnaire?.[0]?.QuestionType,
      };
    });

    try {
      this.helperService.downloadCSV(signupsList, 'questionnaire.csv');
    } catch (ex) {
      console.log('Could not download Singups list. Error: ' + ex);
    }
  }
}
