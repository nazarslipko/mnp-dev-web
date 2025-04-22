import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router, RouterLink, RouterLinkActive, } from '@angular/router';


@Component({
  selector: 'app-prayers-siderbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,CommonModule],
  templateUrl: './prayers-siderbar.component.html',
  styleUrl: './prayers-siderbar.component.css'
})
export class PrayersSiderbarComponent implements OnInit {
  @Output() categoryEmmiter = new EventEmitter<any>();
  scrollcategoryId = 7;
  constructor(private router: Router) { }
  ngOnInit(){ }

  navigateToHome( category:string) {
   
    //const navigationExtras: NavigationExtras = {
    //  queryParams: { id: category }
    //};      
    //this.router.navigate(['prayers/letuspray'], navigationExtras);
    //this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //  this.router.navigate(['prayers/letuspray'], navigationExtras)
    //);   

    if (category === 'requests') {     
      this.router.navigate(['requests/prayers'])
    } else if (category === 'meetings') {
      this.router.navigate(['/community/meetings']);
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/prayers/letuspray', category])
      );
    }
  }
  //sendData() {
  //  this.categoryEmmiter.emit(this.scrollcategoryId);
  //}
}
