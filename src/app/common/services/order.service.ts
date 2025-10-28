import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class OrderService {

    products: any = {};

    constructor(private http: HttpClient) {
    }
    getOrders (filterKeys:any){
        let url = `web/orders/`
        return this.http.get(url,{params: filterKeys});
      }
      getOrdersFilter (filterKeys: any){
        let url = `web/orders`
        return this.http.get(url,{params: filterKeys});
      }
      getAllOrders (){
        let url = `web/orders/all-orders`
        return this.http.get(url);
      }
}