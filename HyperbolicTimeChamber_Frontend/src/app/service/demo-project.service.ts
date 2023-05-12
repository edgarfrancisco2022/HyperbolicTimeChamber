import { Injectable } from '@angular/core';
import { Project } from '../model/Project';
import { ProjectsDataService } from './projects-data.service';

@Injectable({
  providedIn: 'root'
})
export class DemoProjectService {

  demoProject: Project;

  constructor(private projectsDataService: ProjectsDataService) {
    this.initProjects();
  }

  initProjects() {
    if (localStorage.getItem("demoProject") === null) {
      const demoProject: Project = new Project();
      demoProject.id = 1;
      demoProject.name = "Demo Project";
      demoProject.hideSession = true;
      demoProject.totalTime = 0;
      localStorage.setItem("demoProject", JSON.stringify(demoProject));
      this.demoProject = JSON.parse(localStorage.getItem("demoProject"));
      this.projectsDataService.addDemoProject(this.demoProject);
   
    } else {
      this.demoProject = JSON.parse(localStorage.getItem("demoProject"));
      this.projectsDataService.addDemoProject(this.demoProject);
    }
  }

  deleteSessionFromDemoProject(index: number) {
    // this.demoProject.totalSessions -= 1;
    this.demoProject.totalTime -= this.demoProject.sessions[index].totalTime;
    this.demoProject.sessions.splice(index, 1);
    localStorage.setItem("demoProject", JSON.stringify(this.demoProject));
    this.projectsDataService.updateDemoProject(JSON.parse(localStorage.getItem("demoProject")));
  }
}
