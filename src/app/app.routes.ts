import { Routes } from '@angular/router';
//import { HowtoprayComponent } from './shared/components/howtopray/howtopray.component';
import { AboutComponent } from './shared/components/about/about.component';
import { RoleComponent } from './shared/components/role/role.component';
import { PagenotfoundComponent } from './shared/components/pagenotfound/pagenotfound.component';
import { PrayersComponent } from './features/prayers/prayers/prayers.component';
//import { PraisesComponent } from './features/prayers/praises/praises.component';
//import { DevotionsComponent } from './features/prayers/devotions/devotions.component';
import { LayoutComponent } from './shared/layouts/layout/layout.component';
import { RequestsComponent } from './features/requests/requests/requests.component';
import { MeetingsComponent } from './features/meetings/meetings/meetings.component';
//import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { authorizationGuard } from './data/utils/authorization.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
//import { SettingsComponent } from './features/meetings/my-meetings/managemeeting/settings/settings.component';
import { PrayerSettingsComponent } from './features/prayers/prayer-settings/prayer-settings.component';
import { PrayerRequestsComponent } from './features/requests/prayer-requests/prayer-requests.component';
//import { ConfidentialRequestsComponent } from './features/requests/confidential-requests/confidential-requests.component';
//import { PrayedComponent } from './features/requests/prayed/prayed.component';
import { MeetnprayComponent } from './features/meetings/meetnpray/meetnpray.component';
import { MeetingComponent } from './features/meetings/meetnpray/meeting/meeting.component';
import { MyMeetingsComponent } from './features/meetings/my-meetings/my-meetings.component';
import { ManagemeetingComponent } from './features/meetings/my-meetings/managemeeting/managemeeting.component';

export const routes: Routes = [

  // Layout for an unauthenticated user
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'howtopray',
        title: 'How to Pray',
        loadComponent: () => import("./shared/components/howtopray/howtopray.component").then((c) => c.HowtoprayComponent)
      },
      { 'path': 'about', title: 'About', component: AboutComponent },
      { 'path': 'roles', title: 'Roles', component: RoleComponent },
      { 'path': 'meeting', title: 'meeting', component: MeetingComponent },
      { 'path': '', redirectTo: '/howtopray', pathMatch: 'full' },
      // { 'path': '**', component: PagenotfoundComponent },
    ]
  },

  // Layout for an authenticated user
  {
    path: '',
    component: LayoutComponent, canActivate: [authorizationGuard],
    children: [
      {
        'path': 'prayers', component: PrayersComponent,
        children: [
          {
            path: 'letuspray/:category',
            title: 'Let us Pray',
            loadComponent: () => import("./shared/components/letuspray/letuspray.component").then((c) => c.LetusprayComponent),
            canActivate: [authorizationGuard]
          },

          { 'path': 'prayersettings', title: 'Settings', component: PrayerSettingsComponent, canActivate: [authorizationGuard] },

          { 'path': '', redirectTo: '/letuspray/:category', pathMatch: 'full' },
        ]
      },

      {
        'path': 'requests', component: RequestsComponent,
        children: [
          // { 'path': 'nonconfidential', title: 'Prayer Requests', component: PrayerRequestsComponent, canActivate: [authorizationGuard], },
          { 'path': ':requesttype', title: 'Prayer Requests', component: PrayerRequestsComponent, canActivate: [authorizationGuard], },
          // { 'path': 'confidential', title: 'Confidential Prayer Requests', component: ConfidentialRequestsComponent, canActivate: [authorizationGuard], },
          // { 'path': 'prayed', title: 'prayed', component: PrayedComponent, canActivate: [authorizationGuard], },
         // { 'path': 'settings', title: 'Settings', component: SettingsComponent, canActivate: [authorizationGuard], },
        ]

      },

      {
        'path': 'community', component: MeetingsComponent,
        children: [
          { 'path': 'meetings', title: 'Browse Meetings', component: MeetnprayComponent, canActivate: [authorizationGuard] },
          { 'path': 'meeting', title: 'Meeting Participation', component: MeetingComponent, canActivate: [authorizationGuard] },

         // { 'path': 'settings', title: 'Settings', component: SettingsComponent },
          { 'path': 'mymeetings', title: 'My Meetings', component: MyMeetingsComponent },
         //{ 'path': 'getmymeetings', title: 'Get My Meetings11', component: MyMeetingsComponent }
         //  { 'path': 'managemeeting', title: 'Manage Meeting', component: ManagemeetingComponent }
        ]
      },

      { 'path': 'managemeeting', title: 'Manage Meeting', component: ManagemeetingComponent }

    ]
  },


  { 'path': '**', component: PagenotfoundComponent },




  //{
  //  path: '',
  //  component: LayoutComponent, canActivate: [authorizationGuard],
  //  children: [

  //    //  { 'path': '', redirectTo: '/dashboard', pathMatch: 'full' },
  //    {
  //      'path': 'dashboard', title: 'Dashboard', component: DashboardComponent,

  //      //children: [
  //      //  // prayers module
  //      //  {
  //      //    'path': 'prayers', title: 'Prayers', component: PrayersComponent,
  //      //    children: [
  //      //      //prayers children
  //      //      { 'path': 'praises', title: 'Praises', component: PraisesComponent },
  //      //      { 'path': 'prayers', title: 'Prayers', component: PrayersComponent },
  //      //      { 'path': 'devotions', title: 'Devotions', component: DevotionsComponent },
  //      //      { path: 'thescroll/:id', component: PrayersComponent, data: {} } 
  //      //     ]
  //      //  },
  //      //  // prayer request module
  //      //  { 'path': 'requests', title: 'Requests', component: RequestsComponent },

  //      //  // meeting module
  //      //  { 'path': 'meetings', title: 'Meetings', component: MeetingsComponent },
  //      //]
  //    },

  //    ////prayers children
  //    //{ 'path': 'prayers/praises', title: 'Praises', component: PraisesComponent },
  //    //{ 'path': 'prayers/prayers', title: 'Prayers', component: PrayersComponent },
  //    //{ 'path': 'prayers/devotions', title: 'Devotions', component: DevotionsComponent },
  //    //{ path: 'prayers/thescroll/:id', component: PrayersComponent, data: {} } 

  //  ]
  //}

];


////import { NgModule } from '@angular/core';
////import { RouterModule, Routes } from '@angular/router';

//const routes: Routes = [
//{path: 'path', component: "componentname" ,}
//];

//@NgModule({
//  imports: [RouterModule.forRoot(routes)],
//  exports: [RouterModule]
//})
/*export class AppRoutingModule { }*/
