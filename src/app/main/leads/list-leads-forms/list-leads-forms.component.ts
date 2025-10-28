import { Component, OnInit, Input } from '@angular/core';
import { LeadsService } from 'src/app/common/services/leads.service';
import * as moment from 'moment';
import { HostListener } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-leads-forms',
  templateUrl: './list-leads-forms.component.html',
  styleUrls: ['./list-leads-forms.component.scss']
})
export class ListLeadsFormsComponent implements OnInit {

  constructor(private leadsService: LeadsService, private modalService: NgbModal) { }
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
    isActive: ''
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
  @Input() formType="custom";
  @Input() header="Form";
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

  changeStatus(leadForm: any) {
    if (leadForm) {
      leadForm.isActive = leadForm.isActive ? false : true;
      this.leadsService.editLeadsForm({ leadsForm: leadForm }).subscribe((res: any) => {
        this.leadsForms = [];
        this.filterKeys.offset = 0;
        this.listLeadsForm(this.filterKeys);
      })
    }
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

  switchDisplay(displayStyle: any) {
    this.displayStyle = displayStyle
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
    this.leadsService.listLeadsForm(this.filterKeys,this.formType).subscribe((res: any) => {
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


  filterFunc(current: any, type: any) {
    this.currentFilter = current.toString();
    this.filterKeys.sortBy = type;
    this.filterKeys.offset = 0;
    this.leadsForms = [];
    this.listLeadsForm(this.filterKeys);
  }

  createTemplate(formTemplate) {
    this.leadsService.createTemplateForm({leadsForm: formTemplate}).subscribe((res) => {
      console.log("DONE");
    }, (error) => {

    })
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

