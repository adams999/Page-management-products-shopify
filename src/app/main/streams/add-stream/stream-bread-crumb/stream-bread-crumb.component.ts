import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'stream-bread-crumb-app',
  templateUrl: './stream-bread-crumb.html',
  styleUrls: ['./stream-bread-crumb.scss']
})
export class StreamBreadCrumbComponent implements OnInit {
  @Input() crumbNumber: any={};
  breadCrumbData: any = [{
    selected: false,
    breadCrumb: 'Stream Details',
    number: '1',
    completed:false
  },
  {
    selected: false,
    breadCrumb: 'Choose Products',
    number: '2',
    completed:false
  },
  {
    selected: false,
    breadCrumb: 'Associate Products',
    number: '3',
    completed:false
  },
  {
    selected: false,
    breadCrumb: 'Publish & Share',
    number: '4',
    completed:false
  }
  ]
  constructor() {

  }
  ngOnInit() {
this.checkCrumb();
  }
  checkCrumb() {
    let selectedIndex;
    this.breadCrumbData.forEach((element,index) => {
      if (element.number == this.crumbNumber) {
        element.selected = true
        selectedIndex =  index
      }
    });
    this.breadCrumbData.forEach((element,index) => {
      if(index<selectedIndex){
        element.completed = true;
    }
    });
  }
}
