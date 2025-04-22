import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-devotions',
  standalone: true,
  imports: [],
  templateUrl: './devotions.component.html',
  styleUrl: './devotions.component.css'
})
export class DevotionsComponent implements OnInit {

  hello = " Welcome to Devotionals Pages"

  constructor() { }

  ngOnInit() { }


}
