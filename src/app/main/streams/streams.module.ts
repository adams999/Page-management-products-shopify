import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { StreamsComponent } from "./streams.component";
import { AddStreamComponent } from "./add-stream/add-stream.component";
import { EditStreamComponent } from "./edit-stream/edit-stream.component";
import { ListStreamsComponent } from "./list-streams/list-streams.component";
import { AddProductsComponent } from "./add-stream/add-products/add-products.component";
import { AssociateProductsComponent } from "./add-stream/associate-products/associate-products.component";
import { PublishStreamComponent } from "./publish-stream/publish-stream.component";
import { CreateStreamHeaderComponent } from "./add-stream/create-stream-header/create-stream-header.component";
import { StreamBreadCrumbComponent } from "./add-stream/stream-bread-crumb/stream-bread-crumb.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ArchiveStreamsComponent } from "./archive-streams/archive-streams.component";
import { SelectProductsComponent } from "./edit-stream/select-products/select-products.component";
import { SelectVideoComponent } from "./edit-stream/select-video/select-video.component";
import { MainStreamButtonComponent } from "./main-stream-button/main-stream-button.component";

import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared.module";
import { ChooseModeComponent } from "./add-stream/choose-mode/choose-mode.component";
import { CreateLeadFormComponent } from "./add-stream/create-lead-form/create-lead-form.component";
import { AssociateFormComponent } from "./add-stream/associate-form/associate-form.component";
import { AssociateItemsComponent } from "./add-stream/associate-items/associate-items.component";
import { ChooseLeadFormComponent } from "./add-stream/choose-lead-form/choose-lead-form.component";
import { SelectFormsComponent } from "./edit-stream/select-forms/select-forms.component";


@NgModule({
  declarations: [
    StreamsComponent,
    AddStreamComponent,
    EditStreamComponent,
    ListStreamsComponent,
    PublishStreamComponent,
    AddProductsComponent,
    CreateStreamHeaderComponent,
    StreamBreadCrumbComponent,
    AssociateProductsComponent,
    ArchiveStreamsComponent,
    SelectProductsComponent,
    SelectVideoComponent,
    MainStreamButtonComponent,
    ChooseModeComponent,
    CreateLeadFormComponent,
    AssociateFormComponent,
    AssociateItemsComponent,
    ChooseLeadFormComponent,
    SelectFormsComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
  ],
  // schemas: [ NO_ERRORS_SCHEMA ]
})
export class StreamsModule {}
