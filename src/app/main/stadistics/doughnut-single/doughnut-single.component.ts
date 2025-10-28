import { Chart } from "chart.js";
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: "app-doughnut-single",
  templateUrl: "./doughnut-single.component.html",
  styleUrls: ["./doughnut-single.component.scss"],
})
export class DoughnutSingleComponent implements OnInit, OnChanges {
  @Input() dataChart: {
    data: [10, 20, 30],
    labels: ["Red", "Yellow", "Blue"],
    title:""
  };

  ctx: ElementRef;
  myDoughnutChart: Chart;

  constructor(public elementRef: ElementRef) {}

  procesaData(data) {
    console.log(data);
  }

  ngOnChanges(): void {
    this.myDoughnutChart = new Chart(
      this.elementRef.nativeElement.querySelector("#doughnut"),
      {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: this.dataChart.data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
              ],
            },
          ],

          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: this.dataChart.labels,
        },
        options: {
          rotation: -Math.PI,
          cutoutPercentage: 30,
          circumference: Math.PI,
          legend: {
            position: 'left'
          },
          animation: {
            animateRotate: false,
            animateScale: true
          }
        }
      }
    );
  }

  ngOnInit() {}
}
