import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private apollo: Apollo) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.signupForm.valid) {
      const { username, email, password } = this.signupForm.value;

      const SIGNUP_MUTATION = gql`
        mutation Register($username: String!, $email: String!, $password: String!) {
          addUser(username: $username, email: $email, password: $password) {
            id
            username
            email
            created_at
            updated_at
          }
        }
      `;

      this.apollo.mutate({
        mutation: SIGNUP_MUTATION,
        variables: { username, email, password },
        errorPolicy: 'all'
      }).subscribe({
        next: (result: any) => {
          if (result.errors && result.errors.length > 0) {
            this.errorMessage = result.errors.map((e: any) => e.message).join(', ');
            return; 
          }

          if (result.data && result.data.addUser) {
            this.successMessage = `Signup successful! Welcome ${result.data.addUser.username}!`;
            this.signupForm.reset();
          } else {
            this.errorMessage = 'Unexpected error occurred during signup.';
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Server unreachable during signup.';
        }
      });

    } else {
      this.signupForm.markAllAsTouched();
      this.errorMessage = 'Please fill out the form correctly before submitting.';
    }
  }
}
