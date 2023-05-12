import { Component, OnInit } from '@angular/core';
import { TriggerSaveSessionModalService } from '../service/trigger-save-session-modal.service';
import { OtherEventsService } from '../service/other-events.service';
import { BehaviorSubject, Subscription, skip } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { ProjectsDataService } from '../service/projects-data.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  // isUserLoggedIn$: Subscription;
  isUserLoggedIn = this.authenticationService.isUserLoggedIn();

  constructor(private otherEventsService: OtherEventsService,
              private authenticationService: AuthenticationService,
              private projectsDataService: ProjectsDataService,
              private router: Router) { }

  ngOnInit(): void {}

  onMouseEnterNavBtn() {
    const svgSettingsIcon: HTMLElement =
            document.querySelector('.material-symbols-outlined-settings');
    const svgLoginIcon: HTMLElement =
            document.querySelector('.material-symbols-outlined-login');

    svgSettingsIcon.style.color = "var(--primary-color-dark)";
    svgLoginIcon.style.color = "var(--primary-color-dark)";
  }

  onLoginLogoutBtnClicked() {
    if(this.isUserLoggedIn === false) {
      this.router.navigateByUrl('/login');
      return;
    }

    this.authenticationService.logout();
    this.otherEventsService.onUserLogoutEvent(true);
    this.projectsDataService.dbProjects.splice(1);
    this.isUserLoggedIn = false;
    this.projectsDataService.onUserLogout();
  }

}
