import { Component } from '@angular/core'
import { ContactService } from "./../../common/services/contact-us.service";
import {GoogleAnalyticsService} from "./../../common/services/google-analytics.service";
@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.scss']
})

export class ContactComponent {
    contactInfo:any = {
        contactSubject: '',
        contactName: "",
        contactEmail: '',
        contactMessage: '',
        contactInfo: null
    }
    constructor(private contactService: ContactService, public googleAnalyticsService: GoogleAnalyticsService) {
    }

    submit() {
        this.googleAnalyticsService.eventEmitter("Form submissions", "contact-us-form-submission", "Contact Us", 1);
        this.contactService.contactUs(this.contactInfo).then((res) => {
            this.contactInfo = {
                contactSubject : "",
                contactName: "",
                contactEmail: "",
                contactMessage:""
            }
        });
    }

    subjectSelectChange(value) {
        this.contactInfo.contactSubject = value;
    }
}