import { Component, OnInit } from '@angular/core';
import { UserService } from "./../../common/services/user.service";
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseManagerService } from 'src/app/common/services/response-manager.service';
import { PlanService } from 'src/app/common/services/plan.service';
import {GoogleAnalyticsService} from "./../../common/services/google-analytics.service";
@Component({
  selector: 'sign-up-app',
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss']
})
export class SignUpComponent implements OnInit {
  form_invalid: boolean;
  constructor(private userService: UserService, private activatedRoute: ActivatedRoute,
    private router: Router, private responseManager: ResponseManagerService, private plansService: PlanService, public googleAnalyticsService: GoogleAnalyticsService) {

  }
  plan: any = ''
  user: any = {
    email: "",
    password: "",
    confiemPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: ""
  }
  plans: any = {}
  planId: any = "";
  stripePlanId: any = "";
  referralCode = "";
  shop = "";
  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((res: any) => {
      this.user.plan = res.params.id
      this.user.selectedPlan = res.params.plan
      this.plan = res.params.plan
      this.referralCode = res.params.referralCode
      this.user.referralCode = res.params.referralCode
      this.shop = sessionStorage.getItem('shop');
      this.user.shop = this.shop
      if (res.params.fromInfo) {
        this.user = JSON.parse(localStorage.getItem('user'));
      }
    });

    this.getPlans();
  }

  signUp() {
    if (this.validatePassword()) {
      localStorage.setItem('user', JSON.stringify(this.user));
      if (this.user.selectedPlan != "Starter") {
        this.userService.getUserExists({email:this.user.email, phoneNumber: this.user.phoneNumber}).subscribe((res:any)=>{
          this.router.navigate(['/payment-info']);
        }, (error:any)=>{
          this.responseManager.error.errorMessage = error.error.status.message;
        })
        return;

      }
      this.googleAnalyticsService.eventEmitter("Form Submissions", "sign-up", "Sign Up", 1)
      this.userService.signUp(this.user).then((res) => {
        localStorage.removeItem('user');
      }).catch((error) => {
        this.responseManager.error.errorMessage = error.status.message;
      })
    } else {
      this.responseManager.error.errorMessage = "Password and Confirm Password must match"
    }
  }

  validatePassword() {
    if (this.user.password == this.user.confirmPassword) {
      return true;
    } else {
      return false;
    }
  }

  getPlans() {
    this.plansService.getPlans().subscribe((res: any) => {
      this.plans = res.body.plans;
      this.plans.forEach(element => {
        if (element._id == this.user.plan) {
          this.user.stripePlanId = element.stripePlanId
        }
      });
    })
  }
  checkValid(value, field) {
    if (field == 'name') {
      /^[a-zA-Z ]*$/.test(value) ? this.form_invalid=false :  this.form_invalid = true;
      return /^[a-zA-Z ]*$/.test(value)
    } else if (field == 'email') {
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value) ? this.form_invalid=false :  this.form_invalid = true ;
      return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)
    } else if (field == 'phone') {
      /^([+]*\d{0,3}[- ]?)?\d{10}$/.test(value) ? this.form_invalid=false : this.form_invalid = true;
      return /^([+]*\d{0,3}[- ]?)?\d{10}$/.test(value)
    }
  }
  checkLength(value, field){
    if(field == 'phone'){
       return (value.length>=9 && value.length<=15) ? this.form_invalid=false: this.form_invalid=true;
    }else if(field == "password"){
       return (value.length>=8)? this.form_invalid = false: this.form_invalid=true;
    }
  }
  checkFormValidity() {
    // debugger
    if (this.user.firstName == "" || this.user.lastName == "" || this.user.email == "" || this.user.password == "" || this.user.phoneNumber == "" || this.user.password !== this.user.confirmPassword || this.form_invalid) {
      return true;
    }
    return false;
  }
}