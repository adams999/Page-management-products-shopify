import { Component, OnInit, Input } from '@angular/core'

@Component({
    selector: 'app-conversional-funnel-analytics-card',
    templateUrl: './conversional-funnel-analytics-card.component.html',
    styleUrls: ['./conversional-funnel-analytics-card.component.scss']
})

export class ConversionalFunnelAnalyticsCardComponent implements OnInit {
    convensionalFunnelAnalytics= [
        {
            text: 'Clicks',
            value: 0
        },
        {
            text: 'Added to Cart',
            value: 0
        },
        {
            text: 'Purchased',
            value: 0 
        }
    ]
    constructor() {
    }

    @Input () generalAnalytics:any
    ngOnChanges(){
        if(!this.generalAnalytics)
            return;
       
       
       var step1=this.generalAnalytics.funnel[0]
        if(!step1 || step1 ==0)
        {
            this.convensionalFunnelAnalytics[0].value=0;
            this.convensionalFunnelAnalytics[1].value=0;
            this.convensionalFunnelAnalytics[2].value=0;
        }
        else
        {

            this.convensionalFunnelAnalytics[0].value=100;
            this.convensionalFunnelAnalytics[1].value=Math.round((this.generalAnalytics.funnel[1]/this.generalAnalytics.funnel[0])*100);
            this.convensionalFunnelAnalytics[2].value=Math.round(((this.generalAnalytics.funnel[2] || 0 )/this.generalAnalytics.funnel[0])*100);
        }
    }
    ngOnInit(){
    }
}
