import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/common/services/data.service';
import { VideosService } from 'src/app/common/services/videos.service';
import { Router } from "@angular/router";
import { StoreService } from 'src/app/common/services/store.service';
import { ResponseManagerService } from 'src/app/common/services/response-manager.service';
import { UserService } from 'src/app/common/services/user.service';
import { GoogleAnalyticsService } from 'src/app/common/services/google-analytics.service';


@Component({
  selector: 'add-stream-app',
  templateUrl: './add-stream.html',
  styleUrls: ['./add-stream.scss']
})
export class AddStreamComponent implements OnInit {
  constructor(private dataService: DataService, private router: Router, private videoService: VideosService, private storeService: StoreService, private responseManager: ResponseManagerService, private userService: UserService, public googleAnalyticsService: GoogleAnalyticsService) { }
  videoId: any = ''
  videos: any = ''
  streamDetails: any = {
    name: '',
    category: '',
    description: '',
    video: '',
    isCustom: false
  }
  video: any = ''
  previousData: any = {}
  button = document.getElementById('slide');
  signIn: boolean = true;
  connectedSource: boolean = true
  videoSourceAccount: any = '';
  channelId: any = "";
  userId: any = "";
  breadCrumbNumber:any= '1';
  errorMessages:any={
    streamVideo:"Please select a video",
    streamName:"Please enter stream name",
    channelMessage:"",
    channelMessageNoVideos:"",
  }
  apiLimits: any = {
    maxVideosLimitReached: false,
    transactionsLimitReached: false,
    videoViewsLimitReached: false,
  }
  isApiLimitReached:Boolean = false
  isActive:Boolean = false
  isCardExpired:Boolean = false
  loader:boolean=true;
  videoDuration = "";
  disableCards: boolean = false;
  isCustomAccount:boolean = false;
  ruUrl:any="";
  header="Edit Stream";
  // select multi channel
  selectChannel = [
    {
      title: 'default',
      value: 0,
      checkout: true,
      active: false,
      _id:''
    }
  ];
  // active Stream details
  isStreamDetails = false;
  // var search video
  searchVideo:string = "";
  videosFilter:any = '';


  ngOnInit() {
    this.userService.getMe().then((res:any)=>{
      this.userId = res.body.user._id;
      this.isCardExpired = res.body.user.isCardExpired;
      this.isActive = res.body.user.isActive;
      this.isCustomAccount = res.body.user.isCustom;
      this.streamDetails.isCustom = res.body.user.isCustom
      if (this.apiLimits.videoViewsLimitReached || this.apiLimits.transactionsLimitReached || this.apiLimits.maxVideosLimitReached ||  !this.isActive || this.isCardExpired) {
        this.router.navigate(['/list-streams'])
      }

      if(!this.isCustomAccount){
        this.checkStoreLoggedIn()
      }
    });

    this.previousData = this.dataService.getItemFromStorage('StreamDetail')
    if (this.previousData) {
      this.streamDetails = this.previousData
      this.selectVideo(this.previousData.video);
    }
  }

  submitStreamDetails() {
    this.Validation();
    this.googleAnalyticsService.eventEmitter("Buttons", "Choose Products", "add-stream", 1);
    if (this.streamDetails.name && this.videoId) {
      this.streamDetails.video = this.videoId;
      this.streamDetails.videoDuration = this.videoDuration;

      if(this.dataService.getItemFromStorage('StreamDetail') && (this.dataService.getItemFromStorage('StreamDetail').video !== this.streamDetails.video)){
        this.streamDetails.isVideoChanged = true;
      }

      this.dataService.setItemInStorage(this.streamDetails, 'StreamDetail');
      if (this.streamDetails._id) {
        this.router.navigate(['/edit-stream', this.streamDetails._id]);
        return;
      }
      this.router.navigate(['/choose-products']);
    }
  }

Validation(){
  if(!this.streamDetails.name){
    this.responseManager.error.errorMessage =  this.errorMessages.streamName
  }
  if(!this.videoId){
  this.responseManager.error.errorMessage =  this.errorMessages.streamVideo
  }
  if(!this.streamDetails.name && !this.videoId){
  this.responseManager.error.errorMessage = this.errorMessages.streamName + " and "+ this.errorMessages.streamVideo
  }
}



  getVideos(accountId) {
    this.loader = true;
    this.videoService.getVideos(accountId).subscribe((res: any) => {
      console.log(res.body.videos);
      this.videos = res.body.videos;
      this.videosFilter = res.body.videos;
      if(this.videos){
        this.loader =false;
      } else{
        setTimeout(()=>{
        this.errorMessages.channelMessage="No videos found from channel to import.";
        this.loader =false;
        this.connectedSource =false;
        console.log("in else")
      }, 10000);
      }
    })
  }

  sliderRight() {
    document.getElementById('slide-container').scrollLeft +=(document.getElementById('content').clientWidth +25);
  }

  sliderLeft() {
    document.getElementById('slide-container').scrollLeft -= (document.getElementById('content').clientWidth +25);
  }

  selectVideo(video: any) {
    this.isStreamDetails = false;
    this.videoId = video;
    this.getVideoById(this.videoId);
  }

  getVideoById(videoId) {
      this.videoService.getVideoById(videoId).subscribe((res: any) => {
      this.isStreamDetails = true;
      this.video = res.body.video
      this.streamDetails.name = this.html2text(this.video.title)
      this.streamDetails.description = this.html2text(this.video.contentDetails)
      this.streamDetails.thumbnail = this.video.thumbnail
      this.videoDuration =  res.body.videoDuration;
    })
  }

  connectVideoSource() {
    this.connectedSource = false
    this.signIn = true
  }

  addChannel() {
    this.loader = true;
    let accountType = "youtube";
    this.errorMessages.channelMessage = "";
    this.storeService.getAndStoreVideoSource(this.channelId, accountType,this.userId).subscribe((res: any) => {
      this.checkStoreLoggedIn();
    }, (error:any)=>{
      this.loader = false;
      this.connectedSource = false;
      this.errorMessages.channelMessage = "*"+error.error.status.message
    })
  }

  changeFieldEvent(){
 this.errorMessages.channelMessage = ""
  }

  cancelStream(){
    this.router.navigate(['/list-streams']);
  }

  checkStoreLoggedIn() {
    let accountType = "youtube";
    this.storeService.checkStoreLoggedIn(accountType).subscribe((res: any) => {
      console.log(res);
      this.connectedSource = res.body.loggedIn;
      //this.videoSourceAccount = res.body.account[0];
      // assign the select
      this.selectChannel = res.body.account.map((accountOne, index) => {
        return {
          title: accountOne.title,
          value: index,
          checkout: (index === 0)?true:false,
          active: accountOne.isActive,
          _id: accountOne._id
        };
      });
      // active accounts filters
      this.selectChannel = this.selectChannel.filter((account)=>account.active === true);
      this.videoSourceAccount = this.selectChannel[0];
      if (this.connectedSource == true) {
        this.signIn = true;
        this.connectedSource = true;
        this.getVideos(this.videoSourceAccount._id);
      }
    },
    (error:any)=>{
      this.signIn = false;
      this.loader = false;
      this.connectedSource = false;
    })
  }

  refreshVideo(){
    if(!this.loader){
      this.loader = true;
      this.videoService.getUpdatedVideos(this.videoSourceAccount._id).subscribe((res: any) => {
        this.getVideos(this.videoSourceAccount._id)
    })
    }
  }

   html2text(html) {
    var tag = document.createElement('div');
    tag.innerHTML = html;
    return tag.innerText;
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-08 02:01:54
   * @Desc: change option select
   * @param {number} option this is a position of channel
   */
  changeSelect( option: number ){

    this.videoSourceAccount = this.selectChannel[option];
    if (this.connectedSource == true) {
      this.signIn = true;
      this.connectedSource = true;
      this.getVideos(this.videoSourceAccount._id);
      this.searchVideo = '';
    }
    console.log("option", option);
  }

  /**
   * @Author: andersson arellano
   * @Date: 2021-08-24 02:38:11
   * @Desc: Search video
   * @param {event:any} event
   */
  search(event:any){
    console.log(event.target.value);
    let searchVideo = event.target.value.trim().toLowerCase();
    this.videosFilter = this.videos.filter((video)=>video.title.trim().toLowerCase().includes(searchVideo));
  }
}
