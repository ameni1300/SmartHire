// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/Smarthire/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  return this.http.post(`${this.apiUrl}/login`, { email, password }, { headers }).pipe(
    tap((response: any) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('userType', response.userType);
      localStorage.setItem('userId', response.userId);
      
      // Redirection automatique selon le type d'utilisateur
      if (response.userType === 'recruiter') {
        this.router.navigate(['/recruiter-dash']);
      } else {
        this.router.navigate(['/jobseeker-jobsearch']);
      }
    })
  );
}
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    this.router.navigate(['/signin']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserType(): string | null {
    return localStorage.getItem('userType');
  }

   sendVerificationCode(email: string) {
    return this.http.post(`${this.apiUrl}/send-reset-code`, { email });
  }

  verifyCode(email: string, code: string) {
    return this.http.post<{valid: boolean}>(`${this.apiUrl}/verify-code`, { email, code });
  }

  resetPassword(email: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, newPassword });
  }

}