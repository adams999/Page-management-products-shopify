import { Component, OnInit } from '@angular/core';
import { ResponseManagerService } from '../common/services/response-manager.service';
import { UserService } from '../common/services/user.service';
import { Intercom } from 'ng-intercom';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private responseManager: ResponseManagerService, private userService: UserService, public intercom: Intercom, private route: ActivatedRoute, private router: Router) { }
  isActive: boolean = false;
  ngOnInit() {
    this.userService.checkIfActive();
    let user = this.userService.user;
    this.userService.setUser(user);
    this.intercom.boot({
      app_id: "ilolk8gr",
      name: user.firstName + " " + user.lastName, // Full name
      email: user.email, // Email address
      planName: user.plan.title, // Plan Name
      created_at: user.createdAt, // Signup date as a Unix timestamp
      // Supports all optional configuration.
      widget: {
        "activator": "#intercom"
      }
    });
  }

  ngOnDestroy() {
    console.log("Destroy MAIN")
    this.responseManager.warning.warningMessage = "";
    this.responseManager.error.errorMessage = ""
    this.responseManager.success.successMessage = ""
  }
}
