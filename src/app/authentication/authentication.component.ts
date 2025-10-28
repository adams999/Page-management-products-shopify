import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "./../common/services/user.service";
import { Intercom } from 'ng-intercom';
import { environment  } from './../../environments/environment';
import { ResponseManagerService } from '../common/services/response-manager.service';

@Component({
  selector: "authentication-app",
  templateUrl: "./authentication.html",
  styleUrls: ["./authentication.scss"]
})
export class AuthenticationComponent implements OnInit {
  constructor(private router: Router, private userService: UserService, public intercom: Intercom, private responseManager: ResponseManagerService) { }
  email: any = "";
  password: any = "";
  message: any = "";
  isLoading: any = false;
  loader: boolean = false;
  env = environment;
  ngOnInit() {
    this.intercom.boot({
      app_id: "ilolk8gr",
      // Supports all optional configuration.
      widget: {
        "activator": "#intercom"
      }
    });
    this.loader = true;
    this.userService
      .getMe()
      .then((res: any) => {
        res.body.user
          ? this.router.navigate(["/list-streams"])
          : this.router.navigate(["/list-streams"]);
        this.loader = false;
      })
      .catch((err: any) => {
        this.loader = false;
      });
  }
  onActivate(event) {
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
        window.scrollTo(0, pos - 20);
      } else {
        window.clearInterval(scrollToTop);
      }
    }, 16);
  }
}
