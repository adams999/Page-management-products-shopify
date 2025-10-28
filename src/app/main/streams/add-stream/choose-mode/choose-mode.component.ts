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
  breadCrumbNumber: any = '2';
  streamMode: any = "leadStream";
  previousData: any = {};
  streamDetails: any = {};
  ngOnInit() {
    this.dataService.currentData.subscribe(streamData => this.streamDetails = streamData);
    this.previousData = JSON.parse(localStorage.getItem('StreamDetail'));
    if (!this.streamDetails) {
      if (!this.previousData) {
        this.router.navigate(['/list-streams'])
      }
      if (this.previousData) {
        this.streamDetails = this.previousData
      }
    }
  }

  cancelStream() {
    this.router.navigate(['/list-streams']);
  }

  nextFunction() {
    this.streamDetails.type = this.streamMode;
    this.dataService.transferData(this.streamDetails)
    localStorage.setItem('StreamDetail', JSON.stringify(this.streamDetails));
    if (this.streamMode === "leadStream") {
      this.router.navigate(['/choose-lead-form'])
    }
    else {
      this.router.navigate(['/choose-products'])
    }
  }
}
