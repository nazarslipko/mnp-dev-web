import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
//import { UserService } from '../data/services/user.service';
import { UserService } from '../../../data/services/user.service';

import { IUser } from '../../../core/models/IUser';
import { IRole } from '../../../core/models/IRole';
import { ILookup } from '../../../core/models/ILookup';
import { LookupService } from '../../../data/services/lookup.service';
import { Observable, switchMap } from 'rxjs';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { CountryService } from '../../../data/services/country.service';
import { ICountry } from '../../../core/models/ICountry';
import { HelperService } from '../../../data/utils/helper.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {
  userForm!: FormGroup;
  errors: any = '';
  iContact: any = '';

  iUser: IUser = {
    UserId: 0,
    AffiliationLookupId: 0,
    UserTypeLookupId: 0,
    RoleId: 0,
    FirstName: '',
    LastName: '',
    Email: '',
    Phone: '',
    Profile: '',
    Country: '',
    Password: '',
    ConfirmPassword: '',
    LoginToken: '',
    LastLoggedIn: new Date(),
    LockedOn: new Date(),
    RenewPassword: '',
    ResetPassword: new Date(),
    Active: false,
    Moderator: false,
    Intercessor: false,
    IsBlocked: false,
    CreatedDate: new Date(),
    ModifiedDate: new Date(),
  };
  Description?: string;
  CreatedDate?: Date;
  ModifiedDate?: Date;

  iUserTypeLookup: ILookup = {
    LookupId: 1,
    LookupName: '',
    Category: '',
    Description: '',
    CreatedDate: new Date(),
    ModifiedDate: new Date(),
  };
  iUserAffiliation: ILookup = {
    LookupId: 3,
    LookupName: '',
    Category: '',
    Description: '',
    CreatedDate: new Date(),
    ModifiedDate: new Date(),
  };
  Countries: ICountry[] = [];
  UserCategory: ILookup[] = [];
  UserAffiliation: ILookup[] = [];
  constructor(
    private router: Router,
    private userService: UserService,
    private countryService: CountryService,
    private lookupService: LookupService,
    private helperService: HelperService,
    private formBuilder: FormBuilder
  ) {}

  async ngOnInit() {
    await this.getCountries();
    await this.getLookupByCategory('Users');
    await this.getLookupByCategory('Affiliation');
    this.buildUserForm();
  }

  // build form
  buildUserForm() {
    const emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
    const namePattern = "^[A-Za-z][A-Za-z'-]+([ A-Za-z][A-Za-z'-]+)*"; // worked
    //const namePattern = '/^[A-Za-z\x{00C0}-\x{00FF}][A-Za-z\x{00C0}-\x{00FF}\'\-]+([\ A-Za-z\x{00C0}-\x{00FF}][A-Za-z\x{00C0}-\x{00FF}\'\-]+)*/u';// worked
    this.userForm = this.formBuilder.group({
      UserId: [this.iUser.UserId],
      AffiliationLookupId: [
        this.iUserAffiliation.LookupId,
        [Validators.required],
      ],
      UserTypeLookupId: [this.iUserTypeLookup.LookupId, [Validators.required]],
      /*  RoleId: [1, [Validators.required]],*/
      FirstName: [
        this.iUser.FirstName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
          Validators.pattern(namePattern),
        ],
      ],
      LastName: [
        this.iUser.LastName,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(2),
        ],
      ],
      Email: [
        this.iUser.Email,
        [
          Validators.required,
          Validators.maxLength(100),
          Validators.email,
          Validators.pattern(emailPattern),
        ],
      ],
      Phone: [
        this.iUser.Phone,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.minLength(8),
        ],
      ],
      //Profile: [this.iUser.Profile, [null]],
      Country: [1, [Validators.required]],
      Password: [
        this.iUser.Password,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(8),
        ],
      ],
      ConfirmPassword: [
        this.iUser.Password,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(8),
        ],
      ],

      //LoginToken: [this.iUser.LoginToken, [null]],
      //LastLoggedIn: [this.iUser.LastLoggedIn, [null]],
      //LockedOn: [this.iUser.LockedOn, [null]],
      //RenewPassword: [this.iUser.RenewPassword, [null]],
      //ResetPassword: [this.iUser.ResetPassword, [null]],
      //Active: [this.iUser.Active, [null]],
      //Moderator: [this.iUser.Moderator, [null]],
      //Intercessor: [this.iUser.Intercessor, [null]],
      //IsBlocked: [this.iUser.IsBlocked, [null]],
      //CreatedDate: [this.iUser.CreatedDate, [null]],
      //ModifiedDate: [this.iUser.ModifiedDate, [null]]
    });
  }

  // get user form validation errors
  userFormErrorMessage(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }
  async getLookupByCategory(category: any) {
    // get lookup data
    this.lookupService
      .getLookupByCategory(category)
      .pipe(
        switchMap((lookups: ILookup[]) => {
          if (category === 'Users') {
            this.UserCategory = lookups;
            return this.UserCategory;
          } else {
            this.UserAffiliation = lookups;
            return this.UserAffiliation;
          }
        })
      )
      .subscribe({
        next: (lookups) => {
          console.log('Retrieving Affiliation and UserType Lookups');
        },
        error: (err) =>
          console.log('Error Retrieving Affiliation and UserType Lookups '),
        complete: () =>
          console.log('Completed Retrieving Affiliation and UserType Lookups'),
      });
  }

  async getCountries() {
    // get lookup data
    this.countryService
      .getCountries()
      .pipe(
        switchMap((countries: ICountry[]) => {
          this.Countries = countries;
          return this.Countries;
        })
      )
      .subscribe({
        next: (countries) => {
          console.log('Retreiving Countries');
        },
        error: (err) => console.log('Error Retrieving Countries '),
        complete: () => console.log('Completed Retrieving Countries'),
      });
  }

  get Country() {
    return this.userForm.get('Country');
  }
  changeCountry(e: any) {
    const data = this.Country?.setValue(e.target.value, {
      onlySelf: true,
    });
  }

  async saveUser() {
    this.errors = '';
    if (!this.userForm.valid) {
      this.errors = 'One or more form fields are invalid.';
      return this.userForm.markAllAsTouched();
    }
    const data = this.userForm.value as IUser;
    data.RoleId = 1;
    // insert record
    this.userService
      .saveUser(data)
      .pipe(
        switchMap((contact) => {
          this.iContact = contact;
          return this.iContact;
        })
      )
      .subscribe({
        next: (contact) => {
          console.log('Saving User');
        },
        error: (err: any) => {
          this.errors = err.error.Message;
        },
        complete: () => {
          //To Do: add guard, set session and redirect to the Scroll;
          console.log('saveUser(): Successfully saved user record.');
          sessionStorage.setItem('CurrentUser', JSON.stringify(this.iContact));
          this.router.navigate(['prayers/letuspray', 'god']);
        },
      });
  }
}
