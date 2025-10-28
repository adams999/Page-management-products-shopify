import { SplitIoService } from './../common/services/splitio.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from "./../common/services/user.service";
import { GoogleAnalyticsService } from "./../common/services/google-analytics.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  userData: any;
  userImg: any;
  user: any = {

  }
  dropDown: any = ""
  constructor(
    private userService: UserService,
    private router: Router,
    public googleAnalyticsService: GoogleAnalyticsService,
    public splitIoService: SplitIoService
    ) { }
  public isCollapsed = false;
  ngOnInit(): void {
    this.userService.newUser.subscribe((user: any) => {
      this.user = user;
      this.dropDown = this.user.firstName + " " + this.user.lastName
      if(this.dropDown.length > 15){
          this.dropDown = this.dropDown.substring(0, 15) + "..."
      }
    });
   this.splitIoService.initSdk();
  }

  openNav() {
    this.isCollapsed = !this.isCollapsed;
    if (!this.isCollapsed) {
      document.getElementById("mySidenav").style.display = "none";
    }
    else {
      document.getElementById("mySidenav").style.display = "block";

    }
  }

  customNavigate(navigateLink) {
    this.router.navigate(['/' + navigateLink + '']);
    this.googleAnalyticsService.eventEmitter("Navigations", "side-nav-navigation", navigateLink, 1);
  }

  logOut() {
    this.googleAnalyticsService.eventEmitter("Navigations", "sign-out", 'Side Nav', 1)
    this.userService.logout();
  }

  selectedOption(value) {
    console.log(value)
    if (value == "settings") {
    this.router.navigate(['profile-settings'])
    } else if (value == "signout") {
      this.logOut()
    } else {
      return;
    }
  }
}
