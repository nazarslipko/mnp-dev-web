import { Component, Input, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { IQuestionnaireParticipant } from '../../../../../../../core/models/IQuestionnaireParticipant';
import { QuestionnaireParticipantService } from '../../../../../../../data/services/questionnaire.participant.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-questionnaire-participant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-questionnaire-participant.component.html',
  styleUrl: './view-questionnaire-participant.component.css',
})
export class ViewQuestionnaireParticipantComponent implements OnInit {
  contact: any; 
  @Input() modalTitle: any;
  @Input() participant: any;
  questionnaireParticipants: IQuestionnaireParticipant[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private questionnaireParticipantService: QuestionnaireParticipantService
  ) {}

  async ngOnInit() {
  this.contact =
    this.participant.Contact[0].FirstName +
    ' ' +
    this.participant.Contact[0].LastName;

    this.questionnaireParticipants = await lastValueFrom(
      this.questionnaireParticipantService.getQuestionnaireParticipantByContact(
         this.participant.Contact[0].UserId,
        this.participant.MeetingComponentId
       
      )
    );
  }
}
