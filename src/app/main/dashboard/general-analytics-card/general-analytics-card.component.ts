import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { Chart } from 'chart.js'
import { ChartsService } from '../../../common/services/charts.service'


@Component({
  selector: 'app-general-analytics-card',
  templateUrl: './general-analytics-card.component.html',
  styleUrls: ['./general-analytics-card.component.scss']
})
export class GeneralAnalyticsCardComponent implements OnInit {

  @Input() generalAnalytics: any
  ctx: any;
  dayFilter = 'Last 30 days'
  generalCard = [ 
    {
      heading: 'Total Sales',
      mainLogo: 'assets/icons-simustream/card-dollar.svg',
      image: 'assets/icons-simustream/card-dollar.svg',
      statsImage: '',
      statsValue: '',
      labels: [],
      data:[],
      totalValue: 0,
      cardRef:null
    },
    {
      heading: 'Average Sale Amount',
      mainLogo: 'assets/icons-simustream/statistic.svg',
      image: 'assets/icons-simustream/statistic.svg',
      statsImage: '',
      statsValue: '',
      labels: [],
      data:[],
      totalValue: 0,
      cardRed:null
    },
    {
      heading: 'Video Conversion Rate',
      mainLogo: 'assets/icons-simustream/video.svg',
      image: 'assets/icons-simustream/video.svg',
      statsImage: '',
      statsValue: '',
      labels: [],
      data:[],
      totalValue: 0,
      cardRef:null
    }
  ]
  
  

  

 

  constructor(private elementRef: ElementRef, private chartService: ChartsService) { }

  ngAfterViewInit() {
    Chart.defaults.global.legend.display = false;
    this.generalCard.forEach((chart:any, index) => {
     
     
      if(chart.chartRef)
        chart.chartRef.destroy();

        chart.chartRef = new Chart(this.elementRef.nativeElement.querySelector('#barChart' + index), {
        type: 'bar',
        data: {
          labels: chart.labels,
          datasets: [{
            data: chart.data,
            backgroundColor: [
              'rgb(0,0,0,0.2)'
            ],
            pointHoverBackgroundColor: '#5579F3',
            borderWidth: 0,
            borderSkipped: 'bottom',
          }],
        },
        options: {
          scaleShowLabels: false,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          tooltips: {
            title:"Hello",
            callbacks: {
              label: function (tooltipItem,data) {
                return Math.round(tooltipItem.yLabel);
              }
              
            }
          },
          scales: {
            yAxes: [{
              display: false,
              scaleShowLabels: false,
              gridLines: {
                display: false,
                drawBorder: false,
                categoryPercentage: 0.0,
                ticks: {
                  display: false
                }
              },
            }],
            xAxes: [{
              offset: true,
         
              // categoryPercentage: 2.0,
              // category
              barPercentage: 1.0,
              categorySpacing: 0,
              gridLines: {
                display: false,
                drawBorder: false,
                offsetGridlines: true
              },
                ticks: {
                  display: false
                }
            }]
          },
        }
      })

    });

  }
  ngOnChanges(){
    if(!this.generalAnalytics)
      return;
    this.generalCard[0].labels = this.generalAnalytics.salesLabels;
    this.generalCard[0].data = this.generalAnalytics.sales;
    this.generalCard[0].totalValue = this.isValueInteger(this.generalAnalytics.totals.sales)
    this.generalCard[0].statsValue = this.generalAnalytics.salesPercentage;
    this.generalCard[1].labels = this.generalAnalytics.averageLabels;
    this.generalCard[1].data = this.generalAnalytics.average;
    this.generalCard[1].totalValue = this.isValueInteger(this.generalAnalytics.totals.average);
    this.generalCard[1].statsValue = this.generalAnalytics.averagePercentage;
    this.generalCard[2].labels = this.generalAnalytics.conversionLabels;
    this.generalCard[2].statsValue = this.generalAnalytics.conversionPercentage;
    (this.generalAnalytics.salesPercentage>0) ? this.generalCard[0].statsImage = 'assets/icons-simustream/arrow-diagonal-up.svg' :  this.generalCard[0].statsImage = 'assets/icons-simustream/arrow-diagonal-down.svg';
    (this.generalAnalytics.averagePercentage>0) ? this.generalCard[1].statsImage = 'assets/icons-simustream/arrow-diagonal-up.svg' : this.generalCard[1].statsImage = 'assets/icons-simustream/arrow-diagonal-down.svg';
    (this.generalAnalytics.conversionPercentage>0) ? this.generalCard[2].statsImage = 'assets/icons-simustream/arrow-diagonal-up.svg' : this.generalCard[2].statsImage = 'assets/icons-simustream/arrow-diagonal-down.svg';
    let modifiedConversion=[];
    this.generalAnalytics.conversion.forEach((item, index) => {
      modifiedConversion.push(item*100);
    });
    this.generalCard[2].data = modifiedConversion;
    this.generalCard[2].totalValue =Math.round(this.generalAnalytics.totals.conversion*100);
    this.ngAfterViewInit();
  }

  isValueInteger(value:any){
   return value == null ? 0 : Number(parseFloat(value).toFixed(2))
  }

  ngOnInit() 
  {
    
  }
}
