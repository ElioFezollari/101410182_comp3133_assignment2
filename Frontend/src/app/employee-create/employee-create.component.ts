import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-employee-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NavbarComponent],
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent {
  employeeForm: FormGroup;
  selectedImageBase64: string | null = null;
  errorMessage: string | null = null;  
  formErrorMessage: string | null = null;

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
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

  onCreate() {
if (this.employeeForm.invalid) {
  this.formErrorMessage = 'Please fill all required fields correctly.';
  return;
}

    this.errorMessage = null; 

    const employeeData = {
      ...this.employeeForm.value,
      employee_photo: this.selectedImageBase64 || ''
    };

    const ADD_EMPLOYEE = gql`
      mutation(
        $first_name: String!,
        $last_name: String!,
        $email: String!,
        $gender: String,
        $designation: String!,
        $salary: Int!,
        $date_of_joining: String!,
        $department: String!,
        $employee_photo: String
      ) {
        addEmployee(
          first_name: $first_name,
          last_name: $last_name,
          email: $email,
          gender: $gender,
          designation: $designation,
          salary: $salary,
          date_of_joining: $date_of_joining,
          department: $department,
          employee_photo: $employee_photo
        ) {
          id
        }
      }
    `;

    this.apollo.use('employee').mutate({
      mutation: ADD_EMPLOYEE,
      variables: employeeData
    }).subscribe({
      next: () => {
        this.formErrorMessage = null;
this.errorMessage = null;
        this.router.navigate(['/employee']);
      },
      error: (error) => {
        console.error('Error creating employee:', error);
        this.errorMessage = error?.graphQLErrors?.[0]?.message || 'Unknown server error';
      }
    });
  }

  goBack() {
    this.router.navigate(['/employee']);
  }
}
