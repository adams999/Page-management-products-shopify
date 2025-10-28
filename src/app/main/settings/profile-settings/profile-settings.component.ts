import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { UserService } from "src/app/common/services/user.service";
import { PlanService } from "src/app/common/services/plan.service";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { AWSService } from "src/app/common/services/s3.service";
import {
  StripeService,
  ElementOptions,
  ElementsOptions,
  StripeCardComponent,
} from "ngx-stripe";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
@Component({
  selector: "profile-settings-app",
  templateUrl: "./profile-settings.html",
  styleUrls: ["./profile-settings.scss"],
})
export class ProfileSettingsComponent implements OnInit {
  form_invalid: boolean;
  companyForm: FormGroup;
  profileForm: FormGroup;
  pSubmitted: boolean = false;
  cSubmitted: boolean = false;
  chSubmitted: boolean = false;
  chPassSubmitted: boolean = false;
  change: string = "";
  changeForm: FormGroup;
  changeEmail: FormGroup;
  changePassword: FormGroup;
  changeModalError: any;
  user_id: string = "";
  store_name: string = "";
  constructor(
    private userService: UserService,
    private awsSer: AWSService,
    private planService: PlanService,
    private modalService: NgbModal,
    private stripeService: StripeService,
    private _formBuilder: FormBuilder
  ) {}
  @ViewChild(StripeCardComponent) creditCard: StripeCardComponent;
  @ViewChild("closebutton") closebutton;
  @ViewChild("closeChangeModal") closeChangeModal: ElementRef;
  defaultImageUrl =
    "https://simustream-files.s3.amazonaws.com/User-Default.jpg";
  header = "Settings";
  userValid = {
    fname: false,
    lname: false,
    email: false,
    phone: false,
    country: false,
    city: false,
    pass: false,
  };
  user: any = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "",
    phoneNumber: "",
    address: "",
    city: "",
    postalCode: "",
    imageUrl: "",
    pq_type: "",
    pq_source_video: "",
    pq_source_image: "",
    from_pc: "",
    from_url: "",
    from_youtube: "",
  };
  plansToUpgrade = [];
  plans: any = {};
  modalOption: NgbModalOptions = {};
  modalReference: any = "";
  closeResult: any = "";
  card: any = {
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  };
  defaultProductImage =
    "https://simustream-files.s3.amazonaws.com/default_product.jpg";
  planName = "";
  upgradeDetails: any = {};
  disableButton: Boolean = false;
  planUser: any = {};
  referralData: any = {
    referralEmail: "",
  };
  responseMessage: any = {
    emailSent: "",
    errorEmail: "",
  };
  errorMessage: any = {
    cardResponse: "",
    accountMessage: "",
  };
  buttonDisable: Boolean = false;
  imgDisableButton: Boolean = false;
  userLinkedAccounts: any;
  accountImages = {
    youtubeImg: "https://simustream-files.s3.amazonaws.com/youtube-icon.png",
    shopifyImg: "https://simustream-files.s3.amazonaws.com/shopify-icon.png",
  };
  userIsActive: Boolean = false;
  loader: Boolean = true;
  paymentCheck: any = "";
  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#31325F",
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: "18px",
        "::placeholder": {
          color: "#CFD7E0",
        },
      },
    },
  };
  imageUpdate: Boolean = false;
  elementsOptions: ElementsOptions = {
    locale: "en",
  };
  ngOnInit() {
    this.profileForm = this._formBuilder.group({
      _id: [""],
      pq_userId: [""],
      store_name: [""],
      firstName: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z ]*$"),
          Validators.maxLength(40),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z ]*$"),
          Validators.maxLength(40),
        ],
      ],
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"),
          Validators.maxLength(50),
        ],
      ],
      password: ["", [Validators.required, Validators.minLength(8)]],
      country: ["", [Validators.pattern("^[a-zA-Z ]*$")]],
      phoneNumber: ["", [Validators.required, Validators.minLength(10)]],
      address: [""],
      city: ["", Validators.pattern("^[a-zA-Z ]*$")],
      postalCode: [""],
      imageUrl: [""],
      pq_type: [""],
      pq_source_video: [""],
      pq_source_image: [""],
      from_pc: [""],
      from_url: [""],
      from_youtube: [""],
    });
    this.companyForm = this._formBuilder.group({
      name: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z ]*$"),
          Validators.maxLength(40),
        ],
      ],
      type: ["", [Validators.required, Validators.pattern("^[a-zA-Z ]*$")]],
      phone: ["", [Validators.required, Validators.minLength(10)]],
      address: [""],
      ein: [""],
      city: [""],
      postalCode: [""],
      website: [""],
      logo: ["https://simustream-files.s3.amazonaws.com/default_product.jpg"],
      country: [""],
    });
    this.changeEmail = this._formBuilder.group({
      newEmail: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$"),
          Validators.maxLength(50),
        ],
      ],
      currentPassword: ["", [Validators.required]],
    });
    this.changePassword = this._formBuilder.group(
      {
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        currentPassword: ["", [Validators.required]],
        confirmPassword: ["", Validators.required],
      },
      {
        validator: this.MustMatch("newPassword", "confirmPassword"),
      }
    );
    this.userService.getUpdatedUser().subscribe((res: any) => {
      this.setProfileForm(res.body.user);
      this.getPlans(res.body.user);
      this.paymentCheck = res.body.user.stripeCustomerId
        ? res.body.user.stripeCustomerId
        : "";
      this.userIsActive = res.body.user.isActive;
    });
    this.getUserAccounts();
    this.getUserCompanyInfo();
  }
  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  getUserCompanyInfo() {
    this.userService
      .getUserCompanyInfo()
      .then((res: any) => {
        if (res.body.companyInfo) {
          this.setCompanyInfoForm(res.body.companyInfo);
        }
      })
      .catch((error) => {
        // console.log(error)
      });
  }
  submitCompanyInfo() {
    if (this.companyForm.status == "VALID" || this.imageUpdate) {
      this.userService
        .saveUserCompanyInfo(this.companyForm.value)
        .then((res: any) => {
          this.imageUpdate = false;
        })
        .catch((error) => {
          // console.log(error)
        });
    } else {
      return;
    }
  }
  setCompanyInfoForm(companyInfo) {
    this.companyForm.controls["name"].setValue(companyInfo.name);
    this.companyForm.controls["type"].setValue(companyInfo.type);
    this.companyForm.controls["website"].setValue(companyInfo.website);
    this.companyForm.controls["ein"].setValue(companyInfo.ein);
    this.companyForm.controls["country"].setValue(companyInfo.country);
    this.companyForm.controls["phone"].setValue(companyInfo.phone);
    this.companyForm.controls["address"].setValue(companyInfo.address);
    this.companyForm.controls["city"].setValue(companyInfo.city);
    this.companyForm.controls["postalCode"].setValue(companyInfo.postalCode);
    this.companyForm.controls["logo"].setValue(companyInfo.logo);
  }

  setProfileForm(user) {
    this.user_id = user._id;
    this.profileForm.controls["_id"].setValue(user._id);
    this.profileForm.controls["pq_userId"].setValue(user._id);
    this.profileForm.controls["firstName"].setValue(user.firstName);
    this.profileForm.controls["lastName"].setValue(user.lastName);
    this.profileForm.controls["email"].setValue(user.email);
    this.profileForm.controls["password"].setValue(user.password);
    this.profileForm.controls["country"].setValue(user.country);
    this.profileForm.controls["phoneNumber"].setValue(user.phoneNumber);
    this.profileForm.controls["address"].setValue(user.address);
    this.profileForm.controls["city"].setValue(user.city);
    this.profileForm.controls["postalCode"].setValue(user.postalCode);
    this.profileForm.controls["imageUrl"].setValue(user.imageUrl);
    this.profileForm.controls["pq_type"].setValue(user.endStream.type);
    this.profileForm.controls["pq_source_video"].setValue(
      user.endStream.source
    );
    this.profileForm.controls["pq_source_image"].setValue(
      user.endStream.source
    );
    this.profileForm.controls["from_pc"].setValue("");
    this.profileForm.controls["from_url"].setValue(user.endStream.url);
    this.profileForm.controls["from_youtube"].setValue(user.endStream.url);
  }

  ngAfterViewInit() {}

  updateUser() {
    if (this.profileForm.status == "VALID") {
      this.userService.updateUserById(this.profileForm.value).subscribe(
        (res: any) => {
          this.imgDisableButton = false;
          this.userService.setUser(res.body.user);
        },
        (error) => {}
      );
    } else {
      return;
    }
  }

  getPlans(user) {
    this.plansToUpgrade = [];
    this.plans = [];
    this.planService.getPlans().subscribe((res: any) => {
      this.plans = res.body.plans;
      this.plans.forEach((element) => {
        if (
          user.plan._id != element._id &&
          user.plan.subscriptionFee < element.subscriptionFee
        ) {
          element.isDisabled = true;
        } else if (user.plan._id == element._id) {
          element.isSelected = true;
        }
        this.plansToUpgrade.push(element);
      });
      this.loader = false;
    });
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
    });
    this.modalReference.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    this.card = {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    };
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  sendReferralCode() {
    this.buttonDisable = true;
    this.userService
      .sendReferralCode(this.referralData)
      .then((res: any) => {
        this.referralData.referralEmail = "";
        this.responseMessage.emailSent = res.status.message;
        this.buttonDisable = false;
        this.clearMessages(this.responseMessage.emailSent);
      })
      .catch((error: any) => {
        this.responseMessage.errorEmail = error.status.message;
        this.buttonDisable = false;
        this.clearMessages(this.responseMessage.errorEmail);
      });
  }

  clearMessages(message) {
    setTimeout(() => {
      this.responseMessage.errorEmail = "";
      this.responseMessage.emailSent = "";
    }, 4000);
  }

  uploadImage(event: any, type) {
    this.imgDisableButton = true;
    const file = event.target.files[0];
    const formData = new FormData();
    this.awsSer.s3Upload(file).then(
      (image) => {
        if (type == "avatar") {
          this.profileForm.controls["imageUrl"].setValue(image);
          this.imgDisableButton = false;
          this.updateUser();
        } else {
          this.companyForm.controls["logo"].setValue(image);
          this.imageUpdate = true;
          this.submitCompanyInfo();
        }
        event.srcElement.value = null;
      },
      (error) => {
        this.imgDisableButton = false;
        // console.log(error)
      }
    );
  }

  checkValid(value, field) {
    if (field == "refemail") {
      return /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(value);
    }
  }

  checkLength(value, field) {
    if (field == "phone") {
      value.length >= 9 && value.length <= 15
        ? (this.userValid.phone = true)
        : (this.userValid.phone = false);
      return value.length >= 9 && value.length <= 15;
    } else if (field == "password") {
      value.length >= 8
        ? (this.userValid.pass = true)
        : (this.userValid.pass = false);
      return value.length >= 8;
    }
  }

  checkFormValidity() {
    let index = Object.values(this.userValid).indexOf(false);
    if (index > -1) {
      this.form_invalid = true;
    } else {
      this.form_invalid = false;
    }
    if (
      this.user.firstName == "" ||
      this.user.lastName == "" ||
      this.user.phoneNumber == "" ||
      this.user.email == "" ||
      this.user.password == "" ||
      this.form_invalid
    ) {
      return true;
    }
    return false;
  }

  chooseFile(type) {
    if (type === "avatar") {
      document.getElementById("file").click();
    } else {
      document.getElementById("logo").click();
    }
  }

  deleteImage() {
    this.profileForm.controls["imageUrl"].setValue(this.defaultImageUrl);
    this.updateUser();
  }

  deleteCompanyImage() {
    this.companyForm.controls["logo"].setValue(this.defaultProductImage);
    this.imageUpdate = true;
    this.submitCompanyInfo();
  }

  getUserAccounts() {
    this.userService
      .getUserAccounts()
      .then((res: any) => {
        console.log("countAccounts",this.countAccounts(res.body.accounts));
        this.userLinkedAccounts = this.countAccounts(res.body.accounts);
        if (!this.userLinkedAccounts.length) {
          this.errorMessage.accountMessage = "No account connected.";
        }
      })
      .catch((error) => {
        // console.log(error)
      });
  }

  openUpgradeModal(plan) {
    this.planName = plan.title;
    this.upgradeDetails.newPlan = plan;
    this.user.plan = this.upgradeDetails.newPlan._id;
  }

  upgradePlan() {
    this.disableButton = true;
    let name = this.user.firstName + " " + this.user.lastName;
    this.stripeService
      .createToken(this.creditCard.getCard(), { name: name })
      .subscribe(async (result) => {
        if (result.token) {
          this.upgradeDetails.token = result.token;
          await this.upgradeWithPayment();
        } else if (result.error) {
          this.disableButton = false;
          this.errorMessage.cardResponse = result.error.message;
          setTimeout(() => {
            this.errorMessage.cardResponse = "";
          }, 5000);
          return;
        }
      });
  }

  upgradeWithPayment() {
    this.planService.upgradePlan(this.upgradeDetails).then(
      (res: any) => {
        this.closebutton.nativeElement.click();
        this.loader = true;
        this.disableButton = false;
        this.user = res.body.user;
        this.paymentCheck = res.body.user.stripeCustomerId
          ? res.body.user.stripeCustomerId
          : "";
        this.getPlans(res.body.user);
        this.userService.checkIfActive();
      },
      (error: any) => {
        this.errorMessage.cardResponse = error.status.message;
        this.disableButton = false;
        setTimeout(() => {
          this.errorMessage.cardResponse = "";
        }, 5000);
      }
    );
  }

  resetForms(change) {
    this.changeModalError = undefined;
    if (change === "email") {
      this.changeEmail.markAsPristine();
      this.changeEmail.markAsUntouched();
      // this.changePassword['controls']['enabled'] = false;
    } else {
      this.changePassword.markAsPristine();
      this.changePassword.markAsUntouched();
    }
  }

  updateCredentials() {
    if (this.change == "email") {
      if (this.changeEmail.status == "VALID") {
        this.userService
          .changeUserCredentials(this.changeEmail.value, "email")
          .then((res: any) => {
            if (res.body.error) {
              this.changeModalError = res.body.error;
              return;
            }
            this.profileForm.controls.email.setValue(res.body.user.email);
            this.closeChangeModal.nativeElement.click();
            this.changeModalError = undefined;
          })
          .catch((error: any) => {
            this.changeModalError = error.status.message.error.errorMessage;
          });
      }
    } else if (this.change == "password") {
      if (this.changePassword.status == "VALID") {
        this.userService
          .changeUserCredentials(this.changePassword.value, "password")
          .then((res: any) => {
            if (res.body.error && res.status.code == 200) {
              this.changeModalError = res.body.error;
              return;
            }
            this.profileForm.controls.password.setValue(res.body.user.password);
            this.closeChangeModal.nativeElement.click();
            this.changeModalError = undefined;
          })
          .catch((error: any) => {
            this.changeModalError = error.status.message;
          });
      }
    }
    setTimeout(() => {
      this.changeModalError = "";
    }, 4000);
  }

  saverange(value) {
    this.store_name = value;
  }

  updateImageOrVideo(event: any, type) {
    const file = event.target.files[0];
    if (file) {
      if (file.type) {
        document.getElementById("loading_gif").classList.remove("d-none");
        document.getElementById("loading_gif").classList.add("d-flex");
        document.getElementById("form_end_stream").classList.add("d-none");
        let setTypeFile = file.type.split("/");
        //const formData = new FormData();
        this.awsSer.s3Upload(file).then(
          (image) => {
            if (type === "endStream") {
              if (setTypeFile[0] === "image") {
                this.profileForm.controls["pq_type"].setValue("image");
                this.profileForm.controls["pq_source_image"].setValue("url");
              } else if (setTypeFile[0] === "video") {
                this.profileForm.controls["pq_type"].setValue("video");
                this.profileForm.controls["pq_source_video"].setValue("url");
              } else {
                alert("Format not valid!");
              }
              this.profileForm.controls["from_url"].setValue(image);
              document.getElementById("loading_gif").classList.remove("d-flex");
              document.getElementById("loading_gif").classList.add("d-none");
              document
                .getElementById("form_end_stream")
                .classList.remove("d-none");
            }
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  typeUpload(value) {
    document.getElementById("pc_upload").classList.add("d-none");
    document.getElementById("url_upload").classList.add("d-none");
    document.getElementById("youtube_upload").classList.add("d-none");
    if (value === "video") {
      document.getElementById("source_stream_end").classList.remove("d-none");
      document.getElementById("for_videos").classList.remove("d-none");
      document.getElementById("for_images").classList.add("d-none");
    } else {
      document.getElementById("source_stream_end").classList.remove("d-none");
      document.getElementById("for_videos").classList.add("d-none");
      document.getElementById("for_images").classList.remove("d-none");
    }
  }

  typeSource(value) {
    if (value === "youtube") {
      document.getElementById("pc_upload").classList.add("d-none");
      document.getElementById("url_upload").classList.add("d-none");
      document.getElementById("youtube_upload").classList.remove("d-none");
    } else if (value === "computer") {
      document.getElementById("pc_upload").classList.remove("d-none");
      document.getElementById("url_upload").classList.add("d-none");
      document.getElementById("youtube_upload").classList.add("d-none");
    } else {
      document.getElementById("pc_upload").classList.add("d-none");
      document.getElementById("url_upload").classList.remove("d-none");
      document.getElementById("youtube_upload").classList.add("d-none");
    }
  }



  /**
   * @Author: andersson arellano
   * @Date: 2021-08-08 03:00:15
   * @Desc: generate array of accounts
   * @param { { accountType: String } } accounts
   */
   countAccounts(accounts:any[]){
    let unique = accounts.filter((item, index)=>{
      return accounts.findIndex((item2)=>item2.accountType === item.accountType) === index;
    });

    let newUnique = unique.map((element)=>{
      let a = 0;
      accounts.forEach((item)=>{
        if(item.accountType === element.accountType){
          a++;
        }
      });
      element.count = a;
      return element;
    });
    console.log(newUnique);
    return newUnique;
  }
}
