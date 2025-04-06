import { Component } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  employees: any[] = [];
  loading = true;
  error: any;

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
      this.employees = data?.getAllEmployees || [];
      this.loading = loading;
      this.error = error;
    });
  }

  goToView(id: string) {
    this.router.navigate(['/employee', 'view', id]);
  }

  goToUpdate(id: string) {
    this.router.navigate(['/employee', 'update', id]);
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
