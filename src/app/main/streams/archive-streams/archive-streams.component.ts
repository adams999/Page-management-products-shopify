import { Component, OnInit } from '@angular/core';
import { StreamService } from 'src/app/common/services/stream.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { UserService } from 'src/app/common/services/user.service';
import { OrderService } from 'src/app/common/services/order.service';
import { HostListener } from '@angular/core';

import { environment  } from './../../../../environments/environment';


@Component({
  selector: 'archive-streams-app',
  templateUrl: './archive-streams.html',
  styleUrls: ['./archive-streams.scss'],

})
export class ArchiveStreamsComponent implements OnInit {
  constructor(private streamService: StreamService, private config: NgbDropdownConfig, private userService: UserService, private orderService: OrderService) {
    config.placement = 'bottom-right'
  }
  streams: any = [];
  stream: any = "";
  displayStyle: any = "grid";
  now: any = "";
  currentFilter: any = "Sort by";
  filterKeys: any = {
    status: '',
    sortBy: '',
    limit: 12,
    offset: 0,
    isArchive: true
  };
  streamType: any = {
    isArchive: true
  }
  isCardExpired: any = false;
  isApiLimitReached: any = false;
  isActive: any = false;
  allOrders: any = [];
  ordersCount = 0;
  totalOrders = 0;
  totalSales = 0;
  linkStream = environment.play_stream
  header = "Archive Streams";
  filterApply: boolean = false;
  offset = 12;
  limit = 12;
  lastScrollTop: any = 0
  _timeout: any = null;
  streamsCount = 0;
  allStreams: any = '';
  buttonTitle = "Create New Stream";
  buttonNavigation = "add-stream";
  currentPage: any = "Archive Stream";
  apiLimits: any = {
    maxVideosLimitReached: false,
    transactionsLimitReached: false,
    videoViewsLimitReached: false,
  }
  ngOnInit() {
    this.getStreams(this.filterKeys);
    this.getAllStreams();

    localStorage.removeItem('StreamDetail');
    this.getUserData();
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
    })
   }

  getStreams(filterType) {
    this.filterApply = false;
    this.streamService.getStreams(filterType).subscribe((res: any) => {
      res.body.streams.forEach(element => {
        this.streams.push(element)
      });;
    })
  }

  getAllStreams() {
    this.streamService.getAllStreams(this.filterKeys).subscribe((res: any) => {
      this.streamsCount = res.body.count;
    })
  }

  deleteStreamById(streamId: any) {
    this.streamService.deleteStreamById(streamId).subscribe((res: any) => {
      this.getStreams(this.filterKeys);
    })
  }

  totalSalesDecimalHandled(totalSales) {
    return totalSales.toFixed(2)
  }
  
  changeStatus(stream: any) {
    if (stream) {
      this.streamService.updateStreamStatusById(stream).subscribe((res: any) => {
        this.streams = []
        this.filterKeys.offset = 0
        this.getStreams(this.filterKeys);
        this.getUserData()
      })
    }
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

  openStream(streamId) {
    window.open(
      this.linkStream + streamId,
      '_blank' // <- This is what makes it open in a new window.
    );
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
}
