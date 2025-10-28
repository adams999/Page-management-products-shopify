import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { environment } from '../../../../environments/environment';

import { AccountService } from './../../../common/services/account.service';
import { UserService } from "src/app/common/services/user.service";
import { VideosService } from 'src/app/common/services/videos.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  user_id: string = "";
  store_name: string = "";
  acountForm: FormGroup;
  storeUrl = environment.store_forwarding_address;
  baseUrl = environment.base_path;

  addFormLink = false;

  //form Account


  formUpdate: any = {
    button: "Add"
  };

  header = "Accounts";

  userLinkedAccounts: any;
  accountImages = {
    youtubeImg: "https://simustream-files.s3.amazonaws.com/youtube-icon.png",
    shopifyImg: "https://simustream-files.s3.amazonaws.com/shopify-icon.png",
  };

  errorMessage: any = {
    cardResponse: "",
    accountMessage: "",
  };



  constructor(
    private _formBuilder: FormBuilder,
    private userService: UserService,
    private accountService: AccountService,
    private videoService: VideosService
  ) { }

  ngOnInit() {
    this.acountForm = this._formBuilder.group({
      linkAccount: ["", [Validators.required]],
      titleAccount:  ["", [Validators.required]]
    });
    this.userService.getUpdatedUser().subscribe((res: any) => {
      console.log(res);
      this.user_id = res.body.user._id;
    });
    this.getUserAccounts();
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:05:58
   * @Desc: get Accounts
   */
  getUserAccounts() {
    this.userService
      .getUserAccounts()
      .then((res: any) => {
        this.userLinkedAccounts = res.body.accounts;
        if (!this.userLinkedAccounts.length) {
          this.errorMessage.accountMessage = "No account connected.";
        }
      })
      .catch((error) => {
        // console.log(error)
      });
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:06:18
   * @Desc: Active Form add link
   */
  addLink(){
    this.addFormLink = !this.addFormLink;
  }


  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:11:16
   * @Desc: add link Account
   * @param { linkAccount:string ,titleAccount:string } accountForm
   */
  addLinkAccount(acountForm){
    let account = {
      userId: this.user_id,
      domain: acountForm.linkAccount,
      accountType:"youtube",
      fromShopify:"false",
      title: acountForm.titleAccount,
      accessToken: acountForm.linkAccount
    }

    this.accountService.createAccounts(account).subscribe(resul=>{
      //console.log("resul",resul);
      this.addFormLink = false;
      this.getUserAccounts();
      this.refreshVideo(resul['body'].account);
    });
  }

/**
 * @Author: andersson arellano
 * @Date: 2021-08-10 02:11:32
 * @Desc: refresh videos
 * @param {_id:String}  videoSourceAccount _id is a Account id
 */
  refreshVideo(videoSourceAccount){
      this.videoService.getUpdatedVideos(videoSourceAccount._id).subscribe((res: any) => {

    })
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:14:14
   * @Desc: add form to edit the account link
   * @param {position: number} position
   */

  editLinkAccount(position){
    this.formUpdate = {
      button : "Edit",
      linkAccount: this.userLinkedAccounts[position].accessToken,
      titleAccount: this.userLinkedAccounts[position].title,
      _id: this.userLinkedAccounts[position]._id
    }
    this.addFormLink = true;
  }

    /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:14:14
   * @Desc: change account state
   * @param {position: number} position
   */
  activeLinkAccount(position){
    console.log("position", position, this.userLinkedAccounts[position]);
    this.accountService.changeState(this.userLinkedAccounts[position]._id).subscribe((res)=>{
      //console.log(res);
      this.getUserAccounts();
    });
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:17:22
   * @Desc:  change account information
   * @param @param { _id:string ,linkAccount:string ,titleAccount:string } accountForm
   */

  updateAccount(acountForm){
    let account = {
      _id: acountForm._id,
      userId: this.user_id,
      domain: acountForm.linkAccount,
      title: acountForm.titleAccount,
      accessToken: acountForm.linkAccount
    }
    this.accountService.updateAccount({account}).subscribe((res)=>{
      //console.log(res);
      this.getUserAccounts();
    });
    }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-10 02:19:17
   * @Desc: funtion to output to account-form
   * @param value it's return of eventEmitter
   */
  response(value){
    //console.log("response", value);
    this.addFormLink = false;
    if(value.send){
      if(value.type === 'create'){
        this.addLinkAccount(value.account);
        this.getUserAccounts();
      }else if(value.type === 'edit'){
        //console.log('editando');
        this.updateAccount(value.account);
      }
    }
  }


}
