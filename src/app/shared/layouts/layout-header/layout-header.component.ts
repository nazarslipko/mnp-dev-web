import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-layout-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.css'
})
export class LayoutHeaderComponent implements OnInit, OnDestroy {
  constructor(private router: Router) { }

  ngOnInit(): void {

  }
  navigateToHome(category: string) {  
    //this.router.navigate(['/prayers/letuspray', category]);
    //const navigationExtras: NavigationExtras = {
    //  queryParams: { id: category }
    //};
   // this.router.navigate(['prayers/letuspray'], navigationExtras);
    if (category === 'requests' ) {    
      this.router.navigate(['requests/prayers']);
    } else if (category === 'meetings') {
      this.router.navigate(['/community/meetings']);
    } else {
      this.router.navigateByUrl('/requests', { skipLocationChange: true }).then(() =>
        this.router.navigate(['/prayers/letuspray', category])
      );
    }
  }

  ngOnDestroy(): void { }

  logout() {
    sessionStorage.removeItem('CurrentUser');
    sessionStorage.clear(); 
  }

}
