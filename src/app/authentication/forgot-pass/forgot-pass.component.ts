import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/common/services/user.service';
import { ResponseManagerService } from 'src/app/common/services/response-manager.service';

@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  form_invalid: boolean;
  disableBtn:boolean = false;
  constructor(private userService: UserService,
    private responseManager: ResponseManagerService) {

  }
  user: any = {
    email: "",
  }
  message: any = '';
  shop = ""
  ngOnInit() {
    
  }

  forgotPassword() {
    this.userService.forgotPassword(this.user).then((res: any) => {
      this.responseManager.success.successMessage = res.status.message
      this.disableBtn = true;
    }).catch((error: any) => {
      // console.log("error==\.",error)
      this.disableBtn = false;
      this.responseManager.error.errorMessage = error.status.message
    })
  }

  ngOnDestroy() {
    this.responseManager.success.successMessage = "";
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
