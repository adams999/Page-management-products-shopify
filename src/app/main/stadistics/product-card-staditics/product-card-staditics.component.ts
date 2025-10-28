import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-product-card-staditics',
  templateUrl: './product-card-staditics.component.html',
  styleUrls: ['./product-card-staditics.component.scss']
})
export class ProductCardStaditicsComponent implements OnInit {

  @Input() productStadistic = {
    urlImg:"https://cdn.shopify.com/s/files/1/0571/7816/1341/products/pexels-photo-90946.jpg?v=1623270930",
    name:"Card Title",
    id:"fsdghfdvf",
    productInformation:[
      {
        label:"Add to Cart: ",
        text:10,
        symbol:"%"
      },
      {
        label:"Removed to Cart: ",
        text:5,
        symbol:"%"
      },
      {
        label:"Ammount Payment: ",
        text:123,
        symbol:"$"
      },
      {
        label:"Quantily Payment : ",
        text:100
      },
      {
        label: "Views Products:",
        text: 200
      }
    ]
  }

  constructor() { }

  ngOnInit() {
  }

}
