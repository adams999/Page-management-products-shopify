import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LeadsService {

    leadsForm: any = {};

    constructor(private http: HttpClient) {
    }

    listLeadsForm(filterKeys: any, formType: any) {
        let url = `web/leadsForm/${formType}`
        return this.http.get(url, { params: filterKeys });
    }

    totalLeads(formType: any) {
        let url = `web/leadsForm/leads-count/${formType}`
        return this.http.get(url);
    }

    listTemplateLeadsForm(filterKeys: any) {
        let url = `web/leadsForm/template`
        return this.http.get(url, { params: filterKeys });
    }

    totalTemplateLeads() {
        let url = `web/leadsForm/leads-count/template`
        return this.http.get(url);
    }

    createLeadsForm(leadsForm) {
        let url = `web/leadsForm/create-leads-form`
        return this.http.post(url, leadsForm);
    }

    getSingleLead(leadId) {
        let url = `web/leadsForm/lead-form/${leadId}`
        return this.http.get(url);
    }
    editLeadsForm(data) {
        let url = `web/leadsForm/edit-lead-form/${data.leadsForm._id}`
        delete data.leadsForm._id;
        return this.http.put(url, data);
    }
    createTemplateForm(leadsForm) {
        leadsForm.type = 'template';
        let url = `web/leadsForm/create-template-form`
        return this.http.post(url, leadsForm);
    }
}