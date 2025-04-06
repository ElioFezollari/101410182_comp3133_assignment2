import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule,FormsModule,NavbarComponent],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  employees: any[] = [];
  loading = true;
  error: any;

  searchDesignation = '';
  searchDepartment = '';

  constructor(private apollo: Apollo, private router: Router) {
    this.fetchEmployees();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.fetchEmployees();
    });
  }

  fetchEmployees() {
    const GET_ALL_EMPLOYEES = gql`
      query {
        getAllEmployees {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          department
          date_of_joining
        }
      }
    `;

    this.apollo.use('employee').watchQuery<any>({
      query: GET_ALL_EMPLOYEES,
      fetchPolicy: 'network-only'
    })
    .valueChanges
    .subscribe(({ data, loading, error }) => {
      if (data?.getAllEmployees) {
        this.employees = data.getAllEmployees.map((emp: any) => ({
          ...emp,
          date_of_joining: new Date(+emp.date_of_joining)
        }));
      } else {
        this.employees = [];
      }
      this.loading = loading;
      this.error = error;
    });
  }

  searchEmployees() {
    const SEARCH_EMPLOYEES = gql`
      query($designation: String, $department: String) {
        searchEmployees(designation: $designation, department: $department) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          department
          date_of_joining
        }
      }
    `;

    this.apollo.use('employee').query<any>({
      query: SEARCH_EMPLOYEES,
      variables: {
        designation: this.searchDesignation || null,
        department: this.searchDepartment || null
      }
    })
    .subscribe(({ data, loading, error }) => {
      if (data?.searchEmployees) {
        this.employees = data.searchEmployees.map((emp: any) => ({
          ...emp,
          date_of_joining: new Date(+emp.date_of_joining)
        }));
      } else {
        this.employees = [];
      }
      this.loading = loading;
      this.error = error;
    });
  }

  resetSearch() {
    this.searchDesignation = '';
    this.searchDepartment = '';
    this.fetchEmployees();
  }

  logout() {
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 
  }

  goToView(id: string) {
    this.router.navigate(['/employee', 'view', id]);
  }

  goToUpdate(id: string) {
    this.router.navigate(['/employee', 'update', id]);
  }

  goToCreate() {
    this.router.navigate(['/employee/create']);
  }

  deleteEmployee(id: string) {
    if (!confirm('Are you sure you want to delete this employee?')) return;

    const DELETE_EMPLOYEE = gql`
      mutation($id: String!) {
        deleteEmployee(id: $id)
      }
    `;

    this.apollo.use('employee').mutate<any>({
      mutation: DELETE_EMPLOYEE,
      variables: { id }
    }).subscribe(() => {
      alert('Employee deleted successfully!');
      this.fetchEmployees();
    });
  }
}
