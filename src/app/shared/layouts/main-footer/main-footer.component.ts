import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-footer',
  standalone: true,
  imports: [],
  templateUrl: './main-footer.component.html',
  styleUrl: './main-footer.component.css'
})
export class MainFooterComponent implements OnInit {

  currentYear: number = new Date().getFullYear();

  ngOnInit(){

  }
}

