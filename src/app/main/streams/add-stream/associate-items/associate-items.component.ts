import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  Input,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { DataService } from "src/app/common/services/data.service";
import { StreamService } from "src/app/common/services/stream.service";
import { VideosService } from "src/app/common/services/videos.service";
import { Router } from "@angular/router";
import {
  NgbModal,
  ModalDismissReasons,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { GoogleAnalyticsService } from "src/app/common/services/google-analytics.service";
import { AssociateFormComponent } from "../associate-form/associate-form.component";
import { AssociateProductsComponent } from "./../associate-products/associate-products.component";

declare var require: any;
import { environment } from "./../../../../../environments/environment";
const YTPlayer = require("yt-player");
var player;

@Component({
  selector: "app-associate-items",
  templateUrl: "./associate-items.component.html",
  styleUrls: ["./associate-items.component.scss"],
})
export class AssociateItemsComponent implements OnInit {
  streamDetails: any = {
    name: "",
    description: "",
    category: "",
    video: "",
    products: [],
  };
  video: any = "";
  previousData: any = {};
  player: any = "";
  seconds: any = "";
  productsAvailable: Boolean;
  videoId: SafeResourceUrl;
  listOfProductsShowing: any = [];
  time_update_interval: any = "";
  totalVideoTime: any = "";
  totalVideoDuration: any = {
    timeIn: "",
    timeOut: "",
  };
  youtubeVideoUrl: any = "https://www.youtube.com/embed/";
  closeResult: string;
  iframeText: any = "";
  linkStream: any = environment.play_stream;
  modalOption: NgbModalOptions = {};
  modalReference: any = "";
  breadCrumbNumber: any = "3";

  timeIncorrect: boolean = false;
  streamIp = environment.play_stream;
  disbaleButton: boolean = false;
  streamId: any = "";
  errorMessages: any = {
    streamProduct: "Please select at least one item (Product / Leads Form)",
    validTime: "*Please enter valid time-in and time-out to publish stream",
  };
  @Input() publishButton: any = "Publish & Share";
  @Input() header: any = "";
  isFormDisplay: any = false;
  isFormHide: any = false;

  @ViewChild(AssociateFormComponent) associateForm: AssociateFormComponent;
  @ViewChild(AssociateProductsComponent)
  associateProducts: AssociateProductsComponent;

  constructor(
    private ref: ChangeDetectorRef,
    private dataService: DataService,
    private streamService: StreamService,
    private videoService: VideosService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalService: NgbModal,
    public googleAnalyticsService: GoogleAnalyticsService
  ) {}

  ngOnInit() {
    this.previousData = this.dataService.getItemFromStorage("StreamDetail");
    if (!this.previousData) {
      this.router.navigate(["/list-streams"]);
    } else {
      this.streamDetails = this.previousData;
      this.isFormDisplay = !this.streamDetails.leadsForm ? false : true;
    }
    this.getVideoById(this.streamDetails.video);
  }

  ngOnDestroy() {
    clearInterval(this.time_update_interval);
  }

  addProductTime(content) {
    this.disbaleButton = true;
    let statusError = this.checkError();

    if (statusError) return;
    this.streamDetails = this.dataService.getItemFromStorage("StreamDetail");
    if (this.streamDetails.products.length)
      this.streamDetails.storeId = this.streamDetails.products[0].accountId;
    else delete this.streamDetails.storeId;
    if (this.streamDetails.leadsForm)
      this.streamDetails.products.push(this.streamDetails.leadsForm);
    if (this.streamDetails._id) {
      this.updateStream(this.streamDetails, content);
      return;
    }

    this.googleAnalyticsService.eventEmitter(
      "Buttons",
      "Publish Stream",
      "associate-products",
      1
    );

    this.streamService
      .addStream(this.streamDetails)
      .then((res: any) => {
        this.finsihProcess(res, content);
      })
      .catch((error) => {
        this.disbaleButton = false;
      });
  }

  finsihProcess(res, content) {
    /*this.disbaleButton = false;
    this.linkStream += res.body.stream._id;
    this.streamId += res.body.stream._id;
    this.iframeText = "<iframe src=" + this.linkStream + "></iframe>";*/

    //console.log(res.body.stream, this.video);
    this.disbaleButton = false;
    this.linkStream +=
      "/" + res.body.stream._id + "/" + this.video.videoOriginalId;
    this.streamId += res.body.stream._id;
    this.iframeText = "<iframe src=" + this.linkStream + "></iframe>";

    this.open(content);
    this.dataService.removeItemFromStorage("StreamDetail");
    this.router.navigate(["/list-streams"]);
  }

  updateStream(streamDetails, content) {
    this.streamService.updateStreamById(streamDetails).subscribe(
      (res: any) => {
        this.finsihProcess(res, content);
      },
      (error: any) => {
        this.disbaleButton = false;
      }
    );
  }

  publishStream() {
    if (this.streamDetails.leadsForm) {
      this.associateForm.getUpdatedStream(true);
    } else if (this.streamDetails.products.length) {
      this.associateProducts.getUpdatedStream(true);
    } else if (
      this.streamDetails.products.length &&
      this.streamDetails.leadsForm
    ) {
      this.associateForm.getUpdatedStream(false);
      this.associateProducts.getUpdatedStream(true);
    }
  }

  getUpdatedStreamEmitter(emitter, content) {
    this.streamDetails = emitter.updatedStream;
    if (emitter.isCreate) {
      this.addProductTime(content);
    }
  }
  getErrorEmitter(error) {
    this.timeIncorrect = error.isTimeError;
    this.errorMessages.validTime = error.errorMessages.validTime;
  }

  videoDuration() {
    var minutes = Math.floor(this.totalVideoTime / 60);
    var seconds = this.totalVideoTime - minutes * 60;
    if (minutes.toString().length < 2 || seconds.toString().length < 2) {
      this.totalVideoDuration.timeOut = "0" + minutes + ":" + "0" + seconds;
    } else {
      this.totalVideoDuration.timeOut = minutes + ":" + seconds;
    }
  }

  createPlayer() {
    this.player = new window["YT"].Player("ytplayer", {
      height: "300",
      width: "100%",
      playerVars: { autoplay: 1, rel: 0, controls: 0, fs: 0 },
      events: {
        onReady: this.playerReady,
      },
    });
  }

  getVideoById(videoId) {
    this.videoService.getVideoById(videoId).subscribe((res: any) => {
      this.video = res.body.video;
      this.youtubeVideoUrl = this.youtubeVideoUrl + this.video.videoUrl;
      this.player = new YTPlayer("#newPlayer");
      this.player.load(this.video.videoUrl);
      var that = this;
      this.player.on("unstarted", this.playerReady);
      this.videoId = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.youtubeVideoUrl + "?enablejsapi=1"
      );
      this.totalVideoTime = res.body.videoDuration;
      if (!this.streamDetails.videoDuration) {
        this.streamDetails.videoDuration = res.body.videoDuration;
      }
    });
  }

  playerReady = (player: any) => {
    this.updateTimerDisplay();
    this.time_update_interval;
    clearInterval(this.time_update_interval);
    this.time_update_interval = setInterval(
      () => this.updateTimerDisplay(),
      1000
    );
  };

  updateTimerDisplay() {
    this.formatTime(this.player.getCurrentTime());
  }

  formatTime(time) {
    time = Math.round(time);
    var minutes = Math.floor(time / 60);
    this.seconds = time - minutes * 60;
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;
    this.productDisplay(minutes, this.seconds);
  }

  checkError() {
    let invalidStream = false;
    let checkArray = [];
    if (this.streamDetails.products.length) {
      checkArray = this.streamDetails.products.filter(
        (element) =>
          element.timeInError ||
          element.timeOutError ||
          element.timeOutValue1 == "" ||
          element.timeOutValue2 == "" ||
          element.timeInValue1 == "" ||
          element.timeInValue2 == ""
      );
    }
    if (this.streamDetails.leadsForm) {
      if (
        this.streamDetails.leadsForm.timeInError ||
        this.streamDetails.leadsForm.timeOutError ||
        this.streamDetails.leadsForm.timeOutValue1 == "" ||
        this.streamDetails.leadsForm.timeOutValue2 == "" ||
        this.streamDetails.leadsForm.timeInValue1 == "" ||
        this.streamDetails.leadsForm.timeInValue2 == ""
      ) {
        invalidStream = true;
      }
    }

    if (checkArray.length || invalidStream) {
      this.timeIncorrect = true;
      this.disbaleButton = false;
      return true;
    } else {
      this.timeIncorrect = false;
    }
  }
  productDisplay(min, sec) {
    sec = parseInt(sec);

    let totalSeconds = parseInt(min) * 60 + sec;

    if (this.streamDetails.leadsForm) {
      this.formDisplay(this.streamDetails, totalSeconds);
    } else {
      this.isFormDisplay = false;
    }

    this.streamDetails.products.forEach((product, index) => {
      this.ref.detectChanges();
      product.timeIn = `${product.timeInValue1}:${product.timeInValue2}`;
      product.timeOut = `${product.timeOutValue1}:${product.timeOutValue2}`;
      let productTimeIn =
        parseInt(product.timeInValue1) * 60 + parseInt(product.timeInValue2);
      let productTimeOut =
        parseInt(product.timeOutValue1) * 60 + parseInt(product.timeOutValue2);
      if (productTimeIn < totalSeconds && productTimeOut > totalSeconds) {
        product.isTimeOut = false;
        if (this.listOfProductsShowing.indexOf(product) == -1) {
          this.listOfProductsShowing.push(product);
          this.ref.detectChanges();
        }
        this.ref.detectChanges();
      } else {
        this.ref.detectChanges();
        product.isTimeOut = true;
      }
    });
  }

  formDisplay(streamObject, totalSeconds) {
    /*<<<<<<< AdamsContreras
    let streamObjectTimeIn =
      parseInt(streamObject.leadsForm.timeInValue1) * 60 +
      parseInt(streamObject.leadsForm.timeInValue2);
    let streamObjectTimeOut =
      parseInt(streamObject.leadsForm.timeOutValue1) * 60 +
      parseInt(streamObject.leadsForm.timeOutValue2);

    if (
      streamObjectTimeIn < totalSeconds &&
      streamObjectTimeOut > totalSeconds
    ) {
=======*/

    let streamObjectTimeIn =
      parseInt(streamObject.leadsForm.timeInValue1) * 60 +
      parseInt(streamObject.leadsForm.timeInValue2);
    let streamObjectTimeOut =
      parseInt(streamObject.leadsForm.timeOutValue1) * 60 +
      parseInt(streamObject.leadsForm.timeOutValue2);

    if (
      streamObjectTimeIn < totalSeconds &&
      streamObjectTimeOut > totalSeconds
    ) {
      /*>>>>>>> master */
      this.isFormDisplay = true;
      this.ref.detectChanges();
    } else {
      this.ref.detectChanges();
      this.isFormDisplay = false;
    }
  }

  displayHideForm(status) {
    this.isFormHide = !status;
  }

  addMoreProducts() {
    this.checkError();
    if (this.timeIncorrect) return;
    this.streamDetails = this.dataService.getItemFromStorage("StreamDetail");
    this.streamDetails.productsAux =
      this.dataService.getItemFromStorage("StreamDetail").products;
    this.dataService.setItemInStorage(this.streamDetails, "StreamDetail");
    this.router.navigate(["/choose-products"]);
  }

  cancelStream() {
    this.router.navigate(["/list-streams"]);
  }

  updateVideo() {
    this.dataService.setItemInStorage(this.streamDetails, "StreamDetail");
    this.router.navigate(["/add-stream"]);
  }

  open(content) {
    this.modalReference = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "lg",
      centered: true,
    });
    this.modalReference.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  copyInputMessage(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
    var tooltip = document.getElementById("myTooltip");
    var tooltip1 = document.getElementById("myTooltip1");
    tooltip1.innerHTML = "Copy to Clipboard";
    tooltip.innerHTML = "Copied";
  }
  copyInputMessage1(inputElement) {
    inputElement.select();
    document.execCommand("copy");
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

  disableOnKeyUp() {
    this.timeIncorrect = true;
  }

  share(type) {
    if (type == "facebook") {
      window.open(
        "https://www.facebook.com/sharer/sharer.php?u=" + this.linkStream,
        "_blank"
      );
    }
    if (type == "twitter") {
      window.open(
        "https://twitter.com/intent/tweet?url=" + this.linkStream,
        "_blank"
      );
    }
    if (type == "linkedin") {
      window.open(
        "https://www.linkedin.com/shareArticle?mini=true&url=" +
          this.linkStream,
        "_blank"
      );
    }
  }
}
