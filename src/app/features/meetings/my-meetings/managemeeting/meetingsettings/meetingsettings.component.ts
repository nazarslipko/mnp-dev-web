import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-meetingsettings',
  standalone: true,
  imports: [],
  templateUrl: './meetingsettings.component.html',
  styleUrl: './meetingsettings.component.css'
})
export class MeetingsettingsComponent implements OnInit, OnChanges{
  hello = "Welcome to meeting settings!"
  @Input() meeting ={}
  
  constructor() { }

  ngOnInit() { }

  ngOnChanges(changes: SimpleChanges): void { 
    const data= this.meeting;
    
  }

}
