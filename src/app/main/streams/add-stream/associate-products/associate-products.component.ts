import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
} from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { DataService } from "src/app/common/services/data.service";
import { Router } from "@angular/router";
import { environment } from "./../../../../../environments/environment";
import { SplitIoService } from "src/app/common/services/splitio.service";

@Component({
  selector: "associate-products-app",
  templateUrl: "./associate-products.html",
  styleUrls: ["./associate-products.scss"],
})
export class AssociateProductsComponent implements OnInit {
  @Input() streamDetails: any = {
    name: "",
    description: "",
    category: "",
    video: "",
    products: [],
  };
  streamDetailsAux: any = {};
  previousData: any = {};
  seconds: any = "";
  productsAvailable: Boolean;
  listOfProductsShowing: any = [];
  time_update_interval: any = "";
  totalVideoDuration: any = {
    timeIn: "",
    timeOut: "",
  };
  linkStream: any = environment.play_stream;
  breadCrumbNumber: any = "3";
  errorMessages: any = {
    streamProduct: "Please select at least one product",
    validTime:
      "*Please enter the valid entry time and waiting time of the products to publish the transmission, (If you have several appearances per product, these should not be repeated)",
  };
  timeIncorrect: boolean = false;
  checkArray: any = [];
  @Output() updatedStreamEmitter: any = new EventEmitter<any>();
  @Output() errroEmiiter: any = new EventEmitter<any>();

  changeLog: any = [];
  newProdcuts: any = [];

  constructor(
    private ref: ChangeDetectorRef,
    private dataService: DataService,
    private router: Router,
    public splitIoService: SplitIoService
  ) {}

  ngOnInit() {
    this.splitIoService.initSdk();
    if (this.streamDetails.productsAux) {
      this.setProductsTimePrevous();
    }
    if (this.streamDetails.products.length > 0) {
      this.emitUpdateStreamGlobal();
    }
  }

  setProductsTimePrevous() {
    const Aux = { ...this.streamDetails };
    let productFilter = [];
    let arrAux;
    let contador = 0;

    if (Aux.productsAux.length >= Aux.products.length) {
      arrAux = Object.values({
        ...Aux.products,
        ...Aux.productsAux,
      });

      arrAux.map((data: any) => {
        this.streamDetailsAux.products.map((aux) => {
          if (aux._id == data._id) {
            productFilter.push(data);
            contador++;
          }
        });
      });
    } else {
      arrAux = Object.values({
        ...Aux.productsAux,
        ...Aux.products,
      });

      Aux.productsAux.map((data: any) => {
        Aux.products.map((aux) => {
          if (aux._id == data._id) {
            productFilter.push(data);
            contador++;
          } else {
            productFilter.push(aux);
          }
        });
      });
    }

    // arrAux.map((data: any) => {
    //   this.streamDetailsAux.products.map((aux) => {
    //     if (aux._id == data._id) {
    //       productFilter.push(data);
    //       contador++;
    //     }
    //   });
    // });

    if (contador == 0) {
      this.streamDetailsAux.products.map((data) => {
        productFilter.push(data);
      });
    }

    this.streamDetails.products = productFilter;
    //delete this.streamDetails.productsAux;
    this.setLocalStream();
  }

  validDuplicateProducts() {
    // copy
    let streamDetails2 = { ...this.streamDetails };
    // streams uniques
    let streamUnique = streamDetails2.products.filter(
      (el, index) =>
        streamDetails2.products.findIndex(
          (element) => element._id === el._id
        ) === index
    );
    // for stream uniques
    streamUnique.forEach((productUnique) => {
      let multi = [];
      // for streams
      this.streamDetails.products.forEach((products) => {
        if (productUnique._id === products._id) {
          multi = multi.concat(products.showVideoMulti);
        }
      });
      productUnique.showVideoMulti = multi;
    });

    this.streamDetails.products = streamUnique.slice();
  }

  setShowVideosProperty() {
    //se agrega un array para poder gestionar los diferentes tiempos de aparicion en el video
    this.streamDetails.products.forEach((element) => {
      element.timeIn = element.timeInValue1 + ":" + element.timeInValue2;
      element.timeOut = element.timeOutValue1 + ":" + element.timeOutValue2;
      if (element.showVideoMulti == undefined) {
        element.showVideoMulti = [
          {
            timeIn: element.timeIn,
            timeOut: element.timeOut,
            timeInValue1: element.timeIn.split(":")[0],
            timeInValue2: element.timeIn.split(":")[1],
            timeOutValue1: element.timeOut.split(":")[0],
            timeOutValue2: element.timeOut.split(":")[1],
          },
        ];
      }
    });
    this.setLocalStream();
  }

  setLocalStream() {
    this.dataService.setItemInStorage(this.streamDetails, "StreamDetail");
    this.streamDetails = this.dataService.getItemFromStorage("StreamDetail");
  }

  ngOnDestroy() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes["streamDetails"]) {
      this.productInitialTimeSetter(this.streamDetails.videoDuration);
    }
  }

  removeProduct(index: any) {
    this.streamDetails.products.splice(index, 1)[0];
    this.validDuplicateProducts();
    this.setLocalStream();
    this.emitUpdateStreamGlobal();
  }

  productInitialTimeSetter(totalVideoTime) {
    this.setShowVideosProperty();
    this.validDuplicateProducts();
    if (!this.streamDetailsAux.productsAux) {
      this.streamDetailsAux = this.streamDetails;
    }
    this.streamDetails.products.forEach((element) => {
      element.timeInError = false;
      element.timeOutError = false;
      element.isTimeOut = false;

      //setting time Out of fields
      if (totalVideoTime != undefined) {
        var minutes = Math.floor(totalVideoTime / 60);
        var seconds = totalVideoTime - minutes * 60;
      } else {
        var minutes = 0;
        var seconds = 0;
      }

      if (!element.isAssociated || this.streamDetails.isVideoChanged) {
        //setting time In of fields
        element.timeInValue1 = !element.timeInValue1
          ? "00"
          : element.timeInValue1;
        element.timeInValue2 = !element.timeInValue2
          ? "00"
          : element.timeInValue2;

        if (minutes.toString().length < 2) {
          element.timeOutValue1 = "0" + minutes;
        } else {
          element.timeOutValue1 = minutes;
        }
        if (seconds.toString().length < 2) {
          element.timeOutValue2 = "0" + seconds;
        } else {
          element.timeOutValue2 = seconds;
        }
        element.isAssociated = true;
      }

      element.timeIn = element.timeInValue1 + ":" + element.timeInValue2;
      element.timeOut = element.timeOutValue1 + ":" + element.timeOutValue2;

      //se agregan las diferentes apariciones de los productos
      if (element.showVideoMulti == undefined) {
        this.setShowVideosProperty();
      }

      element.showVideoMulti.forEach((elem) => {
        if (elem.timeInValue1 == "undefined") {
          elem.timeIn = element.timeInValue1 + ":" + element.timeInValue2;
          elem.timeOut = element.timeOutValue1 + ":" + element.timeOutValue2;
          elem.timeInValue1 = element.timeInValue1;
          elem.timeInValue2 = element.timeInValue2;
          elem.timeOutValue1 = element.timeOutValue1;
          elem.timeOutValue2 = element.timeOutValue2;
        }
      });
    });
    this.setLocalStream();
  }

  validFormatSegMin(valor) {
    let val = Math.abs(isNaN(Math.trunc(valor)) ? 0 : Math.trunc(valor));
    return val < 10 ? "0" + val : val;
  }

  //validacion para evitar duplicidad de aparicion del producto en el mismo rango de
  validShowNotRepeat(product, iVideo) {
    let valid: boolean = false;
    let timeInSeg =
      parseInt(product.showVideoMulti[iVideo].timeInValue1) * 60 +
      parseInt(product.showVideoMulti[iVideo].timeInValue2);
    let timeOutSeg =
      parseInt(product.showVideoMulti[iVideo].timeOutValue1) * 60 +
      parseInt(product.showVideoMulti[iVideo].timeOutValue2);

    product.showVideoMulti.filter((data, i) => {
      if (product.showVideoMulti.length > 1) {
        if (i != iVideo) {
          let timeInSegAux =
            parseInt(data.timeInValue1) * 60 + parseInt(data.timeInValue2);
          let timeOutSegAux =
            parseInt(data.timeOutValue1) * 60 + parseInt(data.timeOutValue2);
          if (
            (timeInSeg >= timeInSegAux && timeInSeg <= timeOutSegAux) ||
            (timeOutSeg >= timeInSegAux && timeOutSeg <= timeOutSegAux) ||
            (timeInSeg <= timeInSegAux && timeOutSeg >= timeOutSegAux)
          ) {
            valid = true;
          }
        }
      }
    });
    return valid;
  }

  advanceErrorHandling(event, index, item, iVideo) {
    let startTime = 0;
    let finishTime = this.streamDetails.videoDuration;

    //formateo de cada input con su formato valido
    item.showVideoMulti[iVideo].timeInValue1 = this.validFormatSegMin(
      item.showVideoMulti[iVideo].timeInValue1
    );
    item.showVideoMulti[iVideo].timeInValue2 = this.validFormatSegMin(
      item.showVideoMulti[iVideo].timeInValue2
    );
    item.showVideoMulti[iVideo].timeOutValue1 = this.validFormatSegMin(
      item.showVideoMulti[iVideo].timeOutValue1
    );
    item.showVideoMulti[iVideo].timeOutValue2 = this.validFormatSegMin(
      item.showVideoMulti[iVideo].timeOutValue2
    );

    let productTimeInMins = parseInt(item.showVideoMulti[iVideo].timeInValue1);
    let productTimeInSecs = parseInt(item.showVideoMulti[iVideo].timeInValue2);
    let productTimeOutMins = parseInt(
      item.showVideoMulti[iVideo].timeOutValue1
    );
    let productTimeOutSecs = parseInt(
      item.showVideoMulti[iVideo].timeOutValue2
    );

    let productInTime = productTimeInMins * 60 + productTimeInSecs;
    let productOutTime = productTimeOutMins * 60 + productTimeOutSecs;

    //se asigna el valor del segundo a los imputs
    item.showVideoMulti[iVideo].timeIn =
      item.showVideoMulti[iVideo].timeInValue1 +
      ":" +
      item.showVideoMulti[iVideo].timeInValue2;
    item.showVideoMulti[iVideo].timeOut =
      item.showVideoMulti[iVideo].timeOutValue1 +
      ":" +
      item.showVideoMulti[iVideo].timeOutValue2;

    //validar que no se repitan los rangos de videos
    let validShowVideosRepetat = this.validShowNotRepeat(item, iVideo);
    if (
      productInTime < startTime ||
      productInTime >= productOutTime ||
      productInTime > finishTime ||
      productTimeInSecs >= 60 ||
      productTimeOutSecs >= 60 ||
      productTimeInMins >= 60 ||
      productTimeOutMins >= 60 ||
      validShowVideosRepetat == true
    ) {
      item.showVideoMulti[iVideo].timeInError = true;
      this.timeIncorrect = true;
      this.streamDetails.timeError = true;
      this.emitAlertError();
    } else {
      item.showVideoMulti[iVideo].timeInError = false;
      this.timeIncorrect = false;
      this.streamDetails.timeError = false;
      this.emitAlertError();
    }
    if (
      productOutTime <= productInTime ||
      productOutTime > finishTime ||
      productTimeInSecs >= 60 ||
      productTimeOutSecs >= 60 ||
      productTimeInMins >= 60 ||
      productTimeOutMins >= 60 ||
      validShowVideosRepetat == true
    ) {
      this.timeIncorrect = true;
      this.streamDetails.timeError = true;
      item.showVideoMulti[iVideo].timeOutError = true;
      this.emitAlertError();
    } else {
      this.timeIncorrect = false;
      this.streamDetails.timeError = false;
      item.showVideoMulti[iVideo].timeOutError = false;
      this.emitAlertError();
    }

    this.setLocalStream();
    this.emitUpdateStreamGlobal();
  }

  emitUpdateStreamGlobal() {
    this.updatedStreamEmitter.emit({
      updatedStream: this.streamDetails,
      isCreate: false,
    });
  }

  emitAlertError() {
    this.errroEmiiter.emit({
      errorMessages: this.errorMessages,
      isTimeError: this.timeIncorrect,
    });
  }

  getUpdatedStream(isCreate) {
    this.streamDetails.products.forEach((element) => {
      (element.timeIn = `${element.timeInValue1}:${element.timeInValue2}`),
        (element.timeOut = `${element.timeOutValue1}:${element.timeOutValue2}`);
    });
    this.updatedStreamEmitter.emit({
      updatedStream: this.streamDetails,
      isCreate,
    });
  }

  addShowVideoXProduct(index: number) {
    this.streamDetails.products[index].showVideoMulti.push({
      timeIn: this.streamDetails.products[index].timeIn,
      timeOut: this.streamDetails.products[index].timeOut,
      timeInValue1: this.streamDetails.products[index].timeIn.split(":")[0],
      timeInValue2: this.streamDetails.products[index].timeIn.split(":")[1],
      timeOutValue1: this.streamDetails.products[index].timeOut.split(":")[0],
      timeOutValue2: this.streamDetails.products[index].timeOut.split(":")[1],
      timeInError: false,
      timeOutError: false,
      isTimeOut: false,
    });

    this.setLocalStream();
    let indiceNew =
      this.streamDetails.products[index].showVideoMulti.length - 1;
    this.advanceErrorHandling(
      "",
      "",
      this.streamDetails.products[index],
      indiceNew
    );
  }

  deleteShowVideoProduct(producto, iVideo) {
    producto.showVideoMulti.splice(iVideo, 1);
    this.setLocalStream();
    this.emitUpdateStreamGlobal();
  }

  // addMoreProducts() {
  //   if (this.timeIncorrect) {
  //     this.errroEmiiter.emit({ errorMessages: this.errorMessages, isTimeError: this.timeIncorrect });
  //     return;
  //   }
  //   this.dataService.transferData(this.streamDetails);
  //   localStorage.setItem('StreamDetail', JSON.stringify(this.streamDetails));
  //   this.router.navigate(['/choose-products'])
  // }
}
