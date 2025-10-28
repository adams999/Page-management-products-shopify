import { Component, OnInit } from '@angular/core';
import { StreamService } from 'src/app/common/services/stream.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { UserService } from 'src/app/common/services/user.service';
import { HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { OrderService } from 'src/app/common/services/order.service';
import { environment  } from './../../../../environments/environment';
import { SplitIoService } from 'src/app/common/services/splitio.service';


@Component({
  selector: 'list-streams-app',
  templateUrl: './list-streams.html',
  styleUrls: ['./list-streams.scss'],

})
export class ListStreamsComponent implements OnInit {
  constructor(
    private streamService: StreamService,
    private userService: UserService,
    private config: NgbDropdownConfig,
    private modalService: NgbModal,
    private orderService: OrderService,
    public splitIoService: SplitIoService
    ) {
    config.placement = 'bottom-right';
  }
  streams: any = [];
  videoViews = 0;
  stream: any = "";
  displayStyle: any = "grid";
  now: any = "";
  currentFilter: any = "Sort by";
  filterKeys: any = {
    status: '',
    sortBy: 'createdAt',
    limit: 12,
    offset: 0,
    isArchive: false
  };
  isCardExpired: any = false;
  apiLimits: any = {
    maxVideosLimitReached: false,
    transactionsLimitReached: false,
    videoViewsLimitReached: false,
  }
  isActive: any = false;
  lastScrollTop: any = 0
  _timeout: any = null;
  streamsCount = 0;
  allStreams: any = '';
  modalOption: NgbModalOptions = {};
  modalReference: any = "";
  closeResult: any = "";
  iframeText: any = "";
  linkStream: any = environment.play_stream;
  allOrders: any = [];
  ordersCount = 0;
  totalOrders = 0;
  totalSales = 0;
  streamIp = environment.play_stream
  offset = 12
  limit = 12;
  buttonTitle="Create New Stream";
  buttonNavigation="add-stream";
  currentPage: any ="Active Streams";
  streamId:any="";
  isCustom:boolean=false;
  isApiLimitReached:boolean=false;
  streamsTotalSales = 0
  streamsTotalViews = 0
  openStreamLink :any = environment.play_stream
  ngOnInit() {
    this.getUserData();
    this.getAllStreams();
    this.getStreams(this.filterKeys);
    localStorage.removeItem('StreamDetail');
    this.splitIoService.initSdk();
  }

  getUserData() {
   this.userService.getUpdatedUser().subscribe((res:any)=>{
      this.isCardExpired = res.body.user.isCardExpired;
      this.isActive = res.body.user.isActive;
      this.apiLimits = res.body.user.apiLimits;
      if (this.apiLimits.videoViewsLimitReached || this.apiLimits.transactionsLimitReached || this.apiLimits.maxVideosLimitReached ||  !this.isActive) {
        this.isApiLimitReached = true;
        this.userService.checkIfActive()
      }
      else{
        this.isApiLimitReached = false;
        this.userService.checkIfActive()
      }
      this.videoViews = res.body.user.videoViews;
      this.totalSales = (res.body.user.totalSales).toFixed(2);
   })
  }

  getStreams(filterType) {
    this.streamService.getStreams(filterType).subscribe((res: any) => {
      res.body.streams.forEach(element => {
        this.streams.push(element)
      });
    })
  }

  getAllStreams() {
    this.streamService.getAllStreams(this.filterKeys).subscribe((res: any) => {
      this.streamsCount = res.body.count;
      this.streamsTotalSales = res.body.totalSales
      this.streamsTotalViews = res.body.totalViews
    })
  }

  deleteStreamById(streamId: any) {
    this.streamService.deleteStreamById(streamId).subscribe((res: any) => {
      this.getStreams(this.filterKeys);
    })
  }

  changeStatus(stream: any) {
    if (stream) {
      this.streamService.updateStreamStatusById(stream).subscribe((res: any) => {
        this.streams = []
        this.filterKeys.offset = 0
        this.getStreams(this.filterKeys);
        this.getUserData();
      })
    }
  }

  totalSalesDecimalHandled(totalSales){
      return totalSales.toFixed(2)
  }

  calculateDuration(string: any) {
    var ONE_DAY = 60 * 60 * 24 * 1000; /* ms */
    let duration = moment(string).fromNow(true);
    this.now = moment(string).isSame(moment(), 'day');
    if (this.now) {
      return duration
    }
    else {
      return moment(string).format('L') + " " + moment(string).format('LT');
    }
  }

  switchDisplay(displayStyle: any) {
    this.displayStyle = displayStyle
  }

  filterFunc(current: any, type: any) {
    this.streams = []
    this.currentFilter = current.toString();
    this.filterKeys.offset = 0;
    this.filterKeys.sortBy = type;
    if (type == "publishedAt") {
      this.filterKeys.status = "publish"
    }
    this.filterKeys.isArchive = this.filterKeys.isArchive;
    this.getStreams(this.filterKeys)
  }

  applyFilter(dropmenu) {
    dropmenu.classList.remove('show');
    this.streams = []
    this.filterKeys.offset = 0;
    this.filterKeys.isArchive = this.filterKeys.isArchive;
    this.getStreams(this.filterKeys)
  }


  shareStream(content, stream) {
    stream.isCustom ? this.isCustom = true : this.isCustom = false;
    console.log(stream);
    this.streamId = stream._id
    this.linkStream = environment.play_stream
    this.linkStream += '/' + stream._id + '/' + stream.video.videoOriginalId
    this.iframeText = "<iframe src=" + this.linkStream + "></iframe>"
    this.open(content)
  }


  openStream(streamId, videoId) {
    //console.log(streamId,videoId);
    window.open(
      this.openStreamLink + '/' + streamId + '/' + videoId,
      '_blank'
    );
  }

  open(content) {
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  @HostListener('scroll', ['$event'])
  onElementScroll($event) {
    this._timeout = setTimeout(() => {
      this._timeout = null;
      var st = document.getElementById("client").scrollTop;
      if (st > this.lastScrollTop) {
        if ((document.getElementById("client").scrollTop + (document.getElementById("client").clientHeight)) >= document.getElementById("grid").offsetHeight && this.streamsCount != this.streams.length) {
          this.filterKeys.offset += this.offset;

          this.getStreams(this.filterKeys);
        }
      } else {
        // console.log("up")       // upscroll code
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    }, 250);
  }

  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    var tooltip = document.getElementById("myTooltip");
    var tooltip1 = document.getElementById("myTooltip1");
    tooltip1.innerHTML = "Copy to Clipboard"
    tooltip.innerHTML = "Copied";
  }
  copyInputMessage1(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
    var tooltip1 = document.getElementById("myTooltip1");
    var tooltip = document.getElementById("myTooltip");
    tooltip1.innerHTML = "Copied";
    tooltip.innerHTML = "Copy to Clipboard";
  }

  outFunc() {
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard";
  }

  // getAllOrders() {
  //   this.orderService.getAllOrders().subscribe((res: any) => {
  //     this.allOrders = res.body.orders;
  //     this.ordersCount = res.body.count;
  //     this.allOrders.forEach(element => {
  //       if (element.status == "completed") {
  //         this.totalSales += parseInt(element.amount);
  //       }
  //     });
  //   })
  // }

  share(type) {
    if (type == "facebook") {
      window.open(
        'https://www.facebook.com/sharer/sharer.php?u=' + this.linkStream,
        '_blank'
      );
    }
    if (type == "twitter") {
      window.open(
        'https://twitter.com/intent/tweet?url=' + this.linkStream,
        '_blank'
      );
    }
    if (type == "linkedin") {
      window.open(
        'https://www.linkedin.com/shareArticle?mini=true&url=' + this.linkStream + "&source=SimuStream",
        '_blank'
      );
    }
  }
}

