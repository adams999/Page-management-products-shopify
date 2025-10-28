import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateFormComponent } from 'src/app/common/components/create-form/create-form.component';
import { LeadsService } from 'src/app/common/services/leads.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/common/services/data.service';

@Component({
  selector: 'app-create-lead-form',
  templateUrl: './create-lead-form.component.html',
  styleUrls: ['./create-lead-form.component.scss']
})
export class CreateLeadFormComponent implements OnInit {

  constructor(private leadsService: LeadsService, private router: Router, private dataService: DataService) { }
  defaultInputFields: any = [
    {
      label: "Email",
      name: "email",
      validation: {
        isRequired: true,
        regex: "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
      },
      isCustom: false,
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      validation: {
        isRequired: true,
        regex: "^[0-9]*$"
      },
      isCustom: false,
    },
    {
      label: "First Name",
      name: "firstName",
      validation: {
        isRequired: true,
      },
      isCustom: false,
    },
    {
      label: "Last Name",
      name: "lastName",
      validation: {
        isRequired: true
      },
      isCustom: false,
    },
  ];
  customInputFields: any = [];
  leadsForm: any = {};
  previousData: any = {};
  errorMessage: any = "";
  isSubmit: any = false;
  templateForm: any = {};
  submissionMethods: any = [{
    label: 'Email',
    id: 'email'
  },
  {
    label: 'End Point',
    id: 'endpoint'
  },
  {
    label: 'Both',
    id: 'both'
  }]
  selectedSubmissionMethod: any = "";

  @ViewChild(CreateFormComponent) createForm: CreateFormComponent;

  ngOnInit() {
    this.dataService.currentData.subscribe(template => this.templateForm = template);
    if (this.templateForm) {
      this.mapTemplate(this.templateForm);
    }
  }
  
  mapTemplate(templateForm) {
    this.leadsForm = templateForm;
    templateForm.leadsFields.forEach((element) => {
      if (element.isCustom) {
        this.customInputFields.push(element);
      }
      else if (this.defaultInputFields.findIndex(el => el.label === element.label) > -1) {
        this.defaultInputFields[this.defaultInputFields.findIndex(el => el.label === element.label)] = element;
      }
      element.isSelected = true;
    });
    if (!templateForm.formSubmissionDetails.email) {
      this.selectedSubmissionMethod = 'endpoint';
    } if (!templateForm.formSubmissionDetails.endPoint) {
      this.selectedSubmissionMethod = 'email';
    }
    if (templateForm.formSubmissionDetails.email && templateForm.formSubmissionDetails.endPoint) {
      this.selectedSubmissionMethod = 'both';
    }
  }
  createLeadsForm(data) {
    if (data.error || !data.isCreate) return this.errorMessage = data.error;
    this.leadsForm = data.formDetails;
    this.isSubmit = true;

    if (this.leadsForm._id) {
      delete this.leadsForm._id;
      delete this.leadsForm.createdAt;
      delete this.leadsForm.updatedAt;
    };

    this.leadsService.createLeadsForm({ leadsForm: this.leadsForm }).subscribe((res: any) => {
    this.dataService.transferData("");
      this.router.navigate(['/list-leads-forms']);
    },
      (error) => {
        this.isSubmit = false;
        console.log(error);
      })
  }

  cancelFormCreation() {
    this.router.navigate(['/list-leads-forms']);
  }
}
