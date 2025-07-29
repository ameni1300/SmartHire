import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailCheckService {
  private apiUrl = 'http://localhost:8080/Smarthire/api';

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<boolean> {
    if (!email || !this.isValidEmail(email)) {
      return of(false);
    }

    return this.http.get<boolean>(
      `${this.apiUrl}/recruiters/check-email/${encodeURIComponent(email)}`,
      { observe: 'response' }
    ).pipe(
      tap(response => console.log('Recruiter response:', response)),
      map(response => response.body === false), // Inverse la logique
      catchError(err => {
        console.error('Recruiter check error:', err);
        return of(false);
      }),
      switchMap(recruiterExists => {
        if (recruiterExists) {
          return of(true);
        }
        return this.http.get<boolean>(
          `${this.apiUrl}/jobseekers/check-email/${encodeURIComponent(email)}`,
          { observe: 'response' }
        ).pipe(
          tap(response => console.log('Jobseeker response:', response)),
          map(response => response.body === false), // Inverse la logique
          catchError(err => {
            console.error('Jobseeker check error:', err);
            return of(false);
          })
        );
      })
    );
  }

  private isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
}