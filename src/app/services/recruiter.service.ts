import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RecruiterService {
  private apiUrl = 'http://localhost:8080/Smarthire/api/recruiters';

  constructor(private http: HttpClient) { }

  createRecruiter(recruiterData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, recruiterData, { headers }).pipe(
      catchError(error => {
        if (error.status === 400) {
          
          if (error.error && error.error.includes("Email already registered")) {
            return throwError(() => new Error('This email is already registered. Please use a different email.'));
          }
          return throwError(() => new Error('Invalid data. Please check your information.'));
        }
        else if (error.status === 409) {
          return throwError(() => new Error('This email is already in use.'));
        }
        else if (error.status === 0) {
          return throwError(() => new Error('Network error. Please check your connection.'));
        }
        return throwError(() => new Error('An unexpected error occurred. Please try again later.'));
      })
    );
  }

 getRecruiterProfile(id: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/${id}`).pipe(
    map((backendData: any) => this.transformRecruiterData(backendData)),
    catchError(this.handleError)
  );
}

// Dans RecruiterService
checkEmailExists(email: string): Observable<boolean> {
  return this.http.get<boolean>(
    `${this.apiUrl}/check-email/${encodeURIComponent(email)}`
  ).pipe(
    catchError(() => of(false)) // Si erreur, considère que l'email existe
  );
}


private transformRecruiterData(backendData: any): any {
  return {
    // Basic info
    name: backendData.nom || backendData.name,
    email: backendData.email || backendData.companyEmail,
    
    // Company info
    bio: backendData.companyDescription,
    companyName: backendData.companyName,
    companyWebsite: backendData.companyWebsite,
    position: 'Recruteur', // Default value
    industry: backendData.industryType,
    location: backendData.location,
    phone: backendData.phone,
    companyEmail: backendData.companyEmail,
    joinDate: backendData.yearOfEstablishment ? 
              new Date(backendData.yearOfEstablishment).toLocaleDateString() : 
              'Date inconnue',
    photoUrl: backendData.companyLogo 
  ? `http://localhost:8080/Smarthire${backendData.companyLogo}`
  : '../../assets/recruiter/recruiter.png',
  
    
    // New required fields
    nationality: backendData.nationality,
    organizationType: backendData.organizationType,
    
    // New optional fields
    companyVision: backendData.companyVision,
    facebook: backendData.facebook,
    twitter: backendData.twitter,
    linkedin: backendData.linkedin,
    github: backendData.github,
    
  };
 

}
  // Mettre à jour le profil
  updateRecruiterProfile(id: number, profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, profileData).pipe(
      catchError(this.handleError)
    );
  }

  // Gestion centralisée des erreurs
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      errorMessage = `Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

   getRecruiterSettings(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/settings`).pipe(
      map((data: any) => this.transformSettingsData(data)),
      catchError(this.handleError)
    );
  }

  private transformSettingsData(data: any): any {
    return {
      companyName: data.companyName,
      companyDescription: data.companyDescription,
      organizationType: data.organizationType,
      industryType: data.industryType,
      yearOfEstablishment: data.yearOfEstablishment,
      companyWebsite: data.companyWebsite,
      companyVision: data.companyVision,
      facebook: data.facebook,
      twitter: data.twitter,
      linkedin: data.linkedin,
      github: data.github,
      location: data.location,
      phone: data.phone,
      email: data.companyEmail
    };
  }

 updateRecruiterSettings(id: number, settings: FormData): Observable<any> {
  return this.http.post<any>(
    `${this.apiUrl}/${id}/settings`, // ⬅️ `POST` ici
    settings
  ).pipe(
    catchError(this.handleError)
  );
}


  updatePassword(id: number, passwordData: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/password`, passwordData).pipe(
      catchError(this.handleError)
    );
  }

 deleteRecruiterAccount(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      let errorMessage = 'Erreur lors de la suppression du compte';
      if (error.status === 404) {
        errorMessage = 'Compte déjà supprimé';
      }
      return throwError(() => new Error(errorMessage));
    })
  );
}

}