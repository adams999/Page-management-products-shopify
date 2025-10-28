import { Component, OnInit } from '@angular/core';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-acceptable-policy',
  templateUrl: './acceptable-policy.component.html',
  styleUrls: ['./acceptable-policy.component.scss']
})
export class AcceptablePolicyComponent implements OnInit {
  screenHeight: any;
  show: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  showNote(pdf: PDFDocumentProxy) {
    this.show = true
  }
}
