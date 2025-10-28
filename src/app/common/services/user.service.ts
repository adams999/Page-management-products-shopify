import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { ResponseManagerService } from './response-manager.service';
import { BehaviorSubject } from 'rxjs';
import { environment  } from './../../../environments/environment';
const publicKey = environment.stripe_public_key;

@Injectable()
export class UserService {
  profile = new BehaviorSubject('');
  newUser = this.profile.asObservable();
  user: any = {};
  isActive: boolean = false
  isApiLimitReached: boolean = false
  isCardExpired: boolean = false
  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService, private responseManager: ResponseManagerService) {
  }

  setUser(img) {
    this.profile.next(img);
  }

  getMe() {
    return new Promise((resolve, reject) => {
      if (Object.keys(this.user).length != 0) {
        resolve({ body: { user: this.user } })
      }
      else {
        this.http.get('web/users/me', {}).subscribe((res: any) => {
          Object.assign(this.user, res.body.user)
          resolve(res)
        }, (error: any) => {
          reject(error.error)
        })
      }
    })
  }

  getUserInfo() {
    return this.user;
  }

  signIn(user: any) {
    return new Promise((resolve, reject) => {
      this.http.post('web/users/sign-in', user).subscribe((res: any) => {
        this.cookieService.set('token', res.body.token, 15);
        sessionStorage.removeItem('shop');
        this.router.navigate(['/list-streams'])
        resolve(res);
      }, (error: any) => {
        console.log(error)
        reject(error.error);
      });
    });
  }

  forgotPassword(user: any) {
    return new Promise((resolve, reject) => {
      this.http.post('web/users/forgot-password', user).subscribe((res: any) => {
        resolve(res)
      }, (error: any) => {
        console.log(error)
        reject(error)
      });
    });
  }

  resetPassword(user, userId) {
    return new Promise((resolve, reject) => {
      this.http.put('web/users/reset-password/' +
        userId, user).subscribe((res: any) => {
          this.cookieService.set('token', res.body.token, 15);
          this.router.navigate(['/list-streams'])
          resolve(res)
        }, (error: any) => {
          reject(error)
        });
    });
  }

  signUp(user: any) {
    return new Promise((resolve, reject) => {
      this.http.post('web/users/sign-up', user).subscribe((res: any) => {
        this.cookieService.set('token', res.body.token, 15);
        sessionStorage.removeItem('shop');
        this.router.navigate(['/list-streams'])
        resolve(res);
      }, (error: any) => {
        console.log(error)
        reject(error.error);
      });
    });
  }

  logout() {
    this.user = {}
    this.cookieService.deleteAll();
    this.router.navigate(['/sign-in'])
  }

  resendEmail(user: any) {
    return new Promise((resolve, reject) => {
      this.http.post('web/users/re-send-email', user).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        console.log(error)
        reject(error.error);
      });
    });
  }

  checkIfActive() {
    return this.http.get('web/users/me', {}).subscribe((res: any) => {
      console.log("user service check if active");
      
      this.isActive = res.body.user.isActive;
      if (res.body.user.apiLimits.videoViewsLimitReached || res.body.user.apiLimits.transactionsLimitReached || res.body.user.apiLimits.maxVideosLimitReached) {
        this.isApiLimitReached = true;
      }
      else {
        this.isApiLimitReached = false
      }
      this.isCardExpired = res.body.user.isCardExpired;
      if (!this.isActive) {
        this.responseManager.warning.warningMessage = "Email Verification";
        this.responseManager.warning.isTimer = false;
        this.responseManager.warning.email = res.body.user.email;
        this.responseManager.warning.user = res.body.user;
        this.responseManager.warning.warningNote = "We have sent a verification email to " + res.body.user.email + ". Please activate your account with the link in this email. If you cannot find the mail, you can resend the verification email.";
        this.responseManager.warning.actionButton = "Resend Email";
        this.responseManager.warning.actionParam = "isActive";
      }
      if (this.isApiLimitReached) {
        this.responseManager.warning.warningMessage = "Plan Limit Reached";
        this.responseManager.warning.isTimer = false;
        this.responseManager.warning.email = res.body.user.email;
        this.responseManager.warning.user = res.body.user;
        this.responseManager.warning.warningNote = "You have reached your current plan limit. Please upgrade your plan to continue using Simustream.";
        this.responseManager.warning.actionButton = "Upgrade Plan";
        this.responseManager.warning.actionParam = "isApiLimitReached";

      }
      if (this.isCardExpired) {
        this.responseManager.warning.warningMessage = "Card Expired";
        this.responseManager.warning.isTimer = false;
        this.responseManager.warning.email = res.body.user.email;
        this.responseManager.warning.user = res.body.user;
        this.responseManager.warning.warningNote = "Your card has expired. Please renew your card.";
        this.responseManager.warning.actionButton = "";
        this.responseManager.warning.actionParam = "isCardExpired";

      }
      if (!this.isApiLimitReached && this.isActive && !this.isCardExpired) {
        this.responseManager.warning.warningMessage = "";
      }

    }, (error: any) => {
    })
  }

  updateUserById(user: any) {
    let url = `web/users/update-user/${user._id}`;
    return this.http.put(url, user);
  }

  sendReferralCode(referralData) {
    return new Promise((resolve, reject) => {
      this.http.post('web/users/send-referral-code', referralData).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        console.log(error)
        reject(error.error);
      });
    });
  }

  uploadImage(image: any) {
    return new Promise((resolve, reject) => {
      this.http.post('web/upload/upload-image', image).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        console.log(error)
        reject(error.error)
      })
    })
  }

  getUserAccounts() {
    return new Promise((resolve, reject) => {
      this.http.get('web/accounts/user-accounts').subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error.error)
      })
    })
  }

  // createToken(card) {
  //   console.log("this.card", card, publicKey)

  //   console.log("this.card", card, publicKey)

  // }

  getUserCompanyInfo() {
    return new Promise((resolve, reject) => {
      this.http.get('web/companyInfos/company-information').subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error.error)
      })
    })
  }

  saveUserCompanyInfo(companyInfo) {
    return new Promise((resolve, reject) => {
      this.http.post('web/companyInfos/add-company-information', companyInfo).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error.error)
      })
    })
  }

  getUpdatedUser() {
    let url = 'web/users/me';
    return this.http.get(url);
  }
  getUserExists(userInfo) {
    let url = 'web/users/check-user-exists';
    return this.http.get(url,{params: userInfo});
  }
  changeUserCredentials(data, change) {
    return new Promise((resolve, reject) => {
      this.http.put(`web/users/change-${change}`, data).subscribe((res: any) => {
        resolve(res);
      }, (error: any) => {
        reject(error.error)
      })
    })
  }
}