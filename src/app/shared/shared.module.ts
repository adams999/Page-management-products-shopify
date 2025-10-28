import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ResponseManagerComponent } from './../common/components/response-manager/response-manager.component';
import { LoaderSpinnerComponent } from './../common/components/loader-spinner/loader-spinner.component';
import { DashboardHeaderComponent } from '../main/dashboard-header/dashboard-header.component';
import { CreateFormComponent } from '../common/components/create-form/create-form.component';
import { ProductWrapperComponent } from '../common/components/product-wrapper/product-wrapper.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SidenavComponent, ResponseManagerComponent, LoaderSpinnerComponent, DashboardHeaderComponent, CreateFormComponent,ProductWrapperComponent],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot()
  ],
  exports: [SidenavComponent, ResponseManagerComponent, LoaderSpinnerComponent, DashboardHeaderComponent, CreateFormComponent,ProductWrapperComponent]
})
export class SharedModule { }
