import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { SettingsComponent } from './settings/settings.component';
import { AllusersComponent } from './allusers/allusers.component';

const routes: Routes = [
  {path:'', component: RegisterComponent, canActivate: [GuestGuard]},
  {path:'login', component: LoginComponent, canActivate: [GuestGuard]},
  {path:'chat', component: ChatComponent, canActivate: [AuthGuard]},
  {path:'users', component: AllusersComponent, canActivate: [AuthGuard]},
  {path:'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path:'**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
