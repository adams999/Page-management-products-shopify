import { Component, OnInit } from '@angular/core';
import { ResponseManagerService } from './../../services/response-manager.service';
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";

@Component({
  selector: 'response-manager',
  templateUrl: './response-manager.component.html',
  styleUrls: ['./response-manager.component.scss']
})
export class ResponseManagerComponent implements OnInit {

  constructor(public responseManager: ResponseManagerService, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    //this.setInterval()
  }
  message: any = "";
  close() {
    this.responseManager.error.errorMessage = ''
    this.responseManager.success.successMessage = ''
  }
  ngDoCheck() {
    if (this.responseManager.error.errorMessage || this.responseManager.success.successMessage) {
      if (this.responseManager.success.isTimer) {
        setTimeout(() => {
          this.responseManager.success.successMessage = ''
        }, 5000);
      }
      if (this.responseManager.error.isTimer) {
        setTimeout(() => {
          this.responseManager.error.errorMessage = ''
        }, 5000);
      }
    }
  }

  actionButton() {
    let user = this.responseManager.warning.user;
    if (this.responseManager.warning.actionParam == 'isActive') {
      this.userService.resendEmail(user).then((res: any) => {
        this.message = res.status.message;
        setTimeout(() => {
          this.message = ''
        }, 4000);
      })
    }
    if (this.responseManager.warning.actionParam == 'isApiLimitReached') {
      this.router.navigate(['/profile-settings'])
    }
  }
}
