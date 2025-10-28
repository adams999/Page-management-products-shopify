import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from 'src/app/common/services/leads.service';
import { CreateFormComponent } from 'src/app/common/components/create-form/create-form.component';

@Component({
  selector: 'app-edit-lead-form',
  templateUrl: './edit-lead-form.component.html',
  styleUrls: ['./edit-lead-form.component.scss']
})
export class EditLeadFormComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private leadsService: LeadsService) { }
  sub: any = "";
  leadId = "";
  leadForm: any = {};
  defaultInputFields: any = [{
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
  }];

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
  customInputFields: any = [];
  selectedSubmissionMethod: any = "";
  isSubmit: Boolean; true;
  errorMessage: any = "";
  @ViewChild(CreateFormComponent) createForm: CreateFormComponent;

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.leadId = params['id'];
    });
    this.getSingleLeadForm(this.leadId);
  }

  getSingleLeadForm(leadId) {
    this.leadsService.getSingleLead(leadId).subscribe((res: any) => {
      this.leadForm = res.body.leadForm;
      this.leadForm.leadsFields.forEach((element) => {
        if (element.isCustom) {
          this.customInputFields.push(element);
        }
        else if (this.defaultInputFields.findIndex(el => el.label === element.label) > -1) {
          this.defaultInputFields[this.defaultInputFields.findIndex(el => el.label === element.label)] = element;
        }
        element.isSelected = true;
      });
      if (!this.leadForm.formSubmissionDetails.email) {
        this.selectedSubmissionMethod = 'endpoint';
      } if (!this.leadForm.formSubmissionDetails.endPoint) {
        this.selectedSubmissionMethod = 'email';
      }
      if (this.leadForm.formSubmissionDetails.email && this.leadForm.formSubmissionDetails.endPoint) {
        this.selectedSubmissionMethod = 'both';
      }
      console.log(this.selectedSubmissionMethod);

    },
      error => {

      })
  }

  editLeadsForm(data) {
    if (data.error || !data.isCreate) return this.errorMessage = data.error;
    this.leadForm = data.formDetails;
    this.isSubmit = true;
    console.log(this.leadForm);

    this.leadsService.editLeadsForm({ leadsForm: this.leadForm }).subscribe((res: any) => {
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
