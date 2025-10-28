import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { ResponseManagerService } from 'src/app/common/services/response-manager.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrls: ['./reset-pwd.component.scss']
})
export class ResetPwdComponent implements OnInit {
  form_invalid: boolean;
  disbaleBtn:boolean = false;
  user_id: any;

  constructor(private userService: UserService, private responseManager: ResponseManagerService,private actRouter:ActivatedRoute) { }
  password = {
    newPassword: "",
    confirmPassword: ""
  }
  ngOnInit() {
    this.actRouter.queryParamMap.subscribe((res: any) => {
      this.user_id = res.params.id
    })
  }

  changePassword() {
    this.userService.resetPassword(this.password,this.user_id).then((res: any) => {
      this.disbaleBtn = true;
      this.responseManager.success.successMessage = res.status.message
    }).catch((error: any) => {
      this.disbaleBtn = false;
      this.responseManager.error.errorMessage = error.status.message
    })
  }
  ngOnDestroy(): void {
    this.responseManager.success.successMessage = "";
    this.responseManager.error.errorMessage = "";
  }
  checkLength(value, field) {
    if (field == "password") {
      return (value.length >= 8) ? this.form_invalid = false : this.form_invalid = true;
    }
  }
  checkFormValidity() {
    // debugger
    if (this.password.newPassword == "" || this.password.confirmPassword == "" ||  this.form_invalid) {
      return true;
    }
    return false;
  }

}
