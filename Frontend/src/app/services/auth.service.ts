import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  private user: any = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  setUser(user: any) {
    this.user = user;
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  getUser(): any {
    return this.user;
  }

  isAuthenticated(): boolean {
    return !!this.token || !!this.user;
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }
}
