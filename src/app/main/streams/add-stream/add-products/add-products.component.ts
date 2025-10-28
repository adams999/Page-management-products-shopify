import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataService } from "src/app/common/services/data.service";
import { ProductService } from "src/app/common/services/products.service";
import { StoreService } from "src/app/common/services/store.service";
import { UserService } from "src/app/common/services/user.service";
import { ResponseManagerService } from "src/app/common/services/response-manager.service";
import { HostListener } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { GoogleAnalyticsService } from "src/app/common/services/google-analytics.service";
import { environment } from "./../../../../../environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SplitIoService } from "src/app/common/services/splitio.service";

@Component({
  selector: "add-products-app",
  templateUrl: "./add-products.html",
  styleUrls: ["./add-products.scss"],
})
export class AddProductsComponent implements OnInit {
  streamDetails: any = {
    products: [],
  };
  selectedProducts: any = [];
  products: any = [];
  previousData: any = {};
  checkProduct: boolean = false;
  signIn: boolean = true;
  storeConnected: boolean = true;
  storeIdSample: any = "store-simustream.myshopify.com";
  storeDetails: any = {
    storeId: "",
  };
  user: any = {};
  storeAccount: any = "";
  defualtImage: any =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj28enJ88WoQW1r8vmWHtTNMbhhj6-SE1dctNRmtYZ2LR0y3Oc";
  breadCrumbNumber: any = "2";
  filterKeys: any = {
    search: "",
    sortBy: "",
    limit: 9,
    offset: 0,
  };
  accountId: any = "";
  notSearchResult: boolean = false;
  SearchResultMessage: any = "";
  errorMessages: any = {
    streamProduct: "Please select atleast one product",
  };
  selectedArray: any = [];
  lastScrollTop: any = 0;
  allProducts: any = "";
  _timeout: any = null;
  productsCount = 0;
  asscoiated: boolean = true;
  loader: boolean = true;
  connect: boolean = false;
  disableButton: boolean = false;
  redirectUrl: any = environment.store_forwarding_address;
  header: any = "Edit Stream";

  constructor(
    private dataService: DataService,
    private productService: ProductService,
    private storeService: StoreService,
    private router: Router,
    private userService: UserService,
    private responseManager: ResponseManagerService,
    private cookieService: CookieService,
    public googleAnalyticsService: GoogleAnalyticsService,
    private modalService: NgbModal,
    public splitIoService: SplitIoService
  ) {}
  ngOnInit() {
    this.splitIoService.initSdk();
    this.checkStoreLoggedIn();
    this.user = this.userService.user;
    this.previousData = this.dataService.getItemFromStorage("StreamDetail");
    if (!this.previousData) {
      this.router.navigate(["/list-streams"]);
    }
    this.streamDetails = this.previousData;
  }

  ngOnDestroy() {}

  checkStoreLoggedIn() {
    let accountType = "shopify";
    this.storeService.checkStoreLoggedIn(accountType).subscribe(
      (res: any) => {
        this.storeConnected = res.body.loggedIn;
        //default 0, shopify
        this.storeAccount = res.body.account[0];
        if (this.storeConnected == true) {
          this.signIn = true;
          this.getProducts(this.storeAccount._id);
          this.getAllProducts(this.storeAccount._id);
        } else {
          this.signIn == false;
        }
        this.storeAccount = res.body.account;
      },
      (error: any) => {
        this.loader = false;
        this.signIn = false;
        this.storeConnected = false;
      }
    );
  }

  addProduct(product) {
    if (!product.timeIn || product.timeIn == "") {
      product.timeIn = "";
    }
    if (!product.timeOut || product.timeOut == "") {
      product.timeOut = "";
    }

    if (product.isSelected == true) {
      product.isSelected = false;
      product.isAssociated = false;
      if (this.selectedArray.length) {
        this.selectedArray.splice(this.selectedArray.indexOf(product), 1);
      }
    } else if (!product.isSelected) {
      product.isSelected = true;
      product.isAssociated = false;
      product.type = "product";
      if (this.selectedArray.indexOf(product) < 0) {
        this.selectedArray.push(product);
      }
    }
  }

  associateProducts() {
    let streamAux = null;
    //con esto no se perdera la data de los videos por productos
    if (
      this.dataService.getItemFromStorage("StreamDetail") != null &&
      this.dataService.getItemFromStorage("StreamDetail") != undefined
    ) {
      streamAux = this.dataService.getItemFromStorage("StreamDetail");
    }

    this.googleAnalyticsService.eventEmitter(
      "Buttons",
      "Associate Products",
      "choose-products",
      1
    );
    this.streamDetails = streamAux;
    this.streamDetails.products = this.products.filter(
      (element) => element.isSelected === true
    );
    if (this.streamDetails.products.length) {
      this.dataService.setItemInStorage(this.streamDetails, "StreamDetail");
      if (this.streamDetails._id) {
        this.router.navigate(["/edit-stream", this.streamDetails._id]);
        return;
      }
      this.router.navigate(["/associate-items"]);
    } else {
      this.responseManager.error.errorMessage =
        this.errorMessages.streamProduct;
    }
  }

  getProducts(accountId) {
    this.accountId = accountId;
    this.productService
      .getProducts(accountId, this.filterKeys)
      .subscribe((res: any) => {
        res.body.products.forEach((element) => {
          this.products.push(element);
        });
        this.previousSelectedProducts();
        this.loader = false;
      });
  }

  previousSelectedProducts() {
    if (this.previousData.products) {
      this.products.forEach((e1) => {
        this.streamDetails.products.forEach((e2) => {
          if (e1._id == e2._id) {
            e1.isSelected = true;
            e1.isAssociated =
              e2.timeInValue1 &&
              e2.timeInValue1 &&
              e2.timeInValue2 &&
              e2.timeOutValue2
                ? true
                : false;
            e1.timeInValue1 = e2.timeInValue1;
            e1.timeInValue2 = e2.timeInValue2;
            e1.timeOutValue1 = e2.timeOutValue1;
            e1.timeOutValue2 = e2.timeOutValue2;
            e1.type = e2.type;
            this.selectedArray.push(e1);
          }
        });
      });
    }
  }

  signInStroe() {
    this.signIn = true;
  }

  search(event: any) {
    this.filterKeys.search = event.target.value;
    this.productService
      .getProductsFilters(this.accountId, this.filterKeys)
      .subscribe((res: any) => {
        this.products = res.body.products;
        if (!this.products.length) {
          this.notSearchResult = true;
          this.SearchResultMessage = "No results found";
        } else {
          this.notSearchResult = false;
          this.SearchResultMessage = "";
        }
      });
  }

  connectStore() {
    this.connect = true;
  }

  continue() {
    this.checkProduct = true;
    this.disableButton = true;
    window.open(
      this.redirectUrl +
        `/shopify?store=${this.storeDetails.storeId}&userId=${
          this.user._id
        }&accountType=shopify&token=${this.cookieService.get(
          "token"
        )}&fromShopify=` +
        environment.fromShopify,
      "_blank" // <- This is what makes it open in a new window.
    );
  }

  getAllProducts(accountId) {
    this.productService.getAllProducts(accountId).subscribe((res: any) => {
      this.allProducts = res.body.products;
      this.productsCount = res.body.count;
    });
  }

  cancelStream() {
    this.router.navigate(["/list-streams"]);
  }

  selectLeadForm() {
    this.streamDetails.products = this.products.filter(
      (element) => element.isSelected === true
    );
    this.dataService.setItemInStorage(this.streamDetails, "StreamDetail");
    this.router.navigate(["/choose-lead-form"]);
  }

  @HostListener("scroll", ["$event"])
  onElementScroll($event) {
    this._timeout = setTimeout(() => {
      this._timeout = null;
      var st = document.getElementById("client").scrollTop;
      if (st > this.lastScrollTop) {
        if (
          document.getElementById("client").scrollTop +
            document.getElementById("client").clientHeight >=
            document.getElementById("grid").offsetHeight &&
          this.filterKeys.offset < this.productsCount + 10
        ) {
          this.filterKeys.offset += 9;
          this.getProducts(this.accountId);
        }
      } else {
        console.log("up");
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    }, 250);
  }

  openModalInfo(content) {
    this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
      size: "sm",
      centered: true,
    });
  }
}
