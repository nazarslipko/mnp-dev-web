import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-praises',
  standalone: true,
  imports: [],
  templateUrl: './praises.component.html',
  styleUrl: './praises.component.css'
})
export class PraisesComponent implements OnInit {

  hello = " Welcome to Praises Pages"

  constructor() { }

  ngOnInit() { }

}
