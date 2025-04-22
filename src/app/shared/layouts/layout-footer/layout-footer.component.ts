import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout-footer',
  standalone: true,
  imports: [],
  templateUrl: './layout-footer.component.html',
  styleUrl: './layout-footer.component.css'
})
export class LayoutFooterComponent implements OnInit {

  currentYear: number = new Date().getFullYear();
  ngOnInit() {

  }
}
