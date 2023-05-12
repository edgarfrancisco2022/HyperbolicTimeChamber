import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class OtherEventsService implements OnInit {

  private projectDeletedEvent$ = new BehaviorSubject(false);
  private userLogoutEvent$ = new BehaviorSubject(false);

  constructor() { }

  ngOnInit(): void {}

  onProjectDeletedEvent(projectDeletedEvent: boolean): void {
    this.projectDeletedEvent$.next(projectDeletedEvent);
  }

  getDbProjectsUpdatedObservable(): BehaviorSubject<boolean> {
    return this.projectDeletedEvent$;
  }

  onUserLogoutEvent(userLogoutEvent: boolean): void {
    this.userLogoutEvent$.next(userLogoutEvent);
  }

  getUserLogoutEventObservable(): BehaviorSubject<boolean> {
    return this.userLogoutEvent$;
  }

}
