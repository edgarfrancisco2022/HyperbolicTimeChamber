import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { ChronometerComponent } from './chronometer/chronometer.component';
import { ProjectsComponent } from './projects/projects.component';
import { DemoProjectService } from './service/demo-project.service';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './service/auth.guard';
import { AuthenticationService } from './service/authentication.service';
import { ProjectsService } from './service/projects.service';
import { AuthInterceptor } from './service/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainNavComponent,
    ChronometerComponent,
    ProjectsComponent,
    RegistrationComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    AuthGuard, AuthenticationService, ProjectsService, DemoProjectService,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
