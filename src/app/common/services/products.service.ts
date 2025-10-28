import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProductService {

    products: any = {};

    constructor(private http: HttpClient) {
    }
    getProducts (accountId:any,filterKey:any){
        let url = `web/products/${accountId}`
        return this.http.get(url,{params: filterKey});
      }
      getProductsFilters (accountId:any, filterKey:any){
        let url = `web/products/${accountId}`
        return this.http.get(url,{params: filterKey});
      }
      getAllProducts (accountId:any){
        let url = `web/products/all-products/${accountId}`
        return this.http.get(url);
      }
}