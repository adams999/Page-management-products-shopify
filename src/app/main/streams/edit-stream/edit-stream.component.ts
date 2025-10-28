import { Component, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DataService } from 'src/app/common/services/data.service'
import { StreamService } from 'src/app/common/services/stream.service';
import { VideosService } from 'src/app/common/services/videos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ResponseManagerService } from 'src/app/common/services/response-manager.service';
import { environment } from './../../../../environments/environment';
import { switchMap } from  'rxjs/operators';

declare const require: any;
const YTPlayer = require('yt-player')
var player;
@Component({
  selector: 'edit-stream-app',
  templateUrl: './edit-stream.html',
  styleUrls: ['./edit-stream.scss']
})
export class EditStreamComponent {

  streamDetails: any = {
    name: '',
    description: '',
    category: '',
    video: '',
    products: []
  };
  video: any = "";
  stream: any = "";
  sub: any = "";
  streamId: any = "";
  isStream: Boolean = false;
  publishButton: any = "Update";
  header: any = "Edit Stream";
  previousData: any = "";
  constructor(private ref: ChangeDetectorRef, private dataService: DataService, private streamService: StreamService, private videoService: VideosService, private sanitizer: DomSanitizer, private router: Router, private modalService: NgbModal, private route: ActivatedRoute, private responseManager: ResponseManagerService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.streamId = params['id'];
    });
    this.previousData = this.dataService.getItemFromStorage('StreamDetail');
    if (!this.previousData) {
      this.getStreamById();
    }
    else {
      this.streamDetails = this.previousData;
      this.isStream = true;
    }
  }

  getStreamById() {


    this.streamService.getStreamById(this.streamId)
    .pipe(
      switchMap((res:any) => {
        this.streamDetails = res.body.stream;
        return this.videoService.getVideoById(res.body.stream.video._id)}
        )
    )
    .subscribe(async (res2: any) => {
      //this.streamDetails = res.body.stream;
      this.streamDetails.video = this.streamDetails.video._id;
      for (let index = 0; index < this.streamDetails.products.length; index++) {
        let element = this.streamDetails.products[index];
        this.mapData(element, this.streamDetails, index)
      }
      this.streamDetails.videoDuration = res2.body.videoDuration;
      this.saveDataLocally(this.streamDetails)
    })
  }

  saveDataLocally(streamDetails) {
    this.dataService.setItemInStorage(streamDetails, 'StreamDetail');
    this.isStream = true;
  }

  mapData(element, streamDetails, index) {
    element.timeInValue1 = element.timeIn.split(":")[0];
    element.timeInValue2 = element.timeIn.split(":")[1];
    element.timeOutValue1 = element.timeOut.split(":")[0];
    element.timeOutValue2 = element.timeOut.split(":")[1];
    element.isAssociated = true;
    if (element.type === 'form') {
      element.leadsForm.timeInValue1 = element.timeInValue1;
      element.leadsForm.timeInValue2 = element.timeInValue2;
      element.leadsForm.timeOutValue1 = element.timeOutValue1;
      element.leadsForm.timeOutValue2 = element.timeOutValue2;
      element.leadsForm.isAssociated = element.isAssociated;
      element.leadsForm.type = element.type;
      streamDetails.leadsForm = element.leadsForm;
      streamDetails.products.splice(streamDetails.products.indexOf(element), 1)
    }
    if (element.type === 'product') {
      element.product.timeInValue1 = element.timeInValue1;
      element.product.timeInValue2 = element.timeInValue2;
      element.product.timeOutValue1 = element.timeOutValue1;
      element.product.timeOutValue2 = element.timeOutValue2;
      element.product.type = element.type;
      element.product.isAssociated = element.isAssociated;
      streamDetails.products[index] = element.product;
    }
  }
}
