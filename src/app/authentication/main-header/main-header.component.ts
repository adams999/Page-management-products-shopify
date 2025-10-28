import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {GoogleAnalyticsService} from "./../../common/services/google-analytics.service";
@Component({
  selector: 'main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})

export class MainHeaderComponent implements OnInit {
  constructor(private router: Router, public googleAnalyticsService: GoogleAnalyticsService) {
    // this.router.navigate(['/faqs']);
  }
  referralCode: any = ""
  shop: any = ""
  ngOnInit() {

  }
  customNavigate(navigateLink) {
    this.router.navigate(['/' + navigateLink + '']);
    this.googleAnalyticsService.eventEmitter("Navigations", "navigation-header", navigateLink, 1);
  }
}
