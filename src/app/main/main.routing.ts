import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GaurdService } from 'src/app/common/services/gaurd.service';
import { UserResolver } from 'src/app/common/resolves/user.resolve';

import { MainComponent } from 'src/app/main/main.component';
import { AccountsComponent } from './settings/accounts/accounts.component';
import { ListProductsComponent } from './products/list-products/list-products.component';
import { ListStreamsComponent } from './streams/list-streams/list-streams.component';
import { ProfileSettingsComponent } from './settings/profile-settings/profile-settings.component';
import { ListOrdersComponent } from './orders/list-orders/list-orders.component';
import { AnalyticsOverviewComponent } from './dashboard/analytics-overview/analytics-overview.component';
import { AddStreamComponent } from './streams/add-stream/add-stream.component';
import { AddProductsComponent } from './streams/add-stream/add-products/add-products.component';
import { SelectProductsComponent } from './streams/edit-stream/select-products/select-products.component';
import { SelectVideoComponent } from './streams/edit-stream/select-video/select-video.component';
import { AssociateProductsComponent } from './streams/add-stream/associate-products/associate-products.component';
import { EditStreamComponent } from './streams/edit-stream/edit-stream.component';
import { PublishStreamComponent } from './streams/publish-stream/publish-stream.component';
import { ArchiveStreamsComponent } from './streams/archive-streams/archive-streams.component';
import { ChooseModeComponent } from './leads/choose-mode/choose-mode.component';
// import { CreateLeadFormComponent } from './streams/add-stream/create-lead-form/create-lead-form.component';
import { AssociateItemsComponent } from './streams/add-stream/associate-items/associate-items.component';
import { ListLeadsFormsComponent } from './leads/list-leads-forms/list-leads-forms.component';
import { CreateLeadFormComponent } from './leads/create-lead-form/create-lead-form.component';
import { ChooseLeadFormComponent } from './streams/add-stream/choose-lead-form/choose-lead-form.component';
import { EditLeadFormComponent } from './leads/edit-lead-form/edit-lead-form.component';
import { ChooseTemplateComponent } from './leads/choose-template/choose-template.component';
import { ListTemplatesComponent } from './leads/list-templates/list-templates.component';
import { StadisticsComponent } from './stadistics/stadistics.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [GaurdService],
    resolve: {
      user: UserResolver
    },
    component: MainComponent,
    children: [
      {
        path:'accounts',
        component: AccountsComponent
      },
      {
        path: 'list-streams',
        component: ListStreamsComponent,
      },
      {
        path: 'add-stream',
        component: AddStreamComponent,
      },
      {
        path: 'choose-products',
        component: AddProductsComponent,
      },
      {
        path: 'choose-mode',
        component: ChooseModeComponent,
      },
      {
        path: 'choose-lead-form',
        component: ChooseLeadFormComponent,
      },
      {
        path: 'select-products',
        component: SelectProductsComponent,
      },
      {
        path: 'select-video',
        component: SelectVideoComponent,
      },
      {
        path: 'associate-products',
        component: AssociateProductsComponent,
      },
      {
        path: 'associate-items',
        component: AssociateItemsComponent,
      },
      {
        path: 'edit-stream/:id',
        component: EditStreamComponent,
      },
      {
        path: 'stadistics/:id',
        component: StadisticsComponent,
      },
      {
        path: 'publish-stream',
        component: PublishStreamComponent,
      },
      {
        path: 'archive-streams',
        component: ArchiveStreamsComponent,
      },
      {
        path: 'list-products',
        component: ListProductsComponent,
      },
      {
        path: 'profile-settings',
        component: ProfileSettingsComponent,
      },
      {
        path: 'list-orders',
        component: ListOrdersComponent,
      },
      {
        path: 'analytics-overview',
        component: AnalyticsOverviewComponent,
      },
      {
        path: 'list-leads-forms',
        component: ListLeadsFormsComponent,
      },
      {
        path: 'edit-lead-form/:id',
        component: EditLeadFormComponent,
      },
      {
        path: 'create-lead-form',
        component: CreateLeadFormComponent,
      },
      {
        path: 'choose-template-form',
        component: ChooseTemplateComponent,
      },
      {
        path: 'list-templates',
        component: ListTemplatesComponent,
      },
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})

export class mainRoutesModule {
}
