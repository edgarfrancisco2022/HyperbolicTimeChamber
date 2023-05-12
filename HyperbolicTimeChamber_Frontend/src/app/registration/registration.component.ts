import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public accountCreated: boolean = false;

  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(user: User, registrationForm: NgForm): void {

    this.authenticationService.register(user).subscribe(
      (response: User) => {
        registrationForm.resetForm();
        this.accountCreated = true;
        console.log('User registration successful');
      },
      (errorResponse: HttpErrorResponse) => {
        console.log(errorResponse);
      }
    );
  }

}
