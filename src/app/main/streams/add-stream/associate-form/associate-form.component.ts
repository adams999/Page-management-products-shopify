import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from "@angular/core";
import { DataService } from "src/app/common/services/data.service";
import { Router } from "@angular/router";
import { GoogleAnalyticsService } from "src/app/common/services/google-analytics.service";

@Component({
  selector: "app-associate-form",
  templateUrl: "./associate-form.component.html",
  styleUrls: ["./associate-form.component.scss"],
})
export class AssociateFormComponent implements OnInit {
  @Input() streamDetails: any = {
    name: "",
    description: "",
    category: "",
    video: "",
  };
  video: any = "";
  previousData: any = {};
  productsAvailable: Boolean;
  listOfFieldsShowing: any = [];
  @Output() updatedStreamEmitter: any = new EventEmitter<any>();
  @Output() errroEmiiter: any = new EventEmitter<any>();
  breadCrumbNumber: any = "3";
  errorMessages: any = {
    streamProduct: "Please select leads form to continue.",
    validTime:
      "*Please enter valid time-in and time-out of form to publish stream.",
  };
  timeIncorrect: boolean = false;
  checkArray: any = [];
  streamId: any = "";
  fieldDisabled = true;

  constructor(
    private dataService: DataService,
    private router: Router,
    public googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    if(this.streamDetails.leadsForm){
      this.emitUpdateStreamGlobal();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["streamDetails"]) {
      this.productInitialTimeSetter(this.streamDetails.videoDuration);
    }
  }

  ngOnDestroy() {}

  removeForm() {
    delete this.streamDetails.leadsForm;
    this.updatedStreamEmitter.emit({
      updatedStream: this.streamDetails,
      isCreate: false,
    });
    this.dataService.setItemInStorage(this.streamDetails, "StreamDetail");
  }

  setShowVideosProperty() {
    //se agrega un array para poder gestionar los diferentes tiempos de aparicion en el video
    this.streamDetails.leadsForm.timeIn =
      this.streamDetails.leadsForm.timeInValue1 +
      ":" +
      this.streamDetails.leadsForm.timeInValue2;
    this.streamDetails.leadsForm.timeOut =
      this.streamDetails.leadsForm.timeOutValue1 +
      ":" +
      this.streamDetails.leadsForm.timeOutValue2;
    if (this.streamDetails.leadsForm.showVideoMulti == undefined) {
      this.streamDetails.leadsForm.showVideoMulti = [
        {
          timeIn: this.streamDetails.leadsForm.timeIn,
          timeOut: this.streamDetails.leadsForm.timeOut,
          timeInValue1: this.streamDetails.leadsForm.timeIn.split(":")[0],
          timeInValue2: this.streamDetails.leadsForm.timeIn.split(":")[1],
          timeOutValue1: this.streamDetails.leadsForm.timeOut.split(":")[0],
          timeOutValue2: this.streamDetails.leadsForm.timeOut.split(":")[1],
        },
      ];
    }
    this.setLocalStream();
  }

  productInitialTimeSetter(totalVideoTime) {
    if (
      !this.streamDetails.leadsForm.isAssociated ||
      this.streamDetails.isVideoChanged
    ) {
      //setting time In of fields
      this.streamDetails.leadsForm.timeInValue1 = !this.streamDetails.leadsForm
        .timeInValue1
        ? "00"
        : this.streamDetails.leadsForm.timeInValue1;
      this.streamDetails.leadsForm.timeInValue2 = !this.streamDetails.leadsForm
        .timeInValue1
        ? "00"
        : this.streamDetails.leadsForm.timeInValue1;

      //setting time Out of fields
      var minutes = Math.floor(totalVideoTime / 60);
      var seconds = totalVideoTime - minutes * 60;
      if (minutes.toString().length < 2) {
        this.streamDetails.leadsForm.timeOutValue1 = "0" + minutes;
      } else {
        this.streamDetails.leadsForm.timeOutValue1 = minutes;
      }
      if (seconds.toString().length < 2) {
        this.streamDetails.leadsForm.timeOutValue2 = "0" + seconds;
      } else {
        this.streamDetails.leadsForm.timeOutValue2 = seconds;
      }
      this.streamDetails.leadsForm.isAssociated = true;
    }
    //se agregan las diferentes apariciones de los productos
    if (this.streamDetails.leadsForm.showVideoMulti == undefined) {
      this.setShowVideosProperty();
    }
    this.setLocalStream();
  }

  validFormatSegMin(valor) {
    let val = Math.abs(isNaN(Math.trunc(valor)) ? 0 : Math.trunc(valor));
    return val < 10 ? "0" + val : val;
  }

  advanceErrorHandling(event, index, item) {
    let startTime = 0;
    let finishTime = this.streamDetails.videoDuration;

    //formateo de cada input con su formato valido
    item.timeInValue1 = this.validFormatSegMin(item.timeInValue1);
    item.timeInValue2 = this.validFormatSegMin(item.timeInValue2);
    item.timeOutValue1 = this.validFormatSegMin(item.timeOutValue1);
    item.timeOutValue2 = this.validFormatSegMin(item.timeOutValue2);
    item.showVideoMulti[0].timeInValue1 = this.validFormatSegMin(
      item.timeInValue1
    );
    item.showVideoMulti[0].timeInValue2 = this.validFormatSegMin(
      item.timeInValue2
    );
    item.showVideoMulti[0].timeOutValue1 = this.validFormatSegMin(
      item.timeOutValue1
    );
    item.showVideoMulti[0].timeOutValue2 = this.validFormatSegMin(
      item.timeOutValue2
    );

    let productTimeInMins = parseInt(item.timeInValue1);
    let productTimeInSecs = parseInt(item.timeInValue2);
    let productTimeOutMins = parseInt(item.timeOutValue1);
    let productTimeOutSecs = parseInt(item.timeOutValue2);

    let productInTime = productTimeInMins * 60 + productTimeInSecs;
    let productOutTime = productTimeOutMins * 60 + productTimeOutSecs;

    if (
      productInTime < startTime ||
      productInTime >= productOutTime ||
      productInTime > finishTime ||
      productTimeInSecs >= 60 ||
      productTimeOutSecs >= 60 ||
      productTimeInMins >= 60 ||
      productTimeOutMins >= 60
    ) {
      item.timeInError = true;
      this.streamDetails.timeError = true;
      this.timeIncorrect = true;
    } else {
      item.timeInError = false;
      this.streamDetails.timeError = false;
      this.timeIncorrect = false;
    }
    if (
      productOutTime <= productInTime ||
      productOutTime > finishTime ||
      productTimeInSecs >= 60 ||
      productTimeOutSecs >= 60 ||
      productTimeInMins >= 60 ||
      productTimeOutMins >= 60
    ) {
      this.timeIncorrect = true;
      this.streamDetails.timeError = true;
      item.timeOutError = true;
    } else {
      this.timeIncorrect = false;
      this.streamDetails.timeError = false;
      item.timeOutError = false;
    }

    this.streamDetails.leadsForm.timeIn = `${item.timeInValue1}:${item.timeInValue2}`;
    this.streamDetails.leadsForm.timeOut = `${item.timeOutValue1}:${item.timeOutValue2}`;
    this.streamDetails.leadsForm.showVideoMulti[0].timeIn = `${item.timeInValue1}:${item.timeInValue2}`;
    this.streamDetails.leadsForm.showVideoMulti[0].timeOut = `${item.timeOutValue1}:${item.timeOutValue2}`;
    this.changeErrorTimer();
    this.setLocalStream();
    this.emitUpdateStreamGlobal();
  }

  changeErrorTimer() {
    this.errroEmiiter.emit({
      errorMessages: this.errorMessages,
      isTimeError: this.timeIncorrect,
    });
  }

  emitUpdateStreamGlobal() {
    this.updatedStreamEmitter.emit({
      updatedStream: this.streamDetails,
      isCreate: false,
    });
  }

  getUpdatedStream(isCreate) {
    this.streamDetails.leadsForm.timeIn = `${this.streamDetails.leadsForm.timeInValue1}:${this.streamDetails.leadsForm.timeInValue2}`;
    this.streamDetails.leadsForm.timeOut = `${this.streamDetails.leadsForm.timeOutValue1}:${this.streamDetails.leadsForm.timeOutValue2}`;
    this.setLocalStream();
    this.updatedStreamEmitter.emit({
      updatedStream: this.streamDetails,
      isCreate,
    });
  }

  setLocalStream() {
    this.dataService.setItemInStorage(this.streamDetails, "StreamDetail");
    this.streamDetails = this.dataService.getItemFromStorage("StreamDetail");
  }
}
