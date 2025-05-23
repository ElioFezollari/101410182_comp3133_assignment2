import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-employee-view',
  standalone: true,
  imports: [CommonModule,NavbarComponent],
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.css']
})
export class EmployeeViewComponent {
  employee: any;
  loading = true;
  error: any;

  constructor(private route: ActivatedRoute, private router: Router, private apollo: Apollo) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchEmployee(id);
    }
  }

  fetchEmployee(id: string) {
    const GET_EMPLOYEE_BY_ID = gql`
      query($id: String!) {
        getEmployeeById(id: $id) {
          id
          first_name
          last_name
          email
          gender
          designation
          salary
          department
          date_of_joining
          employee_photo 
        }
      }
    `;
  
    this.apollo.use('employee').query<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).subscribe(({ data, loading, error }) => {
      if (data?.getEmployeeById) {
        this.employee = {
          ...data.getEmployeeById,
          date_of_joining: new Date(+data.getEmployeeById.date_of_joining)
        };
      }
      this.loading = loading;
      this.error = error;
    });
  }
  

  goBack() {
    this.router.navigate(['/employee']);
  }
}
