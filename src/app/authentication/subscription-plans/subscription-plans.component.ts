import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/common/services/plan.service';
import { Router, ActivatedRoute } from '@angular/router';
import {GoogleAnalyticsService} from "./../../common/services/google-analytics.service";

@Component({
  selector: 'subscription-plans-app',
  templateUrl: './subscription-plans.html',
  styleUrls: ['./subscription-plans.scss']
})
export class SubscriptionPlansComponent implements OnInit {
  constructor(private plansService: PlanService, private router: Router, private activatedRoute: ActivatedRoute, public googleAnalyticsService: GoogleAnalyticsService) {

  }
  plans: any = [{ _id: "" }, { _id: "" }, { _id: "" }]
  leftActive: any = true;
  rightActive: any = false;
  flag: any = true;
  referralCode = ""

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((res: any) => {
      this.referralCode = res.params.referralCode
    });
    this.getPlans();
  }

  getPlans() {
    this.plansService.getPlans().subscribe((res: any) => {
      this.plans = res.body.plans
    })
  }

  activateLeft() {
    this.leftActive = true;
    this.rightActive = false;
    this.flag = true
  }

  activateRight() {
    this.leftActive = false;
    this.rightActive = true;
    this.flag = false
  }

  navigateContact() {
    this.router.navigate(['/contact-us']);
  }
  choosePlan(index) {
    this.googleAnalyticsService.eventEmitter("Navigations", "choose-plan", "Pricing", 1);
    this.router.navigate(['/sign-up'], {
       queryParams: { 
         plan: this.plans[index].title, 
         id: this.plans[index]._id, 
         referralCode: this.referralCode 
        } 
      });
  }
}