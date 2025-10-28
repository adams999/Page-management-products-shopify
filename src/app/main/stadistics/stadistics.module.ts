import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartSingleComponent } from './chart-single/chart-single.component';
import { BarSingleComponent } from './bar-single/bar-single.component';
import { LineSingleComponent } from './line-single/line-single.component';
import { DoughnutSingleComponent } from './doughnut-single/doughnut-single.component';
import { StadisticsComponent } from './stadistics.component';
import { TableInformationComponent } from './table-information/table-information.component';
import { ProductCardStaditicsComponent } from './product-card-staditics/product-card-staditics.component';

@NgModule({
  declarations: [
    ChartSingleComponent,
    BarSingleComponent,
    LineSingleComponent,
    DoughnutSingleComponent,
    StadisticsComponent,
    TableInformationComponent,
    ProductCardStaditicsComponent
  ],
  imports: [
    CommonModule
  ],

})
export class StadisticsModule { }
