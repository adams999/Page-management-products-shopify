import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authenticationRoutesModule } from './authentication.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationComponent } from './authentication.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { PaymentInfoComponent } from './payment-info/payment-info';
import { SharedModule } from '../shared/shared.module';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact-us/contact-us.component';
import { TeampageComponent } from './teampage/teampage.component';
import { CardComponent } from './teampage/card/card.component';
import { NgxStripeModule } from 'ngx-stripe';

import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AcceptablePolicyComponent } from './acceptable-policy/acceptable-policy.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { environment  } from './../../environments/environment';

@NgModule({
  declarations: [
    AuthenticationComponent,
    SignUpComponent,
    SignInComponent,
    SubscriptionPlansComponent,
    PaymentInfoComponent,
    HomeComponent,
    AboutUsComponent,
    MainHeaderComponent,
    MainFooterComponent,
    FaqComponent,
    ContactComponent,
    TeampageComponent,
    CardComponent,
    ForgotPassComponent,
    ResetPwdComponent,
    PrivacyPolicyComponent,
    AcceptablePolicyComponent
  ],
  imports: [
    CommonModule,
    authenticationRoutesModule,
    NgbModule.forRoot(),
    FormsModule,
    SharedModule,
    NgxStripeModule.forRoot(environment.stripe_public_key),
    ReactiveFormsModule,
    PdfViewerModule
  ],
  // schemas: [ NO_ERRORS_SCHEMA ]

})
export class AuthenticationModule { }
