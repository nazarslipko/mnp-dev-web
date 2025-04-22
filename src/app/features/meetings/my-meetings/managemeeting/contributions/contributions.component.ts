import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgbDatepickerModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MeetingComponent } from '../../../meetnpray/meeting/meeting.component';
import { MeetingComponentsComponent } from '../meeting-components/meeting-components.component';
import { IComponent } from '../../../../../core/models/IComponent';
import { LookupService } from '../../../../../data/services/lookup.service';
import { HelperService } from '../../../../../data/utils/helper.service';
import { MeetingService } from '../../../../../data/services/meeting.service';
import { ProfileService } from '../../../../../data/utils/profile.service';
import { IContact } from '../../../../../core/models/IHelpers';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MeetingComponentService } from '../../../../../data/services/meeting.component.service';
import { ILookup } from '../../../../../core/models/ILookup';
import { HttpErrorResponse } from '@angular/common/http';
import { MeetingContributionService } from '../../../../../data/services/meeting.contribution.service';
import { IContribution } from '../../../../../core/models/IContribution';
import { CommonModule } from '@angular/common';
import { lastValueFrom, of, switchMap } from 'rxjs';
import { ViewContributionsComponent } from './view-contributions/view-contributions.component';
import { CreateContributionListComponent } from './create-contribution-list/create-contribution-list.component';

@Component({
  selector: 'app-contributions',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contributions.component.html',
  styleUrl: './contributions.component.css',
})
export class ContributionsComponent implements OnInit {
  @Input() meeting: any | null;
  iContact: IContact;
  meetingId: any = 0;
  published: number=0;
  componentLookupTypeId: any = 0;
  meetingContributionComponents: IComponent[] = [];
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
        m.LookupName.startsWith('Contributions')
      )?.LookupId;

      if (this.componentLookupTypeId > 0) {     
        this.meetingContributionComponents = await lastValueFrom(
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

  openContributionComponentModal(componentId: any) {
    if (componentId > 0) {
      // edit
      const modalRef = this.modalService.open(MeetingComponentsComponent, {
        size: 'xl',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Edit Contribution Component modal',
      });

      modalRef.componentInstance.modalTitle = 'Edit Contribution Component';
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
        windowClass: 'Create Contribution Component modal',
      });
      modalRef.componentInstance.modalTitle = 'Create Contribution Component';
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
  openContributionListModal(component: any, meetingContributionId?: any) {
    const componentData = component as IComponent;
    if (componentData?.MeetingComponentId > 0 && meetingContributionId > 0) {
      // edit
      const modalRef = this.modalService.open(CreateContributionListComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Contributions modal',
      });

      modalRef.componentInstance.modalTitle = componentData.Title;
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId =
        componentData?.MeetingComponentId;
      modalRef.componentInstance.meetingContributionId = meetingContributionId;

      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    } else {
      //create

      const modalRef = this.modalService.open(CreateContributionListComponent, {
        size: 'lg',
        keyboard: false,
        backdrop: 'static',
        windowClass: 'Contributions modal',
      });
      modalRef.componentInstance.modalTitle = componentData.Title;
      modalRef.componentInstance.meetingId = this.meetingId;
      modalRef.componentInstance.meetingComponentId =
        componentData?.MeetingComponentId;
      modalRef.componentInstance.meetingContributionId = 0;
      modalRef.result.then(
        (result) => {},
        (reason) => {}
      );
    }
  }
  //#endregion

  //#region  Open View Contributions
  // add/edit/delete meeting component
  openViewContributionsModal(component: any) {
    const componentData = component as IComponent;
    const modalRef = this.modalService.open(ViewContributionsComponent, {
      size: 'xl',
      keyboard: false,
      backdrop: 'static',
      windowClass: 'View Contributions modal',
    });
    modalRef.componentInstance.modalTitle = componentData.Title;
    modalRef.componentInstance.meetingId = this.meetingId;
    modalRef.componentInstance.meetingComponentId =
      componentData?.MeetingComponentId;
    modalRef.componentInstance.meetingContributionId = 0;
    modalRef.result.then(
      (result) => {},
      (reason) => {}
    );
  }
  //#endregion
}
