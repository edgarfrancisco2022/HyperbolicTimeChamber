import { HttpClient, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Project } from '../model/Project';
import { User } from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  // host: string = 'http://localhost:8080';
  host: string = 'http://44.201.211.71:5000';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  getAllProjects(user: User): Observable<any> {
    return this.http.post<any>(`${this.host}/HyperbolicTimeChamber/project/get`, user);
  }

  createNewProject(newProject: Project): Observable<Project> {
    return this.http.post<Project>(`${this.host}/HyperbolicTimeChamber/project/new`, newProject);
  }

  deleteProject(project: Project): Observable<any> {
    return this.http.post<any>(`${this.host}/HyperbolicTimeChamber/project/delete`, project);
  }

  // updateBook(book: Book): Observable<Book> {
  //   return this.http.post<Book>(`${this.host}/book/update`, book);
  // }

  // deleteBook(callNumber: string): Observable<CustomHttpResponse> {
  //   return this.http.delete<CustomHttpResponse>(`${this.host}/book/delete/${callNumber}`)
  // }
}
