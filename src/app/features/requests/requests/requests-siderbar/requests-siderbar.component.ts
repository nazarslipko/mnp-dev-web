import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ProfileService } from '../../../../data/utils/profile.service';
import { IContact } from '../../../../core/models/IHelpers';

@Component({
  selector: 'app-requests-siderbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './requests-siderbar.component.html',
  styleUrl: './requests-siderbar.component.css'
})
export class RequestsSiderbarComponent implements OnInit {
  iContact: IContact;
  //intercedor = false;
  constructor(private router: Router, private profileService: ProfileService) {
    this.iContact = profileService.getProfile() as IContact;   
  }
  ngOnInit() { }
 
  navigateToRequests(requestType: string) {
    this.router.navigate(['prayers/letuspray', 'god']);  
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['/requests', requestType])
    );
  }

/*
  navigateToHome( category:string) {   

    if (category === 'requests') {     
      this.router.navigate(['requests/nonconfidential'])
    } else if (category === 'meetings') {
      this.router.navigate(['meetings']);
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/prayers/letuspray', category])
      );
    }
  }
  */
 
}




