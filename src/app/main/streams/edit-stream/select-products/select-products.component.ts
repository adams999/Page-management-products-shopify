import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/common/services/products.service';
import { StoreService } from 'src/app/common/services/store.service';
import { UserService } from 'src/app/common/services/user.service';
import { HostListener } from '@angular/core';
@Component({
  selector: 'select-products-app',
  templateUrl: './select-products.html',
  styleUrls: ['./select-products.scss'],

})
export class SelectProductsComponent implements OnInit {
  streamDetails: any = {};
  selectedProducts: any = []
  products: any = []
  previousData: any = {}
  checkProduct: boolean = false;
  signIn: boolean = false;
  storeConnected: boolean = false;
  storeIdSample: any = "store-simustream.myshopify.com";
  storeDetails: any = {
    storeId: ''
  }
  user: any = {};
  storeAccount: any = "";
  defualtImage: any = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj28enJ88WoQW1r8vmWHtTNMbhhj6-SE1dctNRmtYZ2LR0y3Oc";
  breadCrumbNumber: any = '2';
  filterKeys: any = {
    search: '',
    sortBy: '',
    limit: 9,
    offset: 0,
  };
  accountId: any = "";
  notSearchResult: boolean = false;
  addNew: boolean = false;
  allProducts: any = ""
  productsCount: any = ""
  errorMessages: any = {
    account: "",
  }
  loader: boolean = true;
  lastScrollTop: any = 0
  _timeout: any = null;
  constructor(private productService: ProductService, private storeService: StoreService, private router: Router, private userService: UserService) {

  }
  
  ngOnInit() {
    this.addNew = false;
    this.checkStoreLoggedIn()
    this.getUser()
    this.previousData = JSON.parse(localStorage.getItem('updateStreamDetail'));
    if (this.previousData) {
      this.streamDetails = this.previousData
    }

  }

  getUser() {
    this.userService.getMe().then((res: any) => {
      this.user = res.body.user
    }).catch((error) => {
      console.log("Error: ", error)
    })
  }

  getAllProducts(accountId) {
    this.productService.getAllProducts(accountId).subscribe((res: any) => {
      this.allProducts = res.body.products;
      this.productsCount = res.body.count;
    })
  }
  
  checkStoreLoggedIn() {
    let accountType = "shopify"
    this.storeService.checkStoreLoggedIn(accountType).subscribe((res: any) => {
      this.storeConnected = res.body.loggedIn;
      this.storeAccount = res.body.account;
      this.errorMessages.account = "";
      if (this.storeConnected == true) {
        this.signIn = true;
        this.getProducts(this.storeAccount._id, this.filterKeys);
        this.getAllProducts(this.storeAccount._id);
      }
      else {
        this.signIn == false
      }
      this.storeAccount = res.body.account;
    },
      (error => {
        this.loader = false;
        this.errorMessages.account = error.error.status.message;
      }))
  }
  addProduct(product) {
    product.timeIn = ""
    product.timeOut = ""
    if (product.isSelected == true) {
      product.isSelected = false
    }
    else if (!product.isSelected) {
      product.isSelected = true;
      product.type  = 'product';
  
    }
  }
  ngOnDestroy() {
    if (!this.addNew) {
      localStorage.removeItem('updateStreamDetail');
    }
  }
  associateProducts() {
    this.addNew = true;
    this.streamDetails.products = this.products.filter(element => element.isSelected == true );
    if (this.streamDetails.products.length) {
      localStorage.setItem('updateStreamDetail', JSON.stringify(this.streamDetails));
      this.router.navigate(['/edit-stream', this.streamDetails._id])
    }
  }

  getProducts(accountId, filterType) {

    this.accountId = accountId
    this.productService.getProducts(accountId, this.filterKeys).subscribe((res: any) => {
      this.loader = false;
      res.body.products.forEach(element => {
        this.products.push(element)
      });;
      this.previousSelectedProducts()
    })
  }

  previousSelectedProducts() {
    if (this.previousData.products) {
      this.products.forEach(e1 => {
        this.streamDetails.products.forEach(e2 => {
          if (e1._id == e2._id) {
            e1.isSelected = true
            e1.timeIn = e2.timeIn
            e1.timeOut = e2.timeOut
            e1.timeInValue1 = e2.timeInValue1;
            e1.timeInValue2 = e2.timeInValue2;
            e1.timeOutValue1 = e2.timeOutValue1;
            e1.timeOutValue2 = e2.timeOutValue2;
            e1.type = e2.type;
            e1.isAssociated = true;
          }
        });
      });
    }
  }

  cancel() {
    this.addNew = true;
    this.router.navigate(['/edit-stream', this.streamDetails._id])
  }

  signInStroe() {
    this.signIn = true
  }

  search(event: any) {
    this.filterKeys.search = event.target.value;
    this.productService.getProductsFilters(this.accountId, this.filterKeys).subscribe((res: any) => {
      this.products = res.body.products
      if (!this.products.length) {
        this.notSearchResult = true
      }
      else {
        this.notSearchResult = false

      }
    })
  }

  connectStore() {
    this.checkProduct = true;
    window.location.href = `https://1c5e7279.ngrok.io/shopify?store=simustream-store.myshopify.com&userId=${this.user._id}&accountType=shopify`
  }

  @HostListener('scroll', ['$event'])
  onElementScroll($event) {
    this._timeout = setTimeout(() => {
      this._timeout = null;
      var st = document.getElementById("client").scrollTop;
      if (st > this.lastScrollTop) {
        if ((document.getElementById("client").scrollTop + (document.getElementById("client").clientHeight)) >= document.getElementById("grid").offsetHeight && this.filterKeys.offset < (this.productsCount + 10)) {
          this.filterKeys.offset += 9;
          this.getProducts(this.accountId,this.filterKeys);
        }
      } else {
        console.log("up");
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    }, 250);
  }
}
