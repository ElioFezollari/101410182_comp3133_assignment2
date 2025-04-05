import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: '**', redirectTo: '/login' }                
];
