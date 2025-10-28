import {Injectable} from '@angular/core';
import { environment  } from './../../../environments/environment';
let basePath = environment.base_path
 const apiVersion = basePath + '/api/v1/';
let headers = new Headers({'Content-Type': 'application/json'});
import { CookieService } from 'ngx-cookie-service';

import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(public cookieService: CookieService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({headers: req.headers.set('Authorization', `Bearer ${this.cookieService.get('token')} `)});
    req = req.clone({url: apiVersion + req.url});
    req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    return next.handle(req);
  }
}


