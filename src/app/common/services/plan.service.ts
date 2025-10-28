import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PlanService {

    products: any = {};

    constructor(private http: HttpClient) {
    }
    
    getPlans(){
        let url = `web/plans/get-plans`
        return this.http.get(url)
    }

    upgradePlan(upgradeInformation){
            return new Promise((resolve, reject) => {
              this.http.post('web/upgrade/upgrade-plan', upgradeInformation).subscribe((res: any) => {
               resolve(res);
             }, (error: any) => {
               console.log(error)
               reject(error.error);
             });
           });
    }
}