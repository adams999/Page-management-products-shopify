import { Component, OnInit, Input, ElementRef } from '@angular/core'
import { Chart } from 'chart.js';
import { ChartsService } from '../../../common/services/charts.service'
import * as moment from 'moment';

@Component({
    selector: 'app-top-products-analytics-card',
    templateUrl: './top-products-analytics-card.component.html',
    styleUrls: ['./top-products-analytics-card.component.scss']
})

export class TopProductsAnalyticsCardComponent implements OnInit {
    BarChart: any;
    ctx: any;
    responseData: any;
    constructor(private elementRef: ElementRef, private chartService: ChartsService) { }
    @Input() dayFilter;
    analytics = { labels: [], views: [], sales: [] };

    ngOnInit() {
    }

    ngOnChanges() {
        this.getChartAnalytics(this.dayFilter.value);
    }

    getChartAnalytics(daysSub: any) {
        let startDate = moment().subtract(daysSub, 'd').format('YYYY-MM-DD');
        let endDate = moment().format('YYYY-MM-DD');
        this.chartService.getTopProductsChartData(startDate, endDate).subscribe((res: any) => {
            this.responseData = JSON.parse(res.body);

            let that = this;
            that.analytics.labels = [];
            that.analytics.sales = [];
            that.analytics.views = [];
            this.responseData.sales.forEach(function (item, i) {
                if (item.productName.length > 16) {
                    item.productName = item.productName.substring(0, 15) + "..."
                }
                that.analytics.labels.push(item.productName);
                that.analytics.views.push(item.views);
                that.analytics.sales.push(item.sales);

            });
            this.updateChart();


        })
    }

    updateChart() {
        Chart.defaults.global.defaultFontFamily = "sofia-pro-regular, sans-serif";
        Chart.defaults.global.defaultFontSize = 15;
        Chart.defaults.global.defaultFontColor = "#354168";
        var ctx = this.elementRef.nativeElement.querySelector('#barChart')
        if (this.BarChart)
            this.BarChart.destroy();
        this.BarChart = new Chart(this.elementRef.nativeElement.querySelector('#barChart'), {
            type: 'horizontalBar',
            showTooltips: false,
            data: {
                labels: this.analytics.labels,
                datasets: [
                    {
                        data: this.analytics.sales,
                        backgroundColor: 'rgb(85,121,243, 0.8)',
                        borderWidth: 1,
                        borderSkipped: 'bottom'
                    },
                    {
                        data: this.analytics.views,
                        borderWidth: 1,
                        borderSkipped: 'bottom'
                    },

                ],

            },
            options: {
                showDatapoints: true,
                scaleShowLabels: false,
                legend: {
                    display: false,
                    labels: {
                        fontColor: 'white',
                    }
                },
                tooltips: {
                    enabled: true,
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.yLabel;
                        }
                    }
                },
                scales: {
                    yAxes: [{
                        barThickness: 8,
                        scaleShowLabels: false,
                        gridLines: {
                            display: false,
                            drawBorder: false,
                            categoryPercentage: 2.0,
                            barPercentage: 2.0,
                            ticks: {
                                min: 0,
                            }
                        },
                    }],
                    xAxes: [{
                        display: false,
                        barThickness: 1,
                        categoryPercentage: 4.0,
                        barPercentage: 3.0,
                        categorySpacing: 3,
                        gridLines: {
                            display: false,
                            drawBorder: false,
                            //   offsetGridlines: true,
                            ticks: {
                                display: false,
                            }
                        },
                    }]
                },
            },
        })
    }

}
