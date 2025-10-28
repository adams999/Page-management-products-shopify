import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class StoreService {

    products: any = {};

    constructor(private http: HttpClient, private cookieService: CookieService) {
    }
    checkStoreLoggedIn(accountType:any){
        let url = `web/accounts/check-account-status/${accountType}`
        return this.http.get(url)
    }
    getAndStoreVideoSource(channelId,accountType,userId){
        let url = `video/${accountType}/connect-channel/${channelId}/${userId}`
        return this.http.get(url)
    }
    getAndStoreEcommerceSource(storeId, userId){
        this.cookieService.get('token');
        console.log("token",   this.cookieService.get('token'))
        // https://7e7fdf10.ngrok.io/shopify?store=${this.storeDetails.storeId}&userId=${this.user._id}&accountType=shopify
    }

    createShopConnection(shop){
        let url = "web/accounts/create-shop-connection?shop=" + shop
        return this.http.get(url)
    }
}
