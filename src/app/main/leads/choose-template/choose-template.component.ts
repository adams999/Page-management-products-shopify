import { Component, OnInit } from '@angular/core';
import { LeadsService } from 'src/app/common/services/leads.service';
import * as moment from 'moment';
import { HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from 'src/app/common/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-template',
  templateUrl: './choose-template.component.html',
  styleUrls: ['./choose-template.component.scss']
})
export class ChooseTemplateComponent implements OnInit {


  constructor(private leadsService: LeadsService, private modalService: NgbModal,private dataService: DataService, private router: Router) { }
  buttonTitle = "Create New Stream";
  buttonNavigation = "add-stream";
  currentPage: any = "Active Streams";
  isApiLimitReached: boolean = false;
  leadsForms: any = [];
  errorMessages = {
    noLeadsFound: ""
  }
  now: any = "";
  filterKeys: any = {
    sortBy: 'createdAt',
    limit: 12,
    offset: 0,
    search: '',
    isActive: 'true'
  };
  offset = 12
  limit = 12;
  _timeout: any = null;
  lastScrollTop: any = 0
  totalCount = 0;
  leadsCount = 0;
  displayStyle: any = "grid";
  disableButtons = {
    refreshList: false
  }
  currentFilter: any = "Default";
  modalReference: any = "";
  closeResult: string;
  modalData: any = {
    title: '',
    title2: '',
    description: '',
    formSubmissionDetails: '',
    formSubmissionModal: '',
    fields: []
  }
  notSearchResult: any = false;
  searchResultMessage = "";
  selectedTemplate: any = "";
  formType= 'template';
  ngOnInit() {
    this.listLeadsForm(this.filterKeys);
    this.totalLeads();
  }

  totalLeads() {
    this.leadsService.totalLeads(this.formType).subscribe((res: any) => {
      this.totalCount = res.body.totalLeads;
    },
      (error) => {
        console.log(error);
      })
  }

  listLeadsForm(filterKeys) {
    this.leadsService.listLeadsForm(filterKeys, this.formType).subscribe((res: any) => {
      this.leadsCount = res.body.count;
      res.body.leadsForms.forEach(element => {
        this.leadsForms.push(element)
      });
    },
      (error) => {
        console.log(error);
        this.errorMessages.noLeadsFound = error.error.status.message
      })
  }

  selectTemplateForm(form) {

    if(this.selectedTemplate){
      this.leadsForms.forEach(element => {
        if (element._id === this.selectedTemplate._id) {
          element.isSelected = false;
        }
      });
    }
    
    if (form.isSelected) {
      form.isSelected = false;
    } else {
      form.isSelected = true;
    }
    this.selectedTemplate = form;
  }

  calculateDuration(string: any) {
    var ONE_DAY = 60 * 60 * 24 * 1000; /* ms */
    let duration = moment(string).fromNow(true);
    this.now = moment(string).isSame(moment(), 'day');
    if (this.now) {
      return duration
    }
    else {
      return moment(string).format('L') + " " + moment(string).format('LT');
    }
  }

  @HostListener('scroll', ['$event'])
  onElementScroll($event) {
    this._timeout = setTimeout(() => {
      this._timeout = null;
      var st = document.getElementById("client").scrollTop;
      if (st > this.lastScrollTop) {
        if ((document.getElementById("client").scrollTop + (document.getElementById("client").clientHeight)) >= document.getElementById("grid").offsetHeight && this.leadsCount != this.totalCount) {
          this.filterKeys.offset += this.offset;
          this.listLeadsForm(this.filterKeys);
        }
      } else {
        // console.log("up")       // upscroll code
      }
      this.lastScrollTop = st <= 0 ? 0 : st;
    }, 250);
  }

  refreshList() {
    this.disableButtons.refreshList = true;
    this.filterKeys = {
      search: '',
      limit: 12,
      offset: 0,
      sortBy: 'createdAt'
    };
    this.leadsForms = [];
    this.listLeadsForm(this.filterKeys);
  }

  search(event: any) {
    this.filterKeys.search = event.target.value;
    this.leadsService.listLeadsForm(this.filterKeys, this.formType).subscribe((res: any) => {
      this.leadsForms = res.body.leadsForms;
      if (!this.leadsForms.length) {
        this.notSearchResult = true;
        this.searchResultMessage = "No results found";
      }
      else {
        this.notSearchResult = false;
        this.searchResultMessage = "";
      }
    })
  }

  viewForm(form, content) {
    this.modalData = {
      title: form.name,
      title2: form.displayName,
      fields: form.leadsFields,
      formSubmissionDetails: form.formSubmissionDetails,
      formSubmissionModal: form.formSubmissionModal
    }
    this.open(content);
  }

  createFormFromTemplate(){
    this.dataService.transferData(this.selectedTemplate);
    this.router.navigate(['/create-lead-form']);
  }

  open(content) {
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg', centered: true });
    this.modalReference.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

