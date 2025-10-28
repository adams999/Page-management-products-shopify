import { Component, OnInit } from '@angular/core';
import { OrderService } from '.././../../common/services/order.service'
import * as moment from 'moment';
@Component({
  selector: 'list-orders-app',
  templateUrl: './list-orders.html',
  styleUrls: ['./list-orders.scss']
})
export class ListOrdersComponent implements OnInit {
  constructor(private orderService: OrderService) {
    this.infiniteScroll();

  }
  lastScrollTop: any = 0
  _timeout: any = null;
  orders: any = []
  filterKeys: any = {
    status: '',
    sortBy: '',
    search: '',
    limit: 10,
    offset: 0,
  };
  sum = 10;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  currentValue: any = "Default";
  searchKey: any = "";
  allOrders: any = [];
  ordersCount = 0;
  totalOrders = 0;
  totalSales: number = 0;
  modlData: any;

  ngOnInit() {
    this.getAllOrders();
    this.getOrders();
  }

  calculateDuration(string: any) {
    return moment(string).format('L');
  }

  getOrders() {
    this.orderService.getOrders(this.filterKeys).subscribe((res: any) => {
      res.body.orders.forEach(element => {
        this.orders.push(element);
      });;
    })
  }
  getAllOrders() {
    this.orderService.getAllOrders().subscribe((res: any) => {
      this.totalSales = res.body.ordersData.totalSales;
      this.ordersCount = res.body.ordersData.count;
    })
  }

  filterFunc(current: any, type: any) {
    this.currentValue = current;
    this.filterKeys.sortBy = type;
    this.filterKeys.offset = 0;
    this.orders = []
    this.getOrders();
  }

  applyFilter(dropMenu) {
    dropMenu.classList.remove("show");
    this.orderService.getOrdersFilter(this.filterKeys).subscribe((res: any) => {
      this.orders = res.body.orders;
    })
  }

  search(event: any) {
    this.filterKeys.search = event.target.value;
    this.orderService.getOrdersFilter(this.filterKeys).subscribe((res: any) => {
      this.orders = res.body.orders
    })
  }

  infiniteScroll() {
    this._timeout = null;
    window.onscroll = (event: any) => {
      if (this._timeout) {
        window.clearTimeout(this._timeout);
      }
      this._timeout = setTimeout(() => {
        this._timeout = null;
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if (st > this.lastScrollTop) {
          if ((document.getElementById("table").clientHeight + window.scrollY) >= document.getElementById("table").offsetHeight && this.filterKeys.limit < (this.ordersCount + 10)) {
            this.filterKeys.offset += 10;
            this.getOrders();
          }
        } else {
          // console.log("up")      
        }
        this.lastScrollTop = st <= 0 ? 0 : st;
      }, 250);
    };
  }
  modalData(data) {
    this.modlData = data;
  }
  convertDate(date) {
    return moment(date).format('MM/DD/YYYY')
  }
}
