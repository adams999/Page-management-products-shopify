import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { CommonModule } from "@angular/common";
import { StyleGuideComponent } from "./style-guide/style-guide.component";
import { NgbModule, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthenticationModule } from "./authentication/authentication.module";

import { CookieService } from "ngx-cookie-service";
import { HttpClientModule } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "./common/http-interceptor/http.interceptor";

import { AccountService } from "./common/services/account.service";
import { UserService } from "./common/services/user.service";
import { StreamService } from "./common/services/stream.service";
import { ProductService } from "./common/services/products.service";
import { VideosService } from "./common/services/videos.service";
import { DataService } from "./common/services/data.service";
import { StoreService } from "./common/services/store.service";
import { OrderService } from "./common/services/order.service";
import { ResponseManagerService } from "./common/services/response-manager.service";
import { GaurdService } from "./common/services/gaurd.service";
import { UserResolver } from "./common/resolves/user.resolve";
import { ChartsService } from "./common/services/charts.service";
import { PlanService } from "./common/services/plan.service";
import { ContactService } from "./common/services/contact-us.service";
import { SharedModule } from "./shared/shared.module";
import { IntercomModule } from "ng-intercom";
import { GoogleAnalyticsService } from "./common//services/google-analytics.service";
import { AWSService } from "./common//services/s3.service";
import { NgxPrintModule } from "ngx-print";
import { MainModule } from "./main/main.module";
import { LeadsService } from "./common/services/leads.service";
import { SplitIoService } from "./common/services/splitio.service";
import { StadisticsService } from "./common/services/stadistics.service";

@NgModule({
  declarations: [AppComponent, StyleGuideComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    AuthenticationModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    MainModule,
    NgbModule,
    NgxPrintModule,
    IntercomModule.forRoot({
      appId: "ilolk8gr", // from your Intercom config
      updateOnRouterChange: true, // will automatically run `update` on router event changes. Default: `false`
    }),
  ],
  providers: [
    CookieService,
    GaurdService,
    UserResolver,
    AccountService,
    UserService,
    StreamService,
    ProductService,
    VideosService,
    DataService,
    StoreService,
    OrderService,
    ChartsService,
    ResponseManagerService,
    ContactService,
    PlanService,
    GoogleAnalyticsService,
    AWSService,
    LeadsService,
    NgbActiveModal,
    StadisticsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    SplitIoService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
