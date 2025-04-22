import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IUser } from '../../../core/models/IUser';
import { UserService } from '../../../data/services/user.service';
import { HelperService } from '../../../data/utils/helper.service';
import { NavigationExtras, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { IContact } from '../../../core/models/IHelpers';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-main-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule, NgIf],
  templateUrl: './main-header.component.html',
  styleUrl: './main-header.component.css'
})
export class MainHeaderComponent implements OnInit {
  message: any;
  loginForm!: FormGroup;
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
    LastLoggedIn: new Date,
    LockedOn: new Date,
    RenewPassword: '',
    ResetPassword: new Date,
    Active: false,
    Moderator: false,
    Intercessor: false,
    IsBlocked: false,
    CreatedDate: new Date,
    ModifiedDate: new Date
  }
  constructor(private userService: UserService, private helperService: HelperService, private router: Router, private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.buildLoginForm();
  }
  // login form
  buildLoginForm() {
    const emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
    this.loginForm = this.formBuilder.group({
      Email: [this.iUser.Email, [Validators.required, Validators.maxLength(100), Validators.minLength(5), Validators.email, Validators.pattern(emailPattern)]],
      Password: [this.iUser.Password, [Validators.required, Validators.maxLength(30), Validators.minLength(8)]],
      StaySignedIn: [null]
    });
  }
  // get login form validation errors
  loginFormErrorMessage(controlName: string, error: any) {
    return this.helperService.validateForm(controlName, error);
  }
  // user login
  async submitLogin() {
    const jwtReturnedAPIToken: string = 'Abce1234Bup0t0!@#'
    this.message = '';
    if (!this.loginForm.valid) {
      //this.message = "Email and password are required."
      return this.loginForm.markAllAsTouched();
    }
    const data = this.loginForm.value as IUser;
    // login 
     this.userService
       .loginUser(data)
       .pipe(
         switchMap((contact: IContact) => {
           // this.iContact = contact;
           //if (iUser.LoginToken) {
           //  sessionStorage.setItem('CurrentUser', jwtReturnedAPIToken);
           //}
           // this.iContact = contact;

           return of( sessionStorage.setItem(
             'CurrentUser',
             JSON.stringify(contact)
           ));
         })
       )
       .subscribe({
         next: (contact) => {
          console.log('Save user')
         },
         error: (err: any) => {
           this.message = err.error.Message;
         },
         complete: () => {
           //To Do: add guard, set session and redirect to the Scroll;
           //console.log('submitLogin(): Successfully logged-In.');
           //window.location.reload();

           //const navigationExtras: NavigationExtras = {
           //  queryParams: { category: 'god' }
           //};
           //this.router.navigate(['prayers/letuspray'], navigationExtras);
           /*       this.router.navigate(['prayers/letuspray', 'pr']);*/
           this.router.navigate(['prayers/letuspray', 'god']);
         },
       });
  }
}
