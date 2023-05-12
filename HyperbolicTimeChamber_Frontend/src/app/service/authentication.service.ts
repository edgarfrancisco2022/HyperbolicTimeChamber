import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../model/User';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProjectsDataService } from './projects-data.service';
import { DemoProjectService } from './demo-project.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  //local host
  //host: string = 'http://localhost:8080';
  //AWS address
  host: string = 'http://44.201.211.71:5000';
  private token: string;
  private loggedInUsername: string;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/HyperbolicTimeChamber/user/register`, user);
  }

  login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${this.host}/HyperbolicTimeChamber/user/login`, user, {observe: 'response'});
    //The observe option specifies how much of the response to return
    //options are 'body' | 'events' | 'response'
  }

  logout(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  addUserToLocalStorage(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalStorage(): User {
    return JSON.parse(localStorage.getItem('user'));
  }

  loadToken(): void {
    this.token = localStorage.getItem('token');
  }

  getToken(): string {
    return this.token;
  }

  // uses external library // npm i @auth0/angular-jwt
  // see 'npmjs.com/package/@auth0/angular-jwt' for documentation
  public isUserLoggedIn(): boolean {

    this.loadToken();

    if (this.token != null && this.token !== ''){
      if (this.jwtHelper.decodeToken(this.token).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelper.decodeToken(this.token).sub;
          return true;
        }
      }
    } else {
      this.logout();
      return false;
    }

    return false;
  }
}
