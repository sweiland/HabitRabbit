/*
 * app.module.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {RegisterComponent} from './register/register.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {ScoreListComponent} from './score-list/score-list.component';
import {FaqComponent} from './mat-faq/mat-faq.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HabitFormComponent} from './habit-form/habit-form.component';
import {ProfileFormComponent} from './profile-form/profile-form.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {UserListComponent} from './user-list/user-list.component';
import {HabitListComponent} from './habit-list/habit-list.component';
import {TypeListComponent} from './type-list/type-list.component';
import {TypeFormComponent} from './type-form/type-form.component';
import {MessageListComponent} from './message-list/message-list.component';
import {MessageFormComponent} from './message-form/message-form.component';
import {ProfilePictureListComponent} from './profile-picture-list/profile-picture-list.component';
import {ProfilePictureFormComponent} from './profile-picture-form/profile-picture-form.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatCheckboxModule, MatMenuModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatQuillModule} from '@webacad/ng-mat-quill';
import {QuillModule} from '@webacad/ng-quill';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoutComponent,
    RegisterComponent,
    ProfilePageComponent,
    ScoreListComponent,
    FaqComponent,
    NavbarComponent,
    HabitFormComponent,
    ProfileFormComponent,
    DashboardComponent,
    UserListComponent,
    HabitListComponent,
    TypeListComponent,
    TypeFormComponent,
    MessageListComponent,
    MessageFormComponent,
    ProfilePictureListComponent,
    ProfilePictureFormComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatMenuModule,
    RouterModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    QuillModule,
    MatQuillModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
