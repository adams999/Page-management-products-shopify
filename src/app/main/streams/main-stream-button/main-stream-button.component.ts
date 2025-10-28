import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAnalyticsService } from 'src/app/common/services/google-analytics.service';
@Component({
    selector: 'main-stream-button-app',
    templateUrl: './main-stream-button.html',
    styleUrls: ['./main-stream-button.scss'],

})
export class MainStreamButtonComponent implements OnInit {
    @Input() buttonTitle: any={};
    @Input() navigateTo: any={};
    @Input() isCardExpired: boolean=false;
    @Input() isActive: boolean=true;
    @Input() isApiLimitReached: boolean=false;
    @Input() currentPage: any="";
    constructor(private router: Router, public googleAnalyticsService: GoogleAnalyticsService) {
    }

    ngOnInit() {
    }

    customNavigate() {
        this.router.navigate(['/' + this.navigateTo + '']);
        this.googleAnalyticsService.eventEmitter("Buttons", this.buttonTitle, this.currentPage, 1);
    }
}