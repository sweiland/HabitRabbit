/*
 * app-routing.module.ts Copyright (c) 2020 by the HabitRabbit developers (ardianq, lachchri16, sweiland, YellowIcicle).
 */

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
import {UsersResolver} from './resolver/users.resolver';
import {TypesResolver} from './resolver/types.resolver';
import {TypeResolver} from './resolver/type.resolver';
import {UserFormComponent} from './user-form/user-form.component';
import {UserResolver} from './resolver/user.resolver';
import {HabitResolver} from './resolver/habit.resolver';
import {HabitUserResolver} from './resolver/habit-user.resolver';


const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    resolve: {habits: HabitUserResolver, typeOptions: TypesResolver},
    runGuardsAndResolvers: 'always'
  },
  {path: 'faq', component: FaqComponent, canActivate: [AuthGuard]},
  {
    path: 'habit-form', component: HabitFormComponent, canActivate: [AuthGuard],
    resolve: {memberOptions: UsersResolver, typeOptions: TypesResolver}
  },
  {
    path: 'habit-form/:id', component: HabitFormComponent, canActivate: [AuthGuard], resolve: {
      habit: HabitResolver,
      memberOptions: UsersResolver, typeOptions: TypesResolver
    }
  },
  {path: 'habit-list', component: HabitListComponent, canActivate: [AuthGuard]},
  {path: 'message-form', component: MessageFormComponent, canActivate: [AuthGuard], resolve: {typeOptions: TypesResolver}},
  {path: 'message-form/:id', component: MessageFormComponent, canActivate: [AuthGuard], resolve: {typeOptions: TypesResolver}},
  {path: 'message-list', component: MessageListComponent, canActivate: [AuthGuard]},
  {path: 'profile-form', component: ProfileFormComponent, canActivate: [AuthGuard]},
  {path: 'profile-form/:id', component: ProfileFormComponent, canActivate: [AuthGuard]},
  {path: 'profile-page', component: ProfilePageComponent, canActivate: [AuthGuard]},
  {path: 'profile-picture-form', component: ProfilePictureFormComponent, canActivate: [AuthGuard]},
  {path: 'profile-picture-form/:id', component: ProfilePictureFormComponent, canActivate: [AuthGuard]},
  {path: 'profile-picture-list', component: ProfilePictureListComponent, canActivate: [AuthGuard]},
  {path: 'score-list', component: ScoreListComponent, canActivate: [AuthGuard]},
  {path: 'type-form', component: TypeFormComponent, canActivate: [AuthGuard]},
  {path: 'type-form/:id', component: TypeFormComponent, canActivate: [AuthGuard], resolve: {type: TypeResolver}},
  {path: 'type-list', component: TypeListComponent, canActivate: [AuthGuard]},
  {path: 'user-list', component: UserListComponent, canActivate: [AuthGuard]},
  {path: 'user-form', component: UserFormComponent, canActivate: [AuthGuard]},
  {path: 'user-form/:id', component: UserFormComponent, canActivate: [AuthGuard], resolve: {user: UserResolver}},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
