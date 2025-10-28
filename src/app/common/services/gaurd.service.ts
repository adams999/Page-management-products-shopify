import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { StoreService } from './store.service';
import { CookieService } from 'ngx-cookie-service';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable()
export class GaurdService implements CanActivate {
    constructor(private router: Router, private userService: UserService, private cookieService: CookieService, private storeService: StoreService) { }

    canActivate(): boolean | Observable<boolean> | Promise<boolean> {
        if (!this.cookieService.get('token')) {
            this.router.navigate(['/sign-in']);
            return false;
        }
        return new Promise((resolve, reject) => {
            this.userService.getMe().then((res: any) => {
                if (res.body.user) {
                    if (sessionStorage.getItem('shop')) {
                        
                        let shop = sessionStorage.getItem('shop')
                        this.storeService.createShopConnection(shop).subscribe((res: any) => {
                            sessionStorage.removeItem('shop');
                        })
                    }
                    resolve(true)
                }
                else {
                    this.router.navigate(['/sign-in'])
                    resolve(false)
                }
            }).catch((err) => {
                this.router.navigate(['/sign-in'])
                reject(false)
            })
        })
    }
}