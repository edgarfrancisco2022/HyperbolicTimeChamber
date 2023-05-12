import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../model/User';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { ProjectsService } from '../service/projects.service';
import { ProjectsDataService } from '../service/projects-data.service';
import { OtherEventsService } from '../service/other-events.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  private JWT_TOKEN_HEADER: string = 'Jwt-Token';
  private subscriptions: Subscription[] = []; //to prevent memory leaks

  private demoAccountUsername: string = "demoaccount";
  //aws demoaccount
  private demoAccountPassword: string = "Svjmhj4vL6";
  //local demoaccount
  // private demoAccountPassword: string = "6R5iriy2mc";

  constructor(private authenticationService: AuthenticationService,
              private projectsDataService: ProjectsDataService,
              private otherEventsService: OtherEventsService,
              private router: Router) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onLogin(user: User): void {

    //push to subscriptions to prevent memory leaks
    this.subscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: HttpResponse<User>) => {
          // 1 get token and add it to local storage
          const token = response.headers.get(this.JWT_TOKEN_HEADER);
          this.authenticationService.saveToken(token);

          // 2 add user to local storage
          this.authenticationService.addUserToLocalStorage(response.body);
          console.log(response);

          // 4 get all projects from the backend
          this.projectsDataService.getAllProjects(this.authenticationService.
                                                    getUserFromLocalStorage());

          // 5 navigate to next component
          this.router.navigateByUrl('/main');
        },
        (errorResponse: HttpErrorResponse) => {
          console.log(errorResponse);
        }
      )
    );
  }

  isDisabled(loginForm: NgForm) {
    return !loginForm.valid;
  }

  demoAccountLogin() {
    if (this.authenticationService.isUserLoggedIn()) {
      this.authenticationService.logout();
    } else {
      let user: User = new User();
      user.username = this.demoAccountUsername;
      user.password = this.demoAccountPassword;

      this.subscriptions.push(
        this.authenticationService.login(user).subscribe(
          (response: HttpResponse<User>) => {
            // 1 get token and add it to local storage
            const token = response.headers.get(this.JWT_TOKEN_HEADER);
            this.authenticationService.saveToken(token);

            // 2 add user to local storage
            this.authenticationService.addUserToLocalStorage(response.body);

            // 3 navigate to next component
            this.router.navigateByUrl('/main');
          },
          (errorResponse: HttpErrorResponse) => {
            console.log(errorResponse);
          }
        )
      );
    }

  }
}
