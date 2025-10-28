import { Injectable } from '@angular/core';
import { Router, Resolve } from '@angular/router'
import { UserService } from '../services/user.service';

@Injectable()
export class UserResolver implements Resolve<any>{
    constructor(private userService: UserService, private router: Router) { }

    resolve(): Promise<any> {
        return new Promise((resolve, reject) => {
            let user = this.userService.user;
            if (user) {
                resolve(user)
            }
            else {
                this.router.navigate(['/login'])
                reject(false)
            }
        })
    }
}