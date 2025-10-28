import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ResponseManagerService } from './response-manager.service';

@Injectable()
export class AccountService {
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private responseManager: ResponseManagerService
    ) {}

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-06 02:35:45
   * @Desc: add account
   *  @param  {{userId: string, domain: string, accountType: string, fromShopify: string, title: string, accessToken: string}} data
   *  @returns
   */

  createAccounts(data:any) {
    return this.http.post('web/accounts/create-account', data);
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 01:25:19
   * @Desc: change state Account
   * @param {id_account: string} id_account
   */
  changeState(id_account){
    return this.http.get(`web/accounts/change-state/${id_account}`);
  }


  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:22:42
   * @Desc: uptade account information
   * @param {_id: string, userId: string, domain: string, title: string, accessToken: string} data
   */
  updateAccount(data:any){
    return this.http.put('web/accounts/update-account', data);
  }
}
