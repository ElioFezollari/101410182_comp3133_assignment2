import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-employee-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-update.component.html',
  styleUrls: ['./employee-update.component.css']
})
export class EmployeeUpdateComponent {
  employeeForm: FormGroup;
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      gender: [''],
      designation: [''],
      salary: [''],
      department: [''],
    });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.fetchEmployee(this.id);
    }
  }

  fetchEmployee(id: string) {
    const GET_EMPLOYEE_BY_ID = gql`
      query($id: String!) {
        getEmployeeById(id: $id) {
          first_name
          last_name
          email
          gender
          designation
          salary
          department
        }
      }
    `;

    this.apollo.use('employee').query<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).subscribe(({ data }) => {
      this.employeeForm.patchValue(data.getEmployeeById);
    });
  }

  onUpdate() {
    if (!this.id) return;

    const UPDATE_EMPLOYEE = gql`
      mutation($id: String!, $first_name: String, $last_name: String, $email: String, $gender: String, $designation: String, $salary: Int, $department: String) {
        updateEmployee(id: $id, first_name: $first_name, last_name: $last_name, email: $email, gender: $gender, designation: $designation, salary: $salary, department: $department) {
          id
        }
      }
    `;

    this.apollo.use('employee').mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: { id: this.id, ...this.employeeForm.value }
    }).subscribe(() => {
      alert('Employee updated successfully!');
      this.router.navigate(['/employee']);
    });
  }

  goBack() {
    this.router.navigate(['/employee']);
  }
}
