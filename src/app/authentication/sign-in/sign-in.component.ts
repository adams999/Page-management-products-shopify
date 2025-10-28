import { Component, OnInit } from '@angular/core';
import { UserService } from "./../../common/services/user.service";
import { ActivatedRoute } from '@angular/router';
import { ResponseManagerService } from 'src/app/common/services/response-manager.service';
import {GoogleAnalyticsService} from "./../../common/services/google-analytics.service";
@Component({
  selector: 'sign-in-app',
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.scss']
})
export class SignInComponent implements OnInit {
  form_invalid: boolean;
  constructor(private userService: UserService, private activatedRoute: ActivatedRoute,
    public responseManager: ResponseManagerService, public googleAnalyticsService: GoogleAnalyticsService) {
  }
  user: any = {
    email: "",
    password: ""
  }
  message: any = '';
  shop = "";
 hideWarning : Boolean = false;
  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((res: any) => {
      this.message = res.params.message;
      this.shop = res.params.shop
      sessionStorage.setItem('shop', this.shop);
      this.user.shop = this.shop
    })
  }

  signIn() {
    this.googleAnalyticsService.eventEmitter("Form submissions", "sign-in", "Sign-in", 1);
    this.userService.signIn(this.user).then((res: any) => {
    }).catch((error: any) => {
      this.responseManager.error.errorMessage = error.status.message
    })
  }

  ngOnDestroy() {
    this.responseManager.error.errorMessage = "";
  }

  checkValid(value, field) {
    // console.log(/^[a-zA-Z ]*$/.test(value))
    if (field == 'email') {
      /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value) ? this.form_invalid = false : this.form_invalid = true;
      return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value)
    }
  }
}