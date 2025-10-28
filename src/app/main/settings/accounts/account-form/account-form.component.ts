import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.scss']
})
export class AccountFormComponent implements OnInit {
  @Input () form: any  = {button:'Add'};
  @Output () valueResponse: EventEmitter<any> = new EventEmitter();

  accountImages = {
    youtubeImg: "https://simustream-files.s3.amazonaws.com/youtube-icon.png",
    shopifyImg: "https://simustream-files.s3.amazonaws.com/shopify-icon.png",
  };
  acountForm: FormGroup;

  //form Account
  linkAccount: string = '';
  titleAccount: string = '';
  type:string = 'create';

  constructor(
    private _formBuilder: FormBuilder,

  ) { }

  ngOnInit() {
    this.acountForm = this._formBuilder.group({
      linkAccount: ["", [Validators.required]],
      titleAccount:  ["", [Validators.required]]
    });
    console.log(this.form);
    if(this.form.titleAccount && this.form.linkAccount){
      this.type = 'edit';
      this.acountForm.setValue(
        {
          linkAccount: this.form.linkAccount,
          titleAccount: this.form.titleAccount
        }
      );
    }
  }

  close(){
    this.valueResponse.emit({close: true});
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:21:25
   * @Desc: manage form responses
   */

  action(){
    if(!this.acountForm.valid){
      console.log("error");
      return ;
    }
    this.valueResponse.emit({
      send: true,
      type: this.type,
      account:{
        linkAccount: this.acountForm.value.linkAccount,
        titleAccount: this.acountForm.value.titleAccount,
        _id: (this.form._id)?this.form._id:null
      }
    });
  }

}
