import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
/*import { TrackByService } from '../shared/services/trackby.service';*/
import { IRole } from '../../../core/models/IRole';
import { IDelete } from '../../../core/models/IHelpers';
import { RoleService } from '../../../data/services/role.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
/*import * as bootstrap from 'bootstrap';*/
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HelperService } from '../../../data/utils/helper.service';
import { catchError, lastValueFrom, of, switchMap } from 'rxjs';
import { debug, error } from 'console';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent implements OnInit {
  roleForm!: FormGroup;
  roles: IRole[] = [];
  role: IRole = {
    RoleId: 0,
    Name: '',
    Description: '',
    CreatedDate: new Date(),
    ModifiedDate: new Date(),
  };
  /*  delete: IDelete = { IsDeleted: false, Message: '' }*/
  deleteRoleId: any;
  deleteRoleName: any;

  constructor(
    private roleService: RoleService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private modal: NgbModal
  ) {}

  ngOnInit() {
    this.getRoles();
    // initialize form
    this.buildRoleForm();
  }

  // Retrieve all roles
  getRoles() {
    // const ddd= await lastValueFrom(this.roleService.getRoles());

    this.roleService
      .getRoles()
      .pipe(
        switchMap((result) => {
          return (this.roles = result);
        }),
        catchError((err) => {
          console.error('getRoles() Error1: ' + err);
          return of([]);
        })
      )
      .subscribe({
        next: (role) => {
          console.log('getRoles(): Retrived All Roles: ' + role);
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          console.log('getRoles() Completed: Successfully retrieved roles');
        },
      });
  }

  // build form
  buildRoleForm() {
    this.roleForm = this.formBuilder.group({
      RoleId: [this.role.RoleId],
      Description: [
        this.role.Description,
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(4),
        ],
      ],
      Name: [
        this.role.Name,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(4),
        ],
      ],
    });
  }

  // get role form validation errors
  roleFormErrorMessage(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }

  // save/update data
  async saveRole() {
    if (!this.roleForm.valid) {
      return this.roleForm.markAllAsTouched();
    }

    const data = this.roleForm.value as IRole;
    if (data?.RoleId === 0) {
      this.roleService
        .createRole(data)
        .pipe(
          switchMap((role: IRole[]) => {
            this.modal.dismissAll();
            return (this.roles = role);
          })
        )
        .subscribe({
          next: (role) => {
            console.log('CreateRole(): Saving Role.');
          },
          error: (error) => {
            console.log(error);
          },
          complete: () =>
            console.log('CreateRole(): Successfully created role.'),
        });
    } else {
      // save edited record
      this.roleService
        .updateRole(data)
        .pipe(
          switchMap((roles: IRole[]) => {
            this.modal.dismissAll();
            return (this.roles = roles);
          })
        )
        .subscribe({
          next: (role) => {
            console.log('CreateRole(): Saving Role.');
          },
          error: (err: any) => console.log(err),
          complete: () =>
            console.log('UpdateRole(): Successfully modified role.'),
        });
    }
  }

  //add/ edit role
  async addEditRole(roleId: any, roleModal: any) {
    const options: NgbModalOptions = {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
      centered: true,
    };

    // this.buildRoleForm();
    if (roleId === '0') {
      // add data
      this.role;
      this.buildRoleForm();
      this.roleForm.reset();
      this.modal.open(roleModal, options);
    } else {
      // get data and edit
      const data = await lastValueFrom(this.roleService.getRole(roleId));
      this.role = data[0] as IRole;
      this.buildRoleForm();
      this.modal.open(roleModal, options).result.then(async (result) => data);
    }
  }

  // instatiate delete modal
  yesDeleteRole(roleId: any, roleName: any, deleteRoleModal: any) {
    const options: NgbModalOptions = {
      size: 'md',
      backdrop: 'static',
      keyboard: true,
      centered: true,
    };
    this.deleteRoleId = roleId;
    this.deleteRoleName = roleName;
    this.modal.open(deleteRoleModal, options);
  }

  // delete role
  deleteRole() {
    const roleId = (<HTMLInputElement>document.getElementById('roleId')).value;
    this.roleService
      .deleteRole(roleId)
      .pipe(
        switchMap((roles: IRole[]) => {
          this.modal.dismissAll();
          return (this.roles = roles);
        })
      )
      .subscribe({
        next: (roles) => {
          console.log('Delete role');
        },
        error: (err: any) => console.log(err),
        complete: () => console.log('DeleteRole(): Successfully delete role.'),
      });
  }
}
