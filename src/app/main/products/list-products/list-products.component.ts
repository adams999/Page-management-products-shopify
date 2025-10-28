import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../common/services/products.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { StoreService } from '../../../common/services/store.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'list-products-app',
  templateUrl: './list-products.html',
  styleUrls: ['./list-products.scss']
})
export class ListProductsComponent implements OnInit {
  constructor(private productService: ProductService, private config: NgbDropdownConfig, private storeService: StoreService) {

    config.placement = 'bottom-right'
  }
  products: any = [];
  totalProducts: any = "";
  stream: any = "";
  displayStyle: any = "grid";
  now: any = "";
  currentFilter: any = "Default";
  filterKeys: any = {
    sortBy: 'createdAt',
    search: '',
    limit: 9,
    offset: 0,
    minPrice: '',
    maxPrice: ''
  };
  checkProduct: boolean = false;
  signIn: boolean = false;
  storeConnected: boolean = false;
  storeDetails: any = {
    storeId: ''
  }
  user: any = {};
  storeAccount: any = "";
  accountId: any = "";
  lastScrollTop: any = 0
  allProducts: any = '';
  _timeout: any = null;
  productsCount = 0;
  loader: boolean = true;
  errorMessages: any = {
    account: "",
  }
  header = "Products";
  disableButtons = {
    refreshList: false
  }
  ngOnInit() {
    this.checkStoreLoggedIn();
  }

  getProducts(accountId, filterType) {
    this.accountId = accountId
    this.filterKeys.sortBy = filterType.sortBy
    this.productService.getProducts(accountId, this.filterKeys).subscribe((res: any) => {
      this.loader = false;
      res.body.products.forEach(element => {
        this.products.push(element)
      });;
      this.disableButtons.refreshList = false;
    })
  }
  getAllProducts(accountId) {
    this.productService.getAllProducts(accountId).subscribe((res: any) => {
      this.allProducts = res.body.products;
      this.productsCount = res.body.count;
    })
  }
  refreshList() {
    this.disableButtons.refreshList = true;
    this.filterKeys = {
      sortBy: 'createdAt',
      search: '',
      limit: 9,
      offset: 0,
    };
    this.products = []
    this.getProducts(this.accountId, this.filterKeys);
  }

  checkStoreLoggedIn() {
    let accountType = "shopify"
    this.storeService.checkStoreLoggedIn(accountType).subscribe((res: any) => {
      this.storeConnected = res.body.loggedIn;
      // eye, mejorar
      this.storeAccount = res.body.account[0];
      this.errorMessages.account = "";
      if (this.storeConnected == true) {
        this.signIn = true;
        this.getProducts(this.storeAccount._id, this.filterKeys);
        this.getAllProducts(this.storeAccount._id);
      }
      else {
        this.signIn == false
      }
      this.storeAccount = res.body.account[0];
    },
      (error => {
        this.loader = false;
        this.errorMessages.account = error.error.status.message;
      }))
  }

  switchDisplay(displayStyle: any) {
    this.displayStyle = displayStyle
  }

  filterFunc(current: any, type: any) {
    this.currentFilter = current.toString();
    this.filterKeys.sortBy = type;
    this.filterKeys.offset = 0
    this.products = []

    this.getProducts(this.accountId, this.filterKeys)
    // this.productService.getProductsFilters(this.accountId, this.filterKeys).subscribe((res: any) => {
    //   this.products = res.body.products
    // })
  }

  search(event: any) {
    // this.loader = true;
    this.filterKeys.search = event.target.value;
    this.productService.getProductsFilters(this.accountId, this.filterKeys).subscribe((res: any) => {
      this.products = res.body.products;
      this.loader = false;
    })
  }

  @HostListener('scroll', ['$event'])
  onElementScroll($event) {
    this._timeout = setTimeout(() => {
      this._timeout = null;
      var st = document.getElementById("client").scrollTop;
      if (st > this.lastScrollTop) {
        if ((document.getElementById("client").scrollTop + (document.getElementById("client").clientHeight)) >= document.getElementById("grid").offsetHeight && this.filterKeys.offset < (this.productsCount + 10)) {
          this.filterKeys.offset += 9;
          this.getProducts(this.accountId, this.filterKeys);
        }
      } else {
        // console.log("up");
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    }, 250);
  }

  applyFilter(dropdown) {
    dropdown.classList.remove("show");
    if (this.filterKeys.price == 'Any') {
      this.filterKeys.price = '0';
    }
    this.productService.getProductsFilters(this.accountId, this.filterKeys).subscribe((res: any) => {
      this.products = res.body.products
    })
  }

  totalSalesDecimalHandled(totalSales) {
    return totalSales.toFixed(2)
  }
}
