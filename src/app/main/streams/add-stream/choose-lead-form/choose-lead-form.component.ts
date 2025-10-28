import { Component, OnInit, Input} from '@angular/core';
import { LeadsService } from 'src/app/common/services/leads.service';
import { DataService } from 'src/app/common/services/data.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-choose-lead-form',
  templateUrl: './choose-lead-form.component.html',
  styleUrls: ['./choose-lead-form.component.scss']
})
export class ChooseLeadFormComponent implements OnInit {

  constructor(private leadsService: LeadsService, private dataService: DataService, private router: Router, private modalService: NgbModal) { }
  breadCrumbNumber: any = '2';
  leadsForms: any = [];
  errorMessages = {
    noLeadsFound: "",
    noFormSelected: ""
  }
  streamDetails: any = {};
  previousData: any = {};
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
  notSearchResult: any = false;
  searchResultMessage = "";
  header: any = "Edit Stream";
  formType= 'custom';
  ngOnInit() {
    this.previousData = this.dataService.getItemFromStorage('StreamDetail');
    if (!this.previousData) {
      this.router.navigate(['list-streams']);
    }
    this.streamDetails = this.previousData;
    this.listLeadsForm(this.filterKeys);
    this.totalLeads();
  }

  listLeadsForm(filterKeys) {
    this.leadsService.listLeadsForm(filterKeys, this.formType).subscribe((res: any) => {
      this.leadsCount = res.body.count;
      res.body.leadsForms.forEach(element => {
        this.leadsForms.push(element)
      });
      if (this.streamDetails.leadsForm) {
        this.leadsForms.forEach(element => {
          if (element._id === this.streamDetails.leadsForm._id) {
            element.isSelected = true;
          }
        });
      }
    },
      (error) => {
        console.log(error);
        this.errorMessages.noLeadsFound = error.error.status.message
      })
  }

  totalLeads() {
    this.leadsService.totalLeads(this.formType).subscribe((res: any) => {
      this.totalCount = res.body.totalLeads;
    },
      (error) => {
        console.log(error);
      })
  }

  selectForm(form) {
    if (this.streamDetails.leadsForm) {
      this.streamDetails.leadsForm.isSelected = false;
      this.leadsForms.forEach(element => {
        if (element._id === this.streamDetails.leadsForm._id) {
          element.isSelected = false;
        }
      });
    }
    if (!form.isSelected) {
      form.isSelected = true
      form.timeIn = "";
      form.timeOut = "";
      form.type = "form";
      this.streamDetails.leadsForm = form;
      this.errorMessages.noFormSelected = "";
    }
  }

  associateForm() {
    if (this.streamDetails.leadsForm) {
      this.dataService.setItemInStorage(this.streamDetails, 'StreamDetail');
      if (this.streamDetails._id) {
        this.router.navigate(['/edit-stream', this.streamDetails._id]);
        return;
      }
      this.router.navigate(['/associate-items']);
    }
    else {
      this.errorMessages.noFormSelected = "Please select at least one leads form.";
    }
  }

  goBack(type) {
    if (type === 'cancel') {
      delete this.streamDetails.leadsForm;
    }
    this.dataService.setItemInStorage(this.streamDetails, 'StreamDetail');
    this.router.navigate(['/choose-products']);
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
}
