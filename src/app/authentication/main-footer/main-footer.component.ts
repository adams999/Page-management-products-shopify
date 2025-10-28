import { Component } from '@angular/core'
import {GoogleAnalyticsService} from "./../../common/services/google-analytics.service";
import { Router } from '@angular/router';
@Component({
  selector: 'main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})

export class MainFooterComponent {
  constructor(private router: Router, public googleAnalyticsService: GoogleAnalyticsService) {
    // this.router.navigate(['/faqs']);
  }
  customNavigate(navigateLink) {
    this.router.navigate(['/' + navigateLink + '']);
    this.googleAnalyticsService.eventEmitter("Navigations", "navigation-footer", navigateLink, 1);
  }
}
