import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobseekerService {
  private apiUrl = 'http://localhost:8080/Smarthire/api/jobseekers';

  constructor(private http: HttpClient) { }

  // Nouvelle méthode pour créer un jobseeker avec CV
  createJobseekerWithCv(jobseekerData: any, cvFile?: File | null): Observable<any> {
  const formData = new FormData();
  
  formData.append('jobseekerData', JSON.stringify(jobseekerData));
  
  if (cvFile) {
    formData.append('cvFile', cvFile, cvFile.name); // Ajoutez le nom du fichier
  }

return this.http.post(this.apiUrl, formData, {
    reportProgress: true, // Optionnel: pour suivre la progression
    responseType: 'json'
  });

}

  // Gardez l'ancienne méthode pour la compatibilité
  createJobseeker(jobseekerData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.apiUrl, jobseekerData, { headers });
  }

  getJobseekerById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(response => ({
        ...response,
        tags: response.tags || [] 
      })),
      catchError(error => {
        console.error('Error fetching jobseeker:', error);
        return of({ tags: [] });
      })
    );
  }

  // jobseeker.service.ts
/*getJobseekerProfile(userId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/profile/${userId}`).pipe(
    catchError(error => {
      console.error('Error fetching jobseeker profile:', error);
      return of(null);
    })
  );
}*/

   getJobseekerProfile(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      map((backendData: any) => this.transformJobseekerData(backendData)),
      catchError(this.handleError)
    );
  }

  private transformJobseekerData(backendData: any): any {
    // Récupérer le premier résumé si disponible
    const primaryResume = backendData.resumes && backendData.resumes.length > 0 
      ? backendData.resumes[0] 
      : null;

    return {
      // Informations de base
      id: backendData.id,
      nom: backendData.nom || backendData.name,
      email: backendData.email,
      photoUrl: backendData.profilePicture 
        ? `http://localhost:8080/Smarthire${backendData.profilePicture}`
        : '../../assets/imgprof.png',
      
      // Informations personnelles
      headline: backendData.headline,
      bio: backendData.biography,
      personalMessage: backendData.personalMessage,
      birthday: backendData.birthday,
      nationality: backendData.nationality,
      location: backendData.location,
      maritalStatus: backendData.maritalStatus,
      gender: backendData.gender,
      phone: backendData.phone,
      
      // Informations professionnelles
      experience: backendData.experience,
      education: backendData.education,
      skills: backendData.tags || [],
      
      // Résumé
      resumeUrl: primaryResume ? `http://localhost:8080/Smarthire${primaryResume.url}` : null,
      resumeName: primaryResume ? primaryResume.name : 'MyResume.pdf',
      
      // Liens sociaux
      website: backendData.portfolioUrl,
      facebook: backendData.facebook,
      twitter: backendData.twitter,
      linkedin: backendData.linkedin,
      github: backendData.github
    };
  }

  getJobseekerResumes(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userId}/resumes`);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Status: ${error.status}\nMessage: ${error.message}`;
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
      bio: data.biography,
      birthday: data.birthday,
      education: data.education,
      headline: data.headline, // Default value
      experience: data.experience,
      location: data.location,
      phone: data.phone,
      gender: data.gender,
      nationality: data.nationality,
      marital_status: data.marital_status, 
      companyWebsite: data.companyWebsite,
      companyVision: data.companyVision,
      facebook: data.facebook,
      twitter: data.twitter,
      linkedin: data.linkedin,
      github: data.github,
      email: data.companyEmail
    };
  }

 checkEmailExists(email: string): Observable<boolean> {
  return this.http.get<boolean>(
    `${this.apiUrl}/check-email/${encodeURIComponent(email)}`
  ).pipe(
    catchError(() => of(false)) // Si erreur, considère que l'email existe
  );
}

  updateJobseeker(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data).pipe(
      catchError(this.handleError)
    );
  }

 uploadProfilePhoto(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/${userId}/upload-photo`, formData, {
      reportProgress: true,
      responseType: 'json'
    }).pipe(
      catchError(this.handleError)
    );
}

 deleteJobseeker(id: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${id}`).pipe(
    catchError(error => {
      if (error.status === 404) {
        // Si le compte est déjà supprimé, on considère l'opération comme réussie
        return of({ status: 'success', message: 'Compte déjà supprimé' });
      }
      let errorMessage = 'Erreur lors de la suppression du compte';
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
      return throwError(() => new Error(errorMessage));
    })
  );
}

updatePassword(jobseekerId: number, currentPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${jobseekerId}/password`, {
      currentPassword,
      newPassword
    }).pipe(
      catchError(this.handleError)
    );

  }
}