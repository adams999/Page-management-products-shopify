import { Injectable } from '@angular/core';
import { HttpClient, HttpBackend} from '@angular/common/http';
import {UserService} from './user.service'

@Injectable()

export class ChartsService {
    private httpClient: HttpClient;
    private basePath:String;
    constructor(handler: HttpBackend,private userService:UserService) {
        this.httpClient = new HttpClient(handler)
        this.basePath="https://0gahn4l1bj.execute-api.us-east-1.amazonaws.com/prod/salesdata";
    }

    getGeneralChartData(sDate:any,eDate:any) 
    {
        let userId=this.userService.getUserInfo()._id;
        let startDate = sDate;
        let endDate = eDate;
       return this.httpClient.get(this.basePath+`?startDate=${startDate}&endDate=${endDate}&streamerId=${userId}&queryType=aggregates`)
    }

    getTopProductsChartData(sDate:any,eDate:any) {
        let userId=this.userService.getUserInfo()._id;
        let startDate = sDate;
        let endDate = eDate;
       return this.httpClient.get(this.basePath+`?startDate=${startDate}&endDate=${endDate}&streamerId=${userId}&queryType=topProducts`)
    }

}