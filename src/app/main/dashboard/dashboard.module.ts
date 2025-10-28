import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { AnalyticsOverviewComponent } from './analytics-overview/analytics-overview.component';
import { GeneralAnalyticsCardComponent } from './general-analytics-card/general-analytics-card.component';
import { ConversionalFunnelAnalyticsCardComponent } from './conversional-funnel-analytics-card/conversional-funnel-analytics-card.component';
import { TopProductsAnalyticsCardComponent } from './top-products-analytics-card/top-products-analytics-card.component';
import { LineChartAnalyticsCardComponent } from './line-chart-analytics-card/line-chart-analytics-card.component';
@NgModule({
  declarations: [
      DashboardComponent,
      AnalyticsOverviewComponent,
      GeneralAnalyticsCardComponent,
      ConversionalFunnelAnalyticsCardComponent,
      TopProductsAnalyticsCardComponent,
      LineChartAnalyticsCardComponent

  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  // schemas: [ NO_ERRORS_SCHEMA ]

})
export class DashboardModule { }
