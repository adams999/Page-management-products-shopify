import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/common/services/data.service';

@Component({
  selector: 'app-choose-mode',
  templateUrl: './choose-mode.component.html',
  styleUrls: ['./choose-mode.component.scss']
})
export class ChooseModeComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService) { }
  formMode: any = "customForm";
  previousData: any = {};
  streamDetails: any = {};
  ngOnInit() {

  }

  cancelStream() {
    this.router.navigate(['/list-leads-forms']);
  }

  nextFunction() {
    if (this.formMode === "customForm") {
      this.router.navigate(['/create-lead-form'])
    }
    else {
      this.router.navigate(['/choose-template-form'])
    }
  }
}
