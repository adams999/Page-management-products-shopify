import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlHandlingStrategy } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthenticationComponent } from './authentication.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component';
import { PaymentInfoComponent } from './payment-info/payment-info';
import { AboutUsComponent } from './about-us/about-us.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';
import { ContactComponent } from './contact-us/contact-us.component';
import { TeampageComponent } from './teampage/teampage.component';
import { CardComponent } from './teampage/card/card.component';
import { ForgotPassComponent } from './forgot-pass/forgot-pass.component';
import { ResetPwdComponent } from './reset-pwd/reset-pwd.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { AcceptablePolicyComponent } from './acceptable-policy/acceptable-policy.component';


const routes: Routes = [
  {
    path: '',
    component: AuthenticationComponent,
    children: [
      {
        path: 'sign-up',
        component: SignUpComponent
      },
      {
        path: 'forgot-password',
        component: ForgotPassComponent
      },
      {
        path: 'reset-password',
        component: ResetPwdComponent
      },
      {
        path: 'sign-in',
        component: SignInComponent,
      },
      {
        path: 'subscription-plan',
        component: SubscriptionPlansComponent,
      },
      {
        path: 'payment-info',
        component: PaymentInfoComponent,
      },
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'about-us',
        component: AboutUsComponent,
      },
      {
        path: 'contact-us',
        component: ContactComponent,
      },
      {
        path: 'faqs',
        component: FaqComponent,
      },
      {
        path: 'our-team',
        component: TeampageComponent,
      },
      {
        path: 'privacy-policy',
        component: PrivacyPolicyComponent
      },
      {
        path: 'usage-policy',
        component: AcceptablePolicyComponent
      }
    ]

  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class authenticationRoutesModule {
}
