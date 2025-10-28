import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ContactService {

  user: any = {};
  isActive:boolean =false
  constructor(private http: HttpClient) {
  }

  contactUs(contactInfo : any){
    console.log(contactInfo);
    return new Promise((resolve, reject) => {
      this.http.post('web/contact-us/send-contact-us-email', contactInfo).subscribe((res: any) => {
       resolve(res);
     }, (error: any) => {
       console.log(error)
       reject(error.error);
     });
   });
  }
}