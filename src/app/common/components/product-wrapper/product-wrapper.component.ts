import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-wrapper',
  templateUrl: './product-wrapper.component.html',
  styleUrls: ['./product-wrapper.component.scss']
})
export class ProductWrapperComponent implements OnInit {

  constructor() { }
  @Input() streamDetails: any = {};
  isFormHide: Boolean = false;
  @Input() isFormDisplay: Boolean = false;
  @Input() listOfProductsShowing: any = [];
  ngOnInit() {
  }

  displayHideForm(status) {
    this.isFormHide = !status
  }
}
