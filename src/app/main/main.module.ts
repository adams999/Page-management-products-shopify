import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { ProductsModule } from './products/products.module'
import { OrdersModule } from './orders/orders.module'
import { SettingsModule } from './settings/settings.module'
import { StreamsModule } from './streams/streams.module'
import { DashboardModule } from './dashboard/dashboard.module';
import { mainRoutesModule } from 'src/app/main/main.routing';
import { MainComponent } from 'src/app/main/main.component';
import { LeadsModule } from './leads/leads.module';
import { StadisticsModule } from './stadistics/stadistics.module'


@NgModule({
    declarations: [
        MainComponent
    ],
    imports: [
        RouterModule,
        CommonModule,
        DashboardModule,
        StreamsModule,
        SettingsModule,
        ProductsModule,
        OrdersModule,
        LeadsModule,
        mainRoutesModule,
        SharedModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        StadisticsModule
    ],
    // schemas: [ NO_ERRORS_SCHEMA ]

})
export class MainModule { }
