import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from 'src/app/common/services/data.service';
import { Router } from '@angular/router';
import { CreateFormComponent } from '../../../../common/components/create-form/create-form.component';
@Component({
  selector: 'app-create-lead-form',
  templateUrl: './create-lead-form.component.html',
  styleUrls: ['./create-lead-form.component.scss']
})
export class CreateLeadFormComponent implements OnInit {

  constructor(private router: Router, private dataService: DataService) { }
  defaultInputFields: any = [
    {
      label: "Email",
      name: "email",
      validation: {
        isRequired: true
      },
      isCustom: false,
      timeIn: "",
      timeOut: "",
      isAssociated: false
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      validation: {
        isRequired: true
      },
      isCustom: false,
      timeIn: "",
      timeOut: "",
      isAssociated: false
    },
    {
      label: "Name",
      name: "name",
      validation: {
        isRequired: true
      },
      isCustom: false,
      timeIn: "",
      timeOut: "",
      isAssociated: false
    }
  ];
  customInputFields: any = [];
  streamDetails: any = {};
  previousData: any = {};
  breadCrumbNumber: any = '2';
  @ViewChild(CreateFormComponent) createForm: CreateFormComponent;

  ngOnInit() {
    this.dataService.currentData.subscribe(streamData => this.streamDetails = streamData);
    if (!this.streamDetails) {
      this.previousData = JSON.parse(localStorage.getItem('StreamDetail'));
      this.streamDetails = this.previousData;
    }

    this.customInputFields = this.streamDetails.leadsFields && this.streamDetails.leadsFields.length ? this.streamDetails.leadsFields.filter(element => element.isCustom === true) : [];
    this.defaultInputFields = this.streamDetails.leadsFields && this.streamDetails.leadsFields.length ? this.streamDetails.leadsFields.filter(element => element.isCustom === false) : this.defaultInputFields;

    if (!this.streamDetails) {
      this.router.navigate(['/list-streams'])
    }
  }

  getCustomInputFields(customInputFields) {
    this.streamDetails.leadsFields = customInputFields;
    this.dataService.transferData(this.streamDetails)
    localStorage.setItem('StreamDetail', JSON.stringify(this.streamDetails));
    this.router.navigate(['/associate-items']);
  }
  cancelStream(){
    
  }
}
