import { Component, OnInit,Input } from '@angular/core';
import { ChartsService } from '../../../common/services/charts.service'
import * as moment from 'moment';

@Component({
  selector: 'app-analytics-overview',
  templateUrl: './analytics-overview.component.html',
  styleUrls: ['./analytics-overview.component.scss']
})
export class AnalyticsOverviewComponent implements OnInit {
  @Input() generalAnalytics: any
  lineChartAnalytics: any;
  selectedOptionForLineChart = "Total Streams View by Duration"
  dayFilterOptions=[
    {value:7,text:"Last 7 Days"},
    {value:14,text:"Last 14 Days"},
    {value:30,text:"Last 30 Days"},
    {value:90,text:"Last 90 Days"}
  ];
  dayFilter=this.dayFilterOptions[2];
  
  changeSelectedOptionForLineChart(newOption: string) {
    this.selectedOptionForLineChart = newOption;
    if (newOption == 'Total Streams View by Duration') {
      this.lineChartAnalytics[0].data = this.generalAnalytics.intervals
      this.lineChartAnalytics[0].dataLabels = this.generalAnalytics.intervalsLabels
    }
    else if (newOption == 'Total Sales') {
      this.lineChartAnalytics[0].data = this.generalAnalytics.sales
      this.lineChartAnalytics[0].dataLabels = this.generalAnalytics.salesLabels
    }
    else if (newOption == "Average Sale Amount") {
      this.lineChartAnalytics[0].data = this.generalAnalytics.average
      this.lineChartAnalytics[0].dataLabels = this.generalAnalytics.averageLabels
    }
    else if (newOption == "Video Converter Rate") {
      this.lineChartAnalytics[0].data = this.generalAnalytics.conversion
      this.lineChartAnalytics[0].dataLabels = this.generalAnalytics.conversionLabels
    }
  }

  showLineChart: boolean = false;

  constructor(private chartService: ChartsService) { }

  ngOnInit() {
    this.filterDateAndGetChartData(30);
  }

  applyDaysFilter(index:any){
    
    this.dayFilter=this.dayFilterOptions[index];
    this.filterDateAndGetChartData(this.dayFilter.value)

  }

  filterDateAndGetChartData(day:any){
    let startDate = moment().subtract(2*day,'d').format('YYYY-MM-DD');
    let endDate = moment(startDate).add(day,'d').format('YYYY-MM-DD');
    let endDate2 = moment(endDate).add(day,'d').format('YYYY-MM-DD')
    this.chartService.getGeneralChartData(startDate,endDate).subscribe((res:any)=>{
      let previousGeneralAnalytics = JSON.parse(res.body)
      this.chartService.getGeneralChartData(endDate,endDate2).subscribe((res2:any) =>{
        this.generalAnalytics = JSON.parse(res2.body)
        this.generalAnalytics.salesPercentage = (this.generalAnalytics.totals.sales-previousGeneralAnalytics.totals.sales)/(this.generalAnalytics.totals.sales+previousGeneralAnalytics.totals.sales)*100;
        this.generalAnalytics.averagePercentage = (this.generalAnalytics.totals.average-previousGeneralAnalytics.totals.average)/(this.generalAnalytics.totals.average+previousGeneralAnalytics.totals.average)*100;
        this.generalAnalytics.conversionPercentage = (this.generalAnalytics.totals.conversion-previousGeneralAnalytics.totals.conversion)/(this.generalAnalytics.totals.conversion+previousGeneralAnalytics.totals.conversion)*100;
      })
    })
  }

}
