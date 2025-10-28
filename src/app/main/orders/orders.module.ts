import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrdersComponent } from "./orders.component";
import { ListOrdersComponent } from "./list-orders/list-orders.component";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '.././../shared/shared.module';
import { NgxPrintModule } from 'ngx-print';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    OrdersComponent,
    ListOrdersComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxPrintModule

  ],
  // schemas: [ NO_ERRORS_SCHEMA ]

})
export class OrdersModule { }
