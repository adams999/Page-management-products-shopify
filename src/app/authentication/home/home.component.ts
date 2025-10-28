import { Component, OnInit } from '@angular/core';
import { WOW } from 'wowjs/dist/wow';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements  OnInit {
 
  constructor() {
   
  }
  ngOnInit() {
    new WOW().init();

  }
  scroll() {
    document.getElementById("target").scrollIntoView({behavior:"smooth"});
  }
}
