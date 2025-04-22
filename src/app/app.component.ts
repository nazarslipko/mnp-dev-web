import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet} from '@angular/router';
import { RoleService } from './data/services/role.service';
import { IRole } from './core/models/IRole';
import { IDelete } from './core/models/IHelpers';
import { LayoutComponent } from './shared/layouts/layout/layout.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIf, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
//export class AppComponent {
//  title = 'MAP.Web';
//}

export class AppComponent implements OnInit {
  currentYear: number = new Date().getFullYear();
  constructor(private roleService: RoleService) {

   
  }

  ngOnInit() { 


  /// this.getRoles();
  }
  // getRoles() {
  //   //const data = this.roleService.getRoles(.pipe(switchMap()).subscribe({
  //   //  next: (role: IRole[]) => {
  //   //   this.roles = role;
  //   //  },
  //   //  error: (err: any) => console.log(err),
  //   //  complete: () => console.log('getRoles(): Retrieved roles') 
  //   //});

  //   //const data = this.roleService.getRole('1'.pipe(switchMap()).subscribe({
  //   //  next: (role: IRole) => {
  //   //    this.role = role;
  //   //  },
  //   //  error: (err: any) => console.log(err),
  //   //  complete: () => console.log('getRole(): Retrieved role')
  //   //});


  //   //const Deletedata = this.roleService.deleteRole("1".pipe(switchMap()).subscribe({
  //   //  next: (deleted: IDelete) => {
  //   //    this.delete= deleted;
  //   //  },
  //   //  error: (err: any) => console.log(err),
  //   //  complete: () => console.log('getRole(): Retrieved role')
  //   //});   
  //}
  title = 'MAP.Web';
}
