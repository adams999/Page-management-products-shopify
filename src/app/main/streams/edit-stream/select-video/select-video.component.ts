import { Component, OnInit } from '@angular/core';
import { VideosService } from 'src/app/common/services/videos.service';
import { Router } from "@angular/router";
import { StoreService } from 'src/app/common/services/store.service';
import { UserService } from 'src/app/common/services/user.service';

@Component({
  selector: 'select-video-app',
  templateUrl: './select-video.html',
  styleUrls: ['./select-video.scss']
})
export class SelectVideoComponent implements OnInit {
  constructor(private router: Router, private videoService: VideosService, private storeService: StoreService, private userService: UserService) { }
  videoId: any = ''
  videos: any = ''
  streamDetails: any = {
    name: '',
    category: '',
    description: '',
    video: ''
  }
  video: any = ''
  previousData: any = {}
  button = document.getElementById('slide');
  signIn: boolean = false;
  connectedSource: boolean = false
  videoSourceAccount: any = '';
  channelId: any = "";
  breadCrumbNumber:any= '1';
  addNew:boolean=false;
  userId: any = "";

  ngOnInit() {
    this.userService.getMe().then((res:any)=>{
      this.userId = res.body.user._id
    })
    this.addNew = false;
    this.checkStoreLoggedIn()
    this.previousData = JSON.parse(localStorage.getItem('updateStreamDetail'));

    if (this.previousData) {
      this.streamDetails = this.previousData;
       this.selectVideo(this.previousData.video._id);
    }
  }

  submitStreamDetails() {
    if (this.streamDetails.name && this.videoId) {
      this.addNew = true;
      this.streamDetails.video =  this.video
      localStorage.setItem('updateStreamDetail', JSON.stringify(this.streamDetails));
      console.log("asdasdasdadsasdadsa", this.streamDetails)
      this.router.navigate(['/edit-stream', this.streamDetails._id])
    }
  }
cancel(){
  this.addNew = true;
  this.router.navigate(['/edit-stream', this.streamDetails._id])
}
  getVideos(accountId) {
    this.videoService.getVideos(accountId).subscribe((res: any) => {
      this.videos = res.body.videos
      console.log("videos", this.videos)
    })
  }
  ngOnDestroy() {
    if(!this.addNew){
      localStorage.removeItem('updateStreamDetail');
    }
  }
  sliderRight() {
    document.getElementById('slide-container').scrollLeft +=(document.getElementById('content').clientWidth +25)*2;
  }

  sliderLeft() {
    document.getElementById('slide-container').scrollLeft -= (document.getElementById('content').clientWidth +25)*2;
  }

  selectVideo(video: any) {
    this.videoId = video;
    console.log("video",video  )
    this.getVideoById(this.videoId)
  }

  getVideoById(videoId) {
    this.videoService.getVideoById(videoId).subscribe((res: any) => {
      this.video = res.body.video
      this.streamDetails.name = this.video.title
      this.streamDetails.description = this.video.contentDetails
    })
  }
  connectVideoSource() {
    this.connectedSource = false
    this.signIn = true
  }

  addChannel() {
    let accountType = "youtube"
    this.storeService.getAndStoreVideoSource(this.channelId, accountType,this.userId).subscribe((res: any) => {
      this.checkStoreLoggedIn()
    })
  }
  checkStoreLoggedIn() {
    let accountType = "youtube"
    this.storeService.checkStoreLoggedIn(accountType).subscribe((res: any) => {
    console.log("asdasda",res)

      this.connectedSource = res.body.loggedIn
      this.videoSourceAccount = res.body.account
      if (this.connectedSource == true) {
        this.signIn = true
        this.connectedSource = true
        this.getVideos(this.videoSourceAccount._id);
      }
      else {
        this.signIn == false
      }
    })
  }
}
