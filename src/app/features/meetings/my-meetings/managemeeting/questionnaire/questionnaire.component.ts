import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IComponent } from '../../../../../core/models/IComponent';
import { lastValueFrom, switchMap } from 'rxjs';
import { MeetingComponentsComponent } from '../meeting-components/meeting-components.component';
import { ILookup } from '../../../../../core/models/ILookup';
import { IContact } from '../../../../../core/models/IHelpers';
import { MeetingComponentService } from '../../../../../data/services/meeting.component.service';
import { ProfileService } from '../../../../../data/utils/profile.service';
import { LookupService } from '../../../../../data/services/lookup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CreateQuestionnaireComponent } from './create-questionnaire/create-questionnaire.component';
import { ViewQuestionnaireParticipantsComponent } from './view-questionnaire-participants/view-questionnaire-participants.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-questionnaire',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './questionnaire.component.html',
  styleUrl: './questionnaire.component.css',
})
export class QuestionnaireComponent implements OnInit {
  @Input() meeting: any | null;
  iContact: IContact;
  meetingId: any = 0;
  componentLookupTypeId: any = 0;
  meetingQuestionnaireComponents: IComponent[] = [];
  data: any;
  published: number=0;
  iComponent: IComponent = {
    MeetingComponentId: 0,
    MeetingId: 0,
    ComponentLookupTypeId: 0,
    Title: '',
    StartDate: null,
    EndDate: null,
    IsPublished: false,
  };

  constructor(
    private modalService: NgbModal,
    private lookupService: LookupService,
    private meetingComponentService: MeetingComponentService,
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute
  ) {
    this.iContact = this.profileService.getProfile() as IContact;
  }

  async ngOnInit() {
    this.meetingId = this.activatedRoute.snapshot.queryParamMap.get('id');
    const componentCategory = await lastValueFrom(
      this.lookupService.getLookupByCategory('MeetingComponent')
    );

    if (componentCategory) {
      this.componentLookupTypeId = componentCategory.find((m) =>
        m.LookupName.startsWith('Questionnaire')
      )?.LookupId;

      if (this.componentLookupTypeId > 0) {
        this.meetingQuestionnaireComponents = await lastValueFrom(
          this.meetingComponentService.getMeetingComponentsByLookup(
            this.meetingId,
            this.componentLookupTypeId,
            this.published
          )
        );
      }
    }
  }

  //#region Open Contribution Component data
  // add/edit/delete meeting component

  openQuestionnaireComponentModal(componentId: any) {
    if (componentId > 0) {
    
      // edit
      const modalRef = this.modalService.open(MeetingComponentsComponent, {
        size: 'xl',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Edit Questionnaire Component modal',
      });

      modalRef.componentInstance.modalTitle = 'Edit Questionnaire Component';
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId = componentId;
      modalRef.componentInstance.componentLookupTypeId =
        this.componentLookupTypeId;

      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    } else {
      //create

      const modalRef = this.modalService.open(MeetingComponentsComponent, {
        size: 'xl',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Create Questionnaire Component modal',
      });
      modalRef.componentInstance.modalTitle = 'Create Questionnaire Component';
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId = 0;
      modalRef.componentInstance.componentLookupTypeId =
        this.componentLookupTypeId;
      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    }
  }

  //#endregion

  //#region  Open Create Contribution List

  // add/edit/delete meeting component
  openQuestionnaireListModal(component: any, meetingQuestionnaireId?: any) {
    const componentData = component as IComponent;
    if (componentData?.MeetingComponentId > 0 && meetingQuestionnaireId > 0) {
      // edit
      const modalRef = this.modalService.open(CreateQuestionnaireComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Contributions modal',
      });

      modalRef.componentInstance.modalTitle = componentData.Title;
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId =
        componentData?.MeetingComponentId;
      modalRef.componentInstance.meetingQuestionnaireId =
        meetingQuestionnaireId;

      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    } else {
      //create

      const modalRef = this.modalService.open(CreateQuestionnaireComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Contributions modal',
      });
      modalRef.componentInstance.modalTitle = componentData.Title;
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId =
        componentData?.MeetingComponentId;
      modalRef.componentInstance.meetingQuestionnaireId = 0;
      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    }
  }
  //#endregion

  //#region  Open View Contributions
  // add/edit/delete meeting component
  openViewQuestionnaireModal(component: any) {
    const componentData = component as IComponent;
    const modalRef = this.modalService.open(
      ViewQuestionnaireParticipantsComponent,
      {
        size: 'xl',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'View Contributions modal',
      }
    );
    modalRef.componentInstance.modalTitle = componentData.Title;
    modalRef.componentInstance.meetingId = this.meetingId;
    modalRef.componentInstance.meetingComponentId =
      componentData?.MeetingComponentId;
    modalRef.componentInstance.meetingQuestionnaireId = 0;
    modalRef.result.then(
      (result) => {},
      (reason) => {}
    );
  }
  //#endregion
}
