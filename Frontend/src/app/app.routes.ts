import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeUpdateComponent } from './employee-update/employee-update.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'employee', component: EmployeeComponent },
  { path: 'employee/view/:id', component: EmployeeViewComponent },
  { path: 'employee/update/:id', component: EmployeeUpdateComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },  
  { path: '**', redirectTo: '/login' }                
];
