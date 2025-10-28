import { Chart } from 'chart.js';
import { Component, ElementRef, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-single',
  templateUrl: './line-single.component.html',
  styleUrls: ['./line-single.component.scss']
})
export class LineSingleComponent implements OnInit, OnChanges {

  @Input() dataChart:{
    data:[],
    labels:[],
    label:"",
  }
  ctx:ElementRef;
  myLineChart:Chart;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(): void {
    this.myLineChart = new Chart(this.elementRef.nativeElement.querySelector('#lineChart'), {
      type: 'line',
      maintainAspectRatio: false,
      data:{
        datasets: [{
          label: this.dataChart.label,
          data: this.dataChart.data,
          lineTension: 0,
          fill: true,
          borderColor: "#5579F3",
          borderWidth: 0,
          // borderDash: [5, 5],
          backgroundColor: "rgba(204,214,251,0.2)",
          pointBackgroundColor: "#5579F3",
          pointBorderColor: "#5579F3",
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: this.dataChart.labels,
    },
    options: {
      scales: {
          yAxes: [{
              stacked: true
          }]
      }
    }
  });
  }

  ngOnInit() {
  }

}
