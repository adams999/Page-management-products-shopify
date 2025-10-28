import { Component, OnInit, ElementRef } from '@angular/core';
import { Chart } from 'chart.js'
import { ChartsService } from '../../../common/services/charts.service'
import * as moment from 'moment';

@Component({
  selector: 'app-line-chart-analytics-card',
  templateUrl: './line-chart-analytics-card.component.html',
  styleUrls: ['./line-chart-analytics-card.component.scss']
})
export class LineChartAnalyticsCardComponent implements OnInit {

  BarChart: Chart;
  ctx: any;
  selectedOptionForLineChart = "Total Streams View by Duration";
  generalAnalytics: any;
  lineChartAnalytics: any;
  dayFilter = 'Last 30 days';

  constructor(private elementRef: ElementRef, private chartService: ChartsService) { }


  ngOnInit() {

    this.lineChartAnalytics = [
      {
        heading: 'Total Streams View by Duration'
      },
      {
        heading: 'Total Sales'
      },
      {
        heading: 'Average Sale Amount'
      },
      {
        heading: 'Video Conversion Rate'
      }
    ];
    this.selectedOptionForLineChart = "Total Sales";
    this.filterDateAndGetChartData(30);
  }

  drawChart() {
    Chart.plugins.register({
      beforeDraw: function (c) {
        var legends = c.legend.legendItems;
        legends.forEach(function (e) {
          e.fillStyle = 'white';
          e.border
        });
      }
    });
    var ctx = this.elementRef.nativeElement.querySelector('#barChart');
    ctx.height = 260;
    if (this.BarChart)
      this.BarChart.destroy();
    this.BarChart = new Chart(this.elementRef.nativeElement.querySelector('#barChart'), {
      type: 'line',
      maintainAspectRatio: false,
      data: {
        labels: this.lineChartAnalytics[0].dataLabels,
        datasets: [{
          data: this.lineChartAnalytics[0].data,
          lineTension: 0,
          fill: true,
          borderColor: "#5579F3",
          borderWidth: 0,
          // borderDash: [5, 5],
          backgroundColor: "rgba(204,214,251,0.2)",
          pointBackgroundColor: "#5579F3",
          pointBorderColor: "#5579F3",
          // pointHoverBackgroundColor: "#55bae7",
          // pointHoverBorderColor: "#55bae7",
        }],
      },
      options: {
        // scaleShowLabels: false,
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
        },

        // plugins :{
        //   dataLabels: {
        //     formatter: (value,ctx) =>{
        //       let dataArr = ctx.chart.data.datasets[0].data;
        //       dataArr.map(value => value*100)

        //     }
        // }

        // },

        legend: {
          display: true,
          backgroundColor: "white",
          labels: {
            fontColor: "white",
          }
        },
        scales: {
          yAxes: [{
            fontColor: "white",
            gridLines: {
              drawBorder: true,
              ticks: {
                stepSize: 10,
              }
            },
          }],
          xAxes: [{
            barThickness: 8,
            categorySpacing: 3,
            scaleLabel: {
              display: true,
              labels: ['10s', '30s', '60s', '90s']
            },
            gridLines: {
              display: false,
              drawBorder: false,
              ticks: {
                display: true,
                fontColor: 'white'
              }
            },
          }]
        }
      }
    })
    this.BarChart.canvas.parentNode.style.height = '128px';
  }

  changeSelectedOptionForLineChart(newOption: string) {
    this.selectedOptionForLineChart = newOption;
    if (newOption == 'Total Streams View by Duration') {
      this.lineChartAnalytics[0].data = this.generalAnalytics.intervals
      this.lineChartAnalytics[0].dataLabels = this.generalAnalytics.intervalsLabels
      this.lineChartAnalytics[0].dataLabels = this.lineChartAnalytics[0].dataLabels.map((value: any) => {
        return value + "s"
      })
      this.drawChart()
    }
    else if (newOption == 'Total Sales') {
      this.lineChartAnalytics[0].data = this.generalAnalytics.sales
      this.lineChartAnalytics[0].dataLabels = this.generalAnalytics.salesLabels
      this.drawChart()
    }
    else if (newOption == "Average Sale Amount") {
      this.lineChartAnalytics[0].data = this.generalAnalytics.average
      this.lineChartAnalytics[0].dataLabels = this.generalAnalytics.averageLabels
      this.drawChart()
    }
    else if (newOption == "Video Conversion Rate") {
      this.lineChartAnalytics[0].data = (this.convertIntoPercentage(this.generalAnalytics.conversion))
      this.lineChartAnalytics[0].dataLabels = this.generalAnalytics.conversionLabels
      this.drawChart()
    }
  }

  convertIntoPercentage(array: any) {
    let mappedArray = array.map(value => value * 100)
    return mappedArray
  }

  applyDaysFilter(dayFilter: any) {
    if (dayFilter == "Last 7 days") {
      this.dayFilter = dayFilter
      this.filterDateAndGetChartData(7)
    }
    else if (dayFilter == "Last 14 days") {
      this.dayFilter = dayFilter
      this.filterDateAndGetChartData(14)
    }
    else if (dayFilter == "Last 30 days") {
      this.dayFilter = dayFilter
      this.filterDateAndGetChartData(30)
    }
    else if (dayFilter == "Last 90 days") {
      this.dayFilter = dayFilter
      this.filterDateAndGetChartData(90)
    }
    else if (dayFilter == "Last 180 days") {
      this.dayFilter = dayFilter
      this.filterDateAndGetChartData(180)
    }
    else if (dayFilter == "Last 365 days") {
      this.dayFilter = dayFilter
      this.filterDateAndGetChartData(365)
    }
  }

  filterDateAndGetChartData(day: any) {
    let startDate = moment().subtract(2 * day, 'd').format('YYYY-MM-DD');
    let endDate = moment(startDate).add(day, 'd').format('YYYY-MM-DD');
    let endDate2 = moment(endDate).add(day, 'd').format('YYYY-MM-DD');
    this.chartService.getGeneralChartData(endDate, endDate2).subscribe((res: any) => {
      this.generalAnalytics = JSON.parse(res.body)
      this.changeSelectedOptionForLineChart(this.selectedOptionForLineChart)
    })
  }
}

