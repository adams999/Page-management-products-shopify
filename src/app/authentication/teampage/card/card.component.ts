import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-teamcard',
  templateUrl: './card.html',
  styleUrls: ['./card.scss'],
})
export class CardComponent implements OnInit {

  @Input() index: any;
  @Input() image: any;
  @Input() name: any;
  @Input() post: any;
  @Input() description: any;
  @Input() facebook: any;
  @Input() twitter: any;
  @Input() linkedin: any;
  @Input() close: any;
  @Input() imageExpand: any;

  @Input() triggerindex: any;

  @Output() databack = new EventEmitter<string>();
  disableTriggeredBtn = false;
  obj: any
  constructor() { }
  ngOnInit() {
  }
  emiteventtoteam() {
    this.obj = {
      index : this.index,
      imageExpand: this.imageExpand,
      image : this.image,
      name : this.name,
      post : this.post,
      description : this.description,
      facebook: this.facebook,
      linkedin : this.linkedin,
      twitter : this.twitter
    }
    this.databack.emit(JSON.stringify(this.obj))
  }
}