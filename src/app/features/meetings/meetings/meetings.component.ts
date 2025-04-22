import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MeetingsSiderbarComponent } from './meetings-siderbar/meetings-siderbar.component';
import { MeetingService } from '../../../data/services/meeting.service';
import { IContact } from '../../../core/models/IHelpers';
import { FormGroup } from '@angular/forms';
import { IMeeting } from '../../../core/models/IMeeting';
@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MeetingsSiderbarComponent],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css'
})
export class MeetingsComponent implements OnInit {
  constructor(
    private router: Router,
    private meetingService: MeetingService,

  ) { }

  ngOnInit() {
  }

}
