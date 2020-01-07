import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from './auth.guard';
import {FaqComponent} from './faq/faq.component';
import {HabitFormComponent} from './habit-form/habit-form.component';
import {HabitListComponent} from './habit-list/habit-list.component';
import {MessageFormComponent} from './message-form/message-form.component';
import {MessageListComponent} from './message-list/message-list.component';
import {ProfileFormComponent} from './profile-form/profile-form.component';
import {ProfilePageComponent} from './profile-page/profile-page.component';
import {ProfilePictureFormComponent} from './profile-picture-form/profile-picture-form.component';
import {ProfilePictureListComponent} from './profile-picture-list/profile-picture-list.component';
import {ScoreListComponent} from './score-list/score-list.component';
import {RegisterComponent} from './register/register.component';
import {TypeFormComponent} from './type-form/type-form.component';
import {TypeListComponent} from './type-list/type-list.component';
import {UserListComponent} from './user-list/user-list.component';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'faq', component: FaqComponent, canActivate: [AuthGuard]},
  {path: 'habit-form', component: HabitFormComponent, canActivate: [AuthGuard]},
  {path: 'habit-list', component: HabitListComponent, canActivate: [AuthGuard]},
  {path: 'message-form', component: MessageFormComponent, canActivate: [AuthGuard]},
  {path: 'message-list', component: MessageListComponent, canActivate: [AuthGuard]},
  {path: 'profile-form', component: ProfileFormComponent, canActivate: [AuthGuard]},
  {path: 'profile-page', component: ProfilePageComponent, canActivate: [AuthGuard]},
  {path: 'profile-picture-form', component: ProfilePictureFormComponent, canActivate: [AuthGuard]},
  {path: 'profile-picture-list', component: ProfilePictureListComponent, canActivate: [AuthGuard]},
  {path: 'score-list', component: ScoreListComponent, canActivate: [AuthGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard]},
  {path: 'type-form', component: TypeFormComponent, canActivate: [AuthGuard]},
  {path: 'type-list', component: TypeListComponent, canActivate: [AuthGuard]},
  {path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
