/** ****************************************************************************
 * app.module2.ts Copyright ©️ 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 ******************************************************************************/

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  DashboardComponent,
  DashboardHabitEditComponent,
  PasswordChangeComponentDash,
  UserDataChangeComponent
} from './dashboard/dashboard.component';
import {FaqComponent} from './faq/faq.component';
import {HabitFormComponent} from './habit-form/habit-form.component';
import {HabitListComponent} from './habit-list/habit-list.component';
import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';
import {MessageFormComponent} from './message-form/message-form.component';
import {MessageListComponent} from './message-list/message-list.component';
import {NavbarComponent} from './navbar/navbar.component';
import {ProfilePictureFormComponent} from './profile-picture-form/profile-picture-form.component';
import {RegisterComponent} from './register/register.component';
import {TypeFormComponent} from './type-form/type-form.component';
import {TypeListComponent} from './type-list/type-list.component';
import {UserListComponent} from './user-list/user-list.component';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatMenuModule,
  MatProgressBarModule,
  MatSnackBar,
  MatSnackBarModule,
  MatStepperModule,
  MatTabsModule,
  MatTooltipModule
} from '@angular/material';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {JwtModule} from '@auth0/angular-jwt';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {HttperrorInterceptor} from './httperror.interceptor';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {PasswordChangeComponent, UserFormComponent} from './user-form/user-form.component';
import {BarRatingModule} from 'ngx-bar-rating-odilo';
import {MatFaqComponent} from './faq/mat-faq/mat-faq.component';
import {MatFaqAdminComponent} from './faq/ngx-material-faq-admin/mat-faq-admin.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxChartsModule} from '@swimlane/ngx-charts';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FaqComponent,
    HabitFormComponent,
    HabitListComponent,
    LoginComponent,
    LogoutComponent,
    MessageFormComponent,
    MessageListComponent,
    NavbarComponent,
    ProfilePictureFormComponent,
    RegisterComponent,
    TypeFormComponent,
    TypeListComponent,
    UserListComponent,
    UserFormComponent,
    PasswordChangeComponent,
    MatFaqAdminComponent,
    MatFaqComponent,
    DashboardHabitEditComponent,
    PasswordChangeComponentDash,
    UserDataChangeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:4200']
      }
    }),
    HttpClientModule,
    MatStepperModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    FormsModule,
    BarRatingModule,
    CommonModule,
    FlexLayoutModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatExpansionModule,
    NgxChartsModule,
    MatTabsModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttperrorInterceptor,
    multi: true,
    deps: [MatSnackBar]
  }],
  bootstrap: [AppComponent],
  entryComponents: [PasswordChangeComponent, DashboardHabitEditComponent, PasswordChangeComponentDash, UserDataChangeComponent],
  exports: [PasswordChangeComponent, DashboardHabitEditComponent, PasswordChangeComponentDash, UserDataChangeComponent]
})
export class AppModule {
}
