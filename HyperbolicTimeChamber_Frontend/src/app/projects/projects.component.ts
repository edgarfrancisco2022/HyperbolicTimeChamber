import { formatNumber } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Project } from '../model/Project';
import { Session } from '../model/Session';
import { DemoProjectService } from '../service/demo-project.service';
import { ProjectsService } from '../service/projects.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AuthenticationService } from '../service/authentication.service';
import { ProjectsDataService } from '../service/projects-data.service';
import { BehaviorSubject, skip } from 'rxjs';
import { SessionService } from '../service/session.service';
import { OtherEventsService } from '../service/other-events.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  dbProjectsUpdated$: BehaviorSubject<any>;
  userLogoutEvent$: BehaviorSubject<boolean>;
  allProjects: Project[] = [];
  isUserLoggedIn: boolean;

  constructor(private demoProjectService: DemoProjectService,
              private authenticationService: AuthenticationService,
              private projectService: ProjectsService,
              private projectsDataService: ProjectsDataService,
              private sessionService: SessionService,
              private changeDetection: ChangeDetectorRef,
              private otherEventsService: OtherEventsService) { }

  ngOnInit(): void {
    this.isUserLoggedIn = this.authenticationService.isUserLoggedIn();
    this.userLogoutEvent$ = this.otherEventsService.getUserLogoutEventObservable();
    this.userLogoutEvent$.subscribe(
      (userLogoutEvent) => {
        if (userLogoutEvent) {
          this.isUserLoggedIn = false;
          this.changeDetection.markForCheck();
          this.otherEventsService.onUserLogoutEvent(false);
        }
      }
    );


    this.dbProjectsUpdated$ = this.projectsDataService.getDbProjectsUpdated();

    this.dbProjectsUpdated$.subscribe(
      (dbProjectUpdated) => {
        if (dbProjectUpdated) {
          this.changeDetection.markForCheck();
          this.projectsDataService.onDbProjectsUpdated(false);
        }
      }
    );

    if (this.authenticationService.isUserLoggedIn() && this.projectsDataService.dbProjects.length === 1) {
      this.projectsDataService.getAllProjects(this.authenticationService.
        getUserFromLocalStorage());
    }

    this.allProjects = this.projectsDataService.getDbProjects();
  }



  /* Formatting Project total time and session total time */
  formatTime(timeElapsed: number): string {
    let seconds = Math.floor(timeElapsed / 1000);

    // Calculate hours, minutes, and remaining seconds
    let hours = Math.floor(seconds / 3600);
    //use % to substract the hours
    let minutes = Math.floor((seconds % 3600) / 60);
    //use % to substract the minutes
    seconds = seconds % 60;

    // Format the time string
    let timeString = '';
    if (hours < 10) {
      timeString += '0';
    }
    timeString += hours.toString() + ':';// + 'h:';
    if (minutes < 10) {
      timeString += '0';
    }
    timeString += minutes.toString() + ':';// + 'm:';
    if (seconds < 10) {
      timeString += '0';
    }
    timeString += seconds.toString();// + 's';

    return timeString;
  }

  formatTotalTime(totalTime: number): string {
    return this.formatTime(totalTime);
  }

  formatTotalSessionTime(session: Session): string {
    const timeElapsed = session.totalTime;
    return this.formatTime(timeElapsed);
  }

  /* Formatting session Date and Time */

  getSessionStartDateDate(session: Session) {
    let formatDate = new Date(session.startTime).toLocaleDateString();
    return formatDate;
  }

  getSessionStartDateTime(session: Session) {
    let formatTime = new Date(session.startTime).toLocaleTimeString();
    return formatTime;
  }

  getSessionEndDateDate(session: Session) {
    let formatDate = new Date(session.endTime).toLocaleDateString();
    return formatDate;
  }

  getSessionEndDateTime(session: Session) {
    let formatTime = new Date(session.endTime).toLocaleTimeString();
    return formatTime;
  }

  generateSessionQualityIterable(sessionQuality: number): number[] {
    return new Array(sessionQuality);
  }

  generateSessionQualityIterableNoFill(sessionQuality: number): number[] {
    return new Array(5 - sessionQuality);
  }

  onCreateProjectClicked() {
    if (!this.isUserLoggedIn) {
      alert("Please log in to create a new project");
    }
  }

  onProjectExpandButtonClicked(project: Project) {
    console.log('expand button clicked');
    project.hideSession = project.hideSession === false ? true : false;
    // update demo project hidesession variable
    if (project.name === 'Demo Project') {
      this.demoProjectService.demoProject.hideSession = project.hideSession;
      localStorage.setItem("demoProject", JSON.stringify(this.demoProjectService.demoProject));
      this.projectsDataService.updateDemoProject(JSON.parse(localStorage.getItem("demoProject")));
    }
  }

  onSubmitNewProject(form: NgForm) {
    if (form.value.projectName === '' || form.value.projectName === 'Demo Project') {
      return;
    }
    // toggle 'Create project' element
    const element = document.getElementById('createNewProjectToggle');
    element.click();

    // create new Project with current User
    const newProject = new Project();
    newProject.name = form.value.projectName;
    newProject.projectUser = this.authenticationService.getUserFromLocalStorage();

    // make request to backend
    this.createNewProject(newProject);
    form.resetForm();
  }

  createNewProject(newProject: Project) {
    this.projectService.createNewProject(newProject).subscribe(
      (response: Project) => {
          console.log(response);
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      },
      () => {
        this.projectsDataService.updateProjectsArray();
      }
    );
  }

  hideSession(project) {
    return project.hideSession;
  }

  onDeleteSessionButtonClicked(project: Project, session: Session, index: number): void {

    const confirmation = confirm("Delete session?")
    if (confirmation) {
      if (project.name === 'Demo Project') {
        this.demoProjectService.deleteSessionFromDemoProject(index);
        //this.projectsDataService.onSessionAddedOrDeleted();
        // this.projectsDataService.onDbProjectsUpdated(true);

      } else {
        const projectClone = new Project()
        projectClone.id = project.id;
        const sessionClone = this.cloneSession(session);
        sessionClone.project = projectClone;

        this.sessionService.deleteSession(sessionClone).subscribe(
          (response: string) => {
            console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        },
        () => {
          this.projectsDataService.onSessionAddedOrDeleted();
          this.projectsDataService.updateProjectsArray();
        }
        );
      }
    }
  }

  onDeleteProjectBtnClicked(project: Project, index: number): void {
    project.projectUser = this.authenticationService.getUserFromLocalStorage();

    const confirmation = confirm("Delete project? All sessions belonging to this project will be lost.");
    if (confirmation) {
      this.projectService.deleteProject(project).subscribe(
        (response: string) => {
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        },
        () => {
          console.log("sending delete project event");
          this.otherEventsService.onProjectDeletedEvent(true);
          this.projectsDataService.deleteProjectFromProjectsArray(index);
          this.projectsDataService.updateProjectsArray();
        }
      );
    }
  }

  private cloneSession(session: Session): Session {
    const sessionClone = new Session(
      session.description, session.sessionQuality, session.totalTime, session.startTime,
      session.endTime, session.sessionUser
    );
    sessionClone.id = session.id;
    return sessionClone;
  }
}

