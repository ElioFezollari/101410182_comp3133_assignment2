import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Apollo, gql } from 'apollo-angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      const LOGIN_QUERY = gql`
        query($username: String, $email: String!, $password: String!) {
          user(username: $username, email: $email, password: $password) {
            id
            username
            email
            created_at
            updated_at
          }
        }
      `;

      this.apollo.query({
        query: LOGIN_QUERY,
        variables: { email, password },
        errorPolicy: 'all'
      }).subscribe({
        next: (result: any) => {
          if (result.errors && result.errors.length > 0) {
            this.errorMessage = result.errors[0].message || 'Unknown server error';
          } else if (result.data && result.data.user) {
            const user = result.data.user;
            this.authService.setUser(user);
            this.successMessage = `Welcome ${user.username}!`;
            this.loginForm.reset();
            this.router.navigate(['/employee']);
          } else {
            this.errorMessage = 'Unexpected error occurred';
          }
        },
        error: (error) => {
          this.errorMessage = error.message || 'Server unreachable';
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please fill out the form correctly before submitting.';
    }
  }
}
