import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

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
  selectedImageBase64: string | null = null;
  formErrorMessage: string | null = null; 
  errorMessage: string | null = null;       

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apollo: Apollo,
    private fb: FormBuilder
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: [''],
      designation: ['', Validators.required],
      salary: [0, Validators.required],
      department: ['', Validators.required],
      date_of_joining: ['', Validators.required]
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
          date_of_joining
          employee_photo
        }
      }
    `;

    this.apollo.use('employee').query<any>({
      query: GET_EMPLOYEE_BY_ID,
      variables: { id }
    }).subscribe(({ data }) => {
      this.employeeForm.patchValue(data.getEmployeeById);
      this.selectedImageBase64 = data.getEmployeeById.employee_photo;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImageBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onUpdate() {
    if (this.employeeForm.invalid) {
      this.formErrorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.formErrorMessage = null;
    this.errorMessage = null;

    if (!this.id) return;

    const UPDATE_EMPLOYEE = gql`
      mutation(
        $id: String!,
        $first_name: String,
        $last_name: String,
        $email: String,
        $gender: String,
        $designation: String,
        $salary: Int,
        $department: String,
        $employee_photo: String
      ) {
        updateEmployee(
          id: $id,
          first_name: $first_name,
          last_name: $last_name,
          email: $email,
          gender: $gender,
          designation: $designation,
          salary: $salary,
          department: $department,
          employee_photo: $employee_photo
        ) {
          id
        }
      }
    `;

    const updateData = {
      id: this.id,
      ...this.employeeForm.value,
      employee_photo: this.selectedImageBase64 || ''
    };

    this.apollo.use('employee').mutate({
      mutation: UPDATE_EMPLOYEE,
      variables: updateData
    }).subscribe({
      next: () => {
        this.router.navigate(['/employee']);
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        this.errorMessage = error?.graphQLErrors?.[0]?.message || 'Unknown server error';
      }
    });
  }

  goBack() {
    this.router.navigate(['/employee']);
  }
}
