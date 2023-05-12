import { formatNumber } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, EMPTY, skip, Subscription, switchMap, tap } from 'rxjs';
import { Project } from '../model/Project';
import { Session } from '../model/Session';
import { ProjectsComponent } from '../projects/projects.component';
import { DemoProjectService } from '../service/demo-project.service';
import { TriggerSaveSessionModalService } from '../service/trigger-save-session-modal.service';
import { ProjectsDataService } from '../service/projects-data.service';
import { AuthenticationService } from '../service/authentication.service';
import { SessionService } from '../service/session.service';
import { HttpErrorResponse } from '@angular/common/http';
import { OtherEventsService } from '../service/other-events.service';

@Component({
  selector: 'app-chronometer',
  templateUrl: './chronometer.component.html',
  styleUrls: ['./chronometer.component.css']
})
export class ChronometerComponent implements OnInit {

  projects: Project[] = [];

  milliseconds: any = '0' + 0;
  seconds: any = '0' + 0;
  minutes: any = '0' + 0;
  hours: any = '0' + 0;

  totalTime: number;
  currentSessionStartDate: Date;
  currentSessionEndDate: Date;

  private startChronometer: any;
  private running: boolean = false;

  private dbProjectsUpdatedSubject$: BehaviorSubject<boolean>;
  private saveSessionClickedSubject$: BehaviorSubject<boolean>;

  /* project selection variables */
  latestProjectSelected: string;
  private projectDeletedEvent$: BehaviorSubject<boolean>;

  constructor(private demoProjectService: DemoProjectService,
              private triggerSaveSessionModalService: TriggerSaveSessionModalService,
              private authenticationService: AuthenticationService,
              private projectsDataService: ProjectsDataService,
              private sessionService: SessionService,
              private otherEventsService: OtherEventsService) {

    if (window.localStorage.getItem("latestProjectSelected") === null) {
      window.localStorage.setItem("latestProjectSelected", "Demo Project");
      this.latestProjectSelected = window.localStorage.getItem("latestProjectSelected");
    } else {
      this.latestProjectSelected = window.localStorage.getItem("latestProjectSelected");
    }
  }

  ngOnInit(): void {
    this.dbProjectsUpdatedSubject$ = this.projectsDataService.getDbProjectsUpdated();

    this.dbProjectsUpdatedSubject$.subscribe(
      (dbProjectUpdated) => {
        if (dbProjectUpdated) {
          if (this.authenticationService.isUserLoggedIn() === false) {
            window.localStorage.setItem("latestProjectSelected", "Demo Project");
            this.latestProjectSelected = window.localStorage.getItem("latestProjectSelected");
          }
          this.projectsDataService.onDbProjectsUpdated(false);
        }
      }
    );

    this.saveSessionClickedSubject$ = this.triggerSaveSessionModalService.
                                      getSaveSessionClicked();

    this.saveSessionClickedSubject$.subscribe(
      (saveSessionClicked) => {

        if (saveSessionClicked) {
          if (this.hours != 0 || this.minutes != 0 || this.seconds != 0
                              || this.milliseconds != 0) {

              this.saveSession();
            }
        }
        this.hours = this.minutes = this.seconds = this.milliseconds = '0' + 0;
        this.totalTime = 0;
      }
    );

    this.projectDeletedEvent$ = this.otherEventsService.getDbProjectsUpdatedObservable();
    this.projectDeletedEvent$.subscribe(
      (projectDeletedEvent) => {
        if (projectDeletedEvent) {
          window.localStorage.setItem("latestProjectSelected", "Demo Project");
          this.latestProjectSelected = window.localStorage.getItem
                                                      ("latestProjectSelected");
          this.otherEventsService.onProjectDeletedEvent(false);
        }
      }
    )

    this.projects = this.projectsDataService.getDbProjects();
  }

//this version of the start() method stops when clicking on a new tab on the browser
//or when minimizing the browser window
  // start(): void {
  //   if (!this.running) {

  //     this.running = true;
  //     this.currentSessionStartDate = new Date();

  //     this.startChronometer = setInterval(() => {
  //       this.milliseconds++; // '00' -> 1, '01' -> 2, etc

  //       this.milliseconds = this.milliseconds < 10 ?
  //                             '0' + this.milliseconds : this.milliseconds;

  //       if (this.milliseconds === 100) {
  //         this.seconds++;
  //         this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;
  //         this.milliseconds = '0' + 0;
  //       }

  //       if (this.seconds === 60) {
  //         this.minutes++;
  //         this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
  //         this.seconds = '0' + 0;
  //       }

  //       if (this.minutes === 60) {
  //         this.hours++;
  //         this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
  //         this.minutes = '0' + 0;
  //       }

  //     }, 10);
  //   } else {
  //     this.stop();
  //   }
  // }

  start(): void {
    if (!this.running) {

      this.running = true;
      this.currentSessionStartDate = new Date();
      let previousTime = performance.now();

      const animate = (currentTime: number) => {
        const deltaTime = currentTime - previousTime;
        previousTime = currentTime;

        this.totalTime += deltaTime;

        this.milliseconds = formatNumber(this.totalTime % 1000, 'en-US', '2.0-0');
        this.seconds = formatNumber(Math.floor(this.totalTime / 1000) % 60, 'en-US', '2.0-0');
        this.minutes = formatNumber(Math.floor(this.totalTime / 60000) % 60, 'en-US', '2.0-0');
        this.hours = formatNumber(Math.floor(this.totalTime / 3600000), 'en-US', '2.0-0');

        if (this.running) {
            requestAnimationFrame(animate);
        }
      };
      //wrapping the first call with a setTimeout function to fix initial delay problem.
      setTimeout(() => {
        requestAnimationFrame(animate);
      });

    } else {
      this.stop();
    }
  }

  stop(): void {
    // clearInterval(this.startChronometer);
    this.running = false;
  }

  reset(): void {
    // clearInterval(this.startChronometer);
    this.running = false;

    if (this.hours != 0 || this.minutes != 0 || this.seconds != 0
        || this.milliseconds != 0) {

      this.triggerSaveSessionModal();

    } else {
      this.hours = this.minutes = this.seconds = this.milliseconds = '0' + 0;
    }
  }

  private triggerSaveSessionModal() {
    this.triggerSaveSessionModalService.onExitChamberClicked(true);
  }

  private saveSession(): void {
    this.currentSessionEndDate = new Date();

    if (this.latestProjectSelected === "Demo Project") {
      this.addSessionToDemoProject();
    } else {
      this.saveSessionToDataBase();
    }

  }

  private addSessionToDemoProject(): void {
    // this.getTotalTime();

    /* Create session object */
    let session: Session = new Session(
      this.triggerSaveSessionModalService.getCurrentSessionDescription(),
      this.triggerSaveSessionModalService.getcurrentSessionQualityRating(),
      this.totalTime, this.currentSessionStartDate, this.currentSessionEndDate,
      this.authenticationService.getUserFromLocalStorage());

    this.demoProjectService.demoProject.sessions.push(session);
    this.demoProjectService.demoProject.totalTime += this.totalTime;
    console.log(this.demoProjectService.demoProject.hideSession);
    localStorage.setItem("demoProject", JSON.stringify(this.demoProjectService.demoProject));

    this.projectsDataService.updateDemoProject(JSON.parse(localStorage.getItem("demoProject")));
  }

  private saveSessionToDataBase(): void {
    // this.getTotalTime();

    /* Create session object */
    let session: Session = new Session(
      this.triggerSaveSessionModalService.getCurrentSessionDescription(),
      this.triggerSaveSessionModalService.getcurrentSessionQualityRating(),
      this.totalTime, this.currentSessionStartDate, this.currentSessionEndDate,
      this.authenticationService.getUserFromLocalStorage());

    /* Get selected project with project name */
    let sessionProject: Project;
    this.projects.forEach(p => {
      if (p.name === this.latestProjectSelected) {
        sessionProject = p;
        return;
      }
    });

    /* persist object to database */
    session.project = sessionProject;

    this.sessionService.addNewSession(session).subscribe(
      (response: Session) => {
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

  onSelectProject(project: string) {
    window.localStorage.setItem("latestProjectSelected", project);
    this.latestProjectSelected = window.localStorage.getItem("latestProjectSelected");
  }

  private getTotalTime(): void {
    const mils = parseInt(this.milliseconds, 10);
    const secs = parseInt(this.seconds, 10);
    const mins = parseInt(this.minutes, 10);
    const hours = parseInt(this.hours, 10);
    this.totalTime = (mils) + (secs * 1000) +
                     (mins * 60 * 1000) +
                     (hours * 60 * 60 * 1000);
  }
}




