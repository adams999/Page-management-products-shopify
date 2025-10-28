import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListLeadsFormsComponent } from './list-leads-forms/list-leads-forms.component';
import { FormsModule } from '@angular/forms';
import { CreateLeadFormComponent } from './create-lead-form/create-lead-form.component';
import { RouterModule } from '@angular/router';
import { EditLeadFormComponent } from './edit-lead-form/edit-lead-form.component';
import { ChooseModeComponent } from './choose-mode/choose-mode.component';
import { ChooseTemplateComponent } from './choose-template/choose-template.component';
import { ListTemplatesComponent } from './list-templates/list-templates.component';

@NgModule({
  declarations: [ListLeadsFormsComponent, CreateLeadFormComponent, EditLeadFormComponent, ChooseModeComponent, ChooseTemplateComponent, ListTemplatesComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    RouterModule
  ]
})
export class LeadsModule { }
