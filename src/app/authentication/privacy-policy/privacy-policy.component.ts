import { Component, OnInit } from '@angular/core';
import { PDFDocumentProxy } from 'pdfjs-dist';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  show: Boolean = false;
  constructor() {
  }

  ngOnInit() {
  }

  showNote(pdf: PDFDocumentProxy) {
    this.show = true
  }
}
