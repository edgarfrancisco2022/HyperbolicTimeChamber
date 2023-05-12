import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { Session } from '../model/Session';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  // host: string = 'http://localhost:8080';
  host: string = 'http://44.201.211.71:5000';

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }

  addNewSession(newSession: Session): Observable<Session> {
    return this.http.post<Session>(`${this.host}/HyperbolicTimeChamber/session/new`, newSession);
  }

  deleteSession(session: Session): Observable<any> {
    return this.http.post<any>(`${this.host}/HyperbolicTimeChamber/session/delete`, session);
  }
}
