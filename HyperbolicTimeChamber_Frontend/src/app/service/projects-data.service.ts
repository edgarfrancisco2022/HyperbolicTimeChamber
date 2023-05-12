import { Injectable } from '@angular/core';
import { Project } from '../model/Project';
import { ProjectsService } from './projects.service';
import { User } from '../model/User';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectsDataService {

  dbProjects: Project[] = [];
  private dbProjectsUpdated$ = new BehaviorSubject(false);
  private checkProjectExpanded: boolean = false;
  private projectsExpandedState: boolean[] = [];
  private handleProjectDeletion = false;
  private handleNewSession = false;

  constructor(private projectsService: ProjectsService,
              private authenticationService: AuthenticationService) { }

  getAllProjects(user: User) {
    this.projectsService.getAllProjects(user).subscribe(
      (projects: Project[]) => {
        if (this.authenticationService.isUserLoggedIn() && this.dbProjects.length === 1) {
          // first check if it is an update
          if (this.checkProjectExpanded) {
            // update the state of the project [expanded or not]
            // case project deletion - set hideSession to last state;
            if (this.handleProjectDeletion) {
              for (let i = 0; i < projects.length; i++) {
                projects[i].hideSession = this.projectsExpandedState[i + 1];
                this.dbProjects.push(projects[i]);
              }
              this.handleProjectDeletion = false;

            // case creation or deletion of session - set hideSession to last state;
            } else if (this.handleNewSession) {
              for (let i = 0; i < projects.length; i++) {
                projects[i].hideSession = this.projectsExpandedState[i + 1];
                this.dbProjects.push(projects[i]);
              }
              this.handleNewSession = false;

            // case new project - set new project's hideSession to true
            } else {
              console.log("inside case new project");
              for (let i = 0; i < projects.length; i++) {
                if (i === projects.length - 1) {
                  projects[i].hideSession = true;
                  this.dbProjects.push(projects[i]);
                } else {
                  projects[i].hideSession = this.projectsExpandedState[i + 1];
                  this.dbProjects.push(projects[i]);
                }
              }
            }

            this.checkProjectExpanded = false;
          // else case is triggered when logging in;
          } else {
            projects.forEach(p => {
              p.hideSession = true;
              this.dbProjects.push(p)
            });
          }
        }
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      },
      () => {
        this.onDbProjectsUpdated(true);
      }
    );
  }

  onSessionAddedOrDeleted() {
    this.handleNewSession = true;
  }

  deleteProjectFromProjectsArray(index: number) {
    this.handleProjectDeletion = true;
    this.dbProjects.splice(index, 1);
  }

  updateProjectsArray() {
    console.log("update projects array");
    this.checkProjectExpanded = true;
    this.projectsExpandedState = [];
    this.dbProjects.forEach(p => this.projectsExpandedState.push(p.hideSession));
    // delete to update
    this.dbProjects.splice(1);
    this.getAllProjects(this.authenticationService.getUserFromLocalStorage());
  }

  onUserLogout() {
    this.dbProjects.splice(1);
    this.onDbProjectsUpdated(true);
  }

  addDemoProject(project: Project) {
    this.dbProjects.push(project);
  }

  updateDemoProject(project: Project) {
    console.log(project.hideSession);
    this.dbProjects[0] = project;
    // this should show the updated Demo Project as well
    // the name of the method should be updated
    this.onDbProjectsUpdated(true);

  }

  getDbProjects(): Project[] {
    return this.dbProjects;
  }

  onDbProjectsUpdated(dbProjectsUpdated: boolean): void {
    this.dbProjectsUpdated$.next(dbProjectsUpdated);
  }

  getDbProjectsUpdated(): BehaviorSubject<boolean> {
    return this.dbProjectsUpdated$;
  }
}
