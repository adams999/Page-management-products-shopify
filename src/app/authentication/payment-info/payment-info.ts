import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from "../../common/services/user.service";
import { ResponseManagerService } from 'src/app/common/services/response-manager.service';
import {
  StripeService,
  ElementOptions,
  ElementsOptions,
  StripeCardComponent
} from 'ngx-stripe';
@Component({
  selector: 'payment-info-app',
  templateUrl: './payment-info.html',
  styleUrls: ['./payment-info.scss']
})
export class PaymentInfoComponent implements OnInit {
  constructor(private userService: UserService,
    private responseManager: ResponseManagerService, private stripeService: StripeService) {
  }
  @ViewChild(StripeCardComponent) creditCard: StripeCardComponent;
  plan: any = ''
  card: any = {
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  }
  user: any = {}
  errorMessage : any = {
    cardResponse:""
 }
 buttonDisable : boolean = false
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'))
  }

  getPaymentToken(){
    this.buttonDisable = true;
    let name = this.user.firstName + ' ' + this.user.lastName
    this.stripeService
    .createToken(this.creditCard.getCard(), { name: name })
    .subscribe(result => {
      if (result.token) {
        this.user.cardToken = result.token;
        this.signUp();
      } else if (result.error) {
        this.buttonDisable = false;
        this.errorMessage.cardResponse = result.error.message
        setTimeout(()=>{
          this.errorMessage.cardResponse = ""
        },5000)
        return ;
      }
     
    });
  }

   signUp() {
      this.userService.signUp(this.user).then((res) => {
        localStorage.removeItem('user');
      }).catch((error) => {
        this.buttonDisable = false;
        this.errorMessage.cardResponse = error.status.message;
        setTimeout(()=>{
          this.errorMessage.cardResponse = ""
        },5000)
      })
  }

  validateMonthOfExpiryDate(currentMonth, monthAddedByUser) {

    if ((monthAddedByUser >= 1 && monthAddedByUser <= 12) && ((currentMonth == monthAddedByUser) || (currentMonth < monthAddedByUser))) {
      return true
    }
    else {
      return false
    }

  }

  validateYearOfExpiryDate(currentYear, yearAddedByUser) {

    if (currentYear <= yearAddedByUser) {
      return true;
    }
    else {
      return false;
    }

  }

  ngOnDestroy() {
    this.responseManager.error.errorMessage = "";
  }
  
}

