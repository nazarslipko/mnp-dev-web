import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../../../../data/services/lookup.service';
import { MeetingComponentService } from '../../../../../data/services/meeting.component.service';
import { ProfileService } from '../../../../../data/utils/profile.service';
import { ActivatedRoute } from '@angular/router';
import { IContact } from '../../../../../core/models/IHelpers';
import { IComponent } from '../../../../../core/models/IComponent';
import { lastValueFrom, switchMap } from 'rxjs';
import { MeetingComponentsComponent } from '../meeting-components/meeting-components.component';
import { CreateSignupsListComponent } from './create-signups-list/create-signups-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ViewSignupParticipantsComponent } from './view-signups-participants/view-signup-participants.component';
import { debug } from 'node:console';

@Component({
  selector: 'app-signups',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signups.component.html',
  styleUrl: './signups.component.css',
})
export class SignupsComponent implements OnInit {
  @Input() meeting: any | null;
  iContact: IContact;
  meetingId: any = 0;
  componentLookupTypeId: any = 0;
  parseMeetingComponents: any;
  published: number = 0;
  meetingComponents: IComponent[] = [];
  

  data: any;
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
        m.LookupName.startsWith('Signups')
      )?.LookupId;

      if (this.componentLookupTypeId > 0) {
        this.meetingComponents = await lastValueFrom(
          this.meetingComponentService.getMeetingComponentsByLookup(
            this.meetingId,
            this.componentLookupTypeId,
            this.published
          )
        );
      }
    }
  }

  //#region Open Signups Component data
  // add/edit/delete meeting component

  openSingupsComponentModal(componentId: any) {
    if (componentId > 0) {
      // edit signup component
      const modalRef = this.modalService.open(MeetingComponentsComponent, {
        size: 'xl',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Edit Signups Component modal',
      });

      modalRef.componentInstance.modalTitle = 'Edit Signups Component';
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId = componentId;
      modalRef.componentInstance.componentLookupTypeId =
        this.componentLookupTypeId;

      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    } else {
      //create signup component

      const modalRef = this.modalService.open(MeetingComponentsComponent, {
        size: 'xl',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Create Signups Component modal',
      });
      modalRef.componentInstance.modalTitle = 'Create Signups Component';
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

  //#region  Open Create Singups List

  // add/edit/delete meeting component
  openSingupsListModal(component: any, meetingSignupId?: any) {
    const componentData = component as IComponent;
    if (componentData?.MeetingComponentId > 0 && meetingSignupId > 0) {
      // edit
      const modalRef = this.modalService.open(CreateSignupsListComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Signups modal',
      });

      modalRef.componentInstance.modalTitle = componentData.Title;
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId =
        componentData?.MeetingComponentId;
      modalRef.componentInstance.meetingSignupId = meetingSignupId;

      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    } else {
      //create

      const modalRef = this.modalService.open(CreateSignupsListComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Signups modal',
      });
      modalRef.componentInstance.modalTitle = componentData.Title;
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId =
        componentData?.MeetingComponentId;
      modalRef.componentInstance.meetingSignupId = 0;
      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    }
  }
  //#endregion

  //#region  Open View Signups Participants
  // add/edit/delete meeting component
  openViewSignupParticipantsModal(component: any) {
    const componentData = component as IComponent;
    const modalRef = this.modalService.open(ViewSignupParticipantsComponent, {
      size: 'xl',
      keyboard: false,
      backdrop: 'static',
      windowClass: 'View Signups modal',
    });
    modalRef.componentInstance.modalTitle = componentData.Title;
    modalRef.componentInstance.meetingId = this.meetingId;
    modalRef.componentInstance.meetingComponentId =
      componentData?.MeetingComponentId;
    modalRef.componentInstance.meetingSignupId = 0;
    modalRef.result.then(
      (result) => {},
      (reason) => {}
    );
  }
  //#endregion
}
