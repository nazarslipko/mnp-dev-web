import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [],
  templateUrl: './donations.component.html',
  styleUrl: './donations.component.css'
})
export class DonationsComponent implements OnInit, OnChanges {
  message="This is Donation Component!!";

  @Input() meeting ={}

  constructor(){}

  ngOnInit(): void {
    
  }
  ngOnChanges(changes: SimpleChanges): void { 
    const data= this.meeting;
    
  }

}


