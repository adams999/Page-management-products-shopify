import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsComponent } from "./settings.component";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxStripeModule } from 'ngx-stripe';
import { environment  } from './../../../environments/environment';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountFormComponent } from './accounts/account-form/account-form.component';

@NgModule({
  declarations: [
    SettingsComponent,
    ProfileSettingsComponent,
    AccountsComponent,
    AccountFormComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    CommonModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(environment.stripe_public_key),
  ],
  // schemas: [ NO_ERRORS_SCHEMA ]

})
export class SettingsModule { }
