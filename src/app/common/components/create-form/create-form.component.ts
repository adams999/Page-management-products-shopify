import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.scss']
})
export class CreateFormComponent implements OnInit {

  constructor() { }
  @Input() defaultInputFields: any = [];
  @Output() customInputFieldsEmitter: any = new EventEmitter<any>();
  streamDetails: any = {};
  previousData: any = {};
  @Input() customInputFields: any = [];
  leadsFields: any = [];
  @Input() formDetails = {
    name: "",
    description: "",
    displayName: "",
    formSubmissionDetails: {
      email: '',
      endPoint: ''
    },
    formSubmissionModal: {
      title: '',
      description: ''
    },
    leadsFields: []
  }
  errorMessages = {
    emailPhoneMissing: "Please select at least one item (Email or Phone Number).",
    formNameMissing: "Please enter leads form name.",
    formDisplayNameMissing: "Please enter lead form's display name.",
    formSubmissionDetailsMissing: "Please enter at least one submission method (Email or Endpoint)",
    formSubmissionDetailsEmailMissing: "Please enter submission email",
    formSubmissionDetailsEmailEndpointMissing: "Submission details incomplete",
    formSubmissionDetailsEndPointMissing: "Please enter submission endpoint",
    formSubmissionDetailsEmailInvalid: "Submission email is invalid",
    formSubmissionDetailsEndPointInvalid: "Submission endpoint is invalid",
    formSubmissionModalTitleInvalid: "Please enter submission Modal title",
    formSubmissionModalDescriptionInvalid: "Please enter submission Modal description"

  }
  invalidFields = {
    invalidEmail: false,
    invalidUrl: false,
    invalidFormName: false,
    invalidDisplayFormName: false,
    invalidModalTitle: false,
    invalidModalDescription: false,
  }
  // phoneCountryCode = {
  //   label: "Country Code",
  //   name: "phoneCountryCode",
  //   validation: {
  //     isRequired: true
  //   },
  //   isCustom: false,
  // }
  expressionUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
  expressionEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  urlRegex = new RegExp(this.expressionUrl);
  emailRegex = new RegExp(this.expressionEmail);
  errorHandler: any = [];
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

  @Input() selectedSubmissionMethod: any = '';
  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['formDetails']) {
      this.leadsFields = this.formDetails.leadsFields;
    console.log(this.formDetails, this.leadsFields);

    }
  }

  addField() {
    this.customInputFields.push({
      id: '',
      label: "",
      name: "",
      validation: {
        isRequired: true
      },
      isInvalid: false,
      isCustom: true,
      isSelected: false
    })
  }

  checkError(value, field) {
    if (value) {
      field.name = this.toSmallAndRemoveSpaces(value);
      field.isInvalid = false;
      return;
    }
    field.isInvalid = true;
  }

  submitFields() {
    if (!this.submissionValidation()) return;
    this.formDetails.leadsFields = this.leadsFields;
    this.customInputFieldsEmitter.emit({ formDetails: this.formDetails, error: "", isCreate: true });
  }

  addToLeadsForm(field, id) {
    if (this.leadsFields.indexOf(field) < 0) {
      if (!field.label) return field.isInvalid = true;
      field.isSelected = true;
      this.leadsFields.push(field);
    }
    else if (this.leadsFields.indexOf(field) > -1) {
      this.leadsFields.splice(this.leadsFields.indexOf(field), 1);
      field.isSelected = false;
    }
  }

  // checkDisable(field) {
  //   if (this.toSmallAndRemoveSpaces(field.name) === 'email' || this.toSmallAndRemoveSpaces(field.name) === 'phonenumber') return true; else return false;
  // }

  toSmallAndRemoveSpaces(string) {
    return string.replace(/\s+/g, '').toLowerCase();
  }

  checkPatternValidation(input, regex, invalidField, errorMessage) {
    if (input.value) {
      if (!input.value.match(regex)) {
        this.invalidFields[invalidField] = true;
        return this.customInputFieldsEmitter.emit({ formDetails: {}, error: this.errorMessages[errorMessage], isCreate: false });
      }
    }
    this.invalidFields[invalidField] = false;
    let invalidMessage = this.invalidFields.invalidEmail ? this.errorMessages.formSubmissionDetailsEmailInvalid : this.errorMessages.formSubmissionDetailsEndPointInvalid
    if (this.invalidFields.invalidEmail || this.invalidFields.invalidUrl) {
      this.customInputFieldsEmitter.emit({ formDetails: {}, error: invalidMessage })
      return false;
    }
    else {
      this.customInputFieldsEmitter.emit({ formDetails: {}, error: "", isCreate: false });
    }
  }

  checkRequiredValidation(value, invalidField, errorMessage) {
    if (!value) {
      this.invalidFields[invalidField] = true;
      this.customInputFieldsEmitter.emit({ formDetails: {}, error: this.errorMessages[errorMessage], isCreate: false });
      return false
    }
    this.invalidFields[invalidField] = false;
    this.customInputFieldsEmitter.emit({ formDetails: {}, error: "", isCreate: false });
    return true
  }

  submissionValidation() {

    console.log(this.leadsFields);
    
    if ((this.leadsFields.findIndex(element => element.name === "email") < 0 && this.leadsFields.findIndex(element => element.name === "phoneNumber") < 0)) {
      this.customInputFieldsEmitter.emit({ formDetails: {}, error: this.errorMessages.emailPhoneMissing });
      return false
    }

    if (!this.checkRequiredValidation(this.formDetails.name, 'invalidFormName', 'formNameMissing') || !this.checkRequiredValidation(this.formDetails.displayName, 'invalidDisplayFormName', 'formDisplayNameMissing') || !this.checkRequiredValidation(this.formDetails.formSubmissionModal.title, 'invalidModalTitle', 'formSubmissionModalTitleInvalid') || !this.checkRequiredValidation(this.formDetails.formSubmissionModal.description, 'invalidModalDescription', 'formSubmissionModalDescriptionInvalid')) return false;
    if (this.selectedSubmissionMethod === 'email' && !this.checkRequiredValidation(this.formDetails.formSubmissionDetails.email, '', 'formSubmissionDetailsEmailMissing')) return false;
    if (this.selectedSubmissionMethod === 'endpoint' && (!this.checkRequiredValidation(this.formDetails.formSubmissionDetails.endPoint, '', 'formSubmissionDetailsEndPointMissing'))) return false;
    if ((this.selectedSubmissionMethod === 'both' || this.selectedSubmissionMethod === '') && (!this.checkRequiredValidation(this.formDetails.formSubmissionDetails.email, '', 'formSubmissionDetailsMissing') && (!this.checkRequiredValidation(this.formDetails.formSubmissionDetails.endPoint, '', 'formSubmissionDetailsMissing')))) return false;
    if ((this.selectedSubmissionMethod === 'both' || this.selectedSubmissionMethod === '') && (!this.checkRequiredValidation(this.formDetails.formSubmissionDetails.email, '', 'formSubmissionDetailsEmailEndpointMissing') || !this.checkRequiredValidation(this.formDetails.formSubmissionDetails.endPoint, '', 'formSubmissionDetailsEmailEndpointMissing'))) return false;

    let invalidMessage = this.invalidFields.invalidEmail ? this.errorMessages.formSubmissionDetailsEmailInvalid : this.errorMessages.formSubmissionDetailsEndPointInvalid

    if (this.invalidFields.invalidEmail || this.invalidFields.invalidUrl) {
      this.customInputFieldsEmitter.emit({ formDetails: {}, error: invalidMessage })
      return false;
    }


    return true;
  }

  getSubmissionMethod(event) {
    this.selectedSubmissionMethod = event.target.value;
    if (this.selectedSubmissionMethod !== 'email' || this.selectedSubmissionMethod !== 'both') {
      this.formDetails.formSubmissionDetails.email = '';
      this.invalidFields.invalidEmail = false;
      this.customInputFieldsEmitter.emit({ formDetails: {}, error: '' })
    }
    if (this.selectedSubmissionMethod !== 'endpoint' || this.selectedSubmissionMethod !== 'both') {
      this.formDetails.formSubmissionDetails.endPoint = '';
      this.customInputFieldsEmitter.emit({ formDetails: {}, error: '' })
      this.invalidFields.invalidUrl = false;
    }
  }
}

