import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private apiUrl = 'http://localhost:8080/Smarthire/api/candidatures';
  private statusUpdates = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  // Submit a job application
  submitApplication(applicationData: any, cvFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('request', JSON.stringify(applicationData));
    
    if (cvFile) {
      formData.append('cvFile', cvFile, cvFile.name);
    }

    return this.http.post(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 409) {
          return throwError(() => 'You have already applied to this job');
        }
        return throwError(() => this.parseError(error));
      })
    );
  }

  notifyStatusChange(update: any) {
    this.statusUpdates.next(update);
  }

  // Observable pour écouter les changements
  get statusUpdates$(): Observable<any> {
    return this.statusUpdates.asObservable();
  }

  // Get applications by user ID
 getApplicationsByUser(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/by-jobseeker/${userId}`).pipe(
    map(applications => applications.map(app => ({
      id: app.id,
      jobId: app.job?.id,  // <-- Ce champ est essentiel
      status: app.status,
      dateApplied: app.applicationDate,
      job: app.job 
    })))
  );
}
 

  // Helper method to format location
  private getLocation(city: string, country: string): string {
    if (!city && !country) return 'Location not specified';
    return [city, country].filter(Boolean).join(', ');
  }

  // Helper method to format salary range
  private getSalaryRange(minSalary?: number, maxSalary?: number): string {
    if (!minSalary) return 'Salary not specified';
    return `$${minSalary}K` + (maxSalary ? ` - $${maxSalary}K` : '');
  }

  // Helper method to normalize status
  private getStatus(status: string): string {
    if (!status) return 'Submitted';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  // Error handling methods
  private parseError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return 'Network error occurred';
    }
    return error.error?.message || error.error || 
           `Server error: ${error.status} ${error.statusText}`;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Application error:', error);
    return throwError(() => 
      error.error?.message || 'Something bad happened; please try again later.'
    );
  }

  // Get jobs for listing
  getJobsForListing(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((jobs: any[]) => jobs.map(job => ({
        id: job.id,
        title: job.jobTitle,
        company: job.recruiter?.companyName || 'Unknown Company',
        location: this.getLocation(job.city, job.country),
        salary: this.getSalaryRange(job.minSalary, job.maxSalary),
        deadline: job.applicationDeadline,
        type: job.employmentType,
        category: job.department
      }))),
      catchError(err => {
        console.error('Error loading jobs:', err);
        return throwError(() => new Error('Failed to load job listings'));
      })
    );
  }

  // Dans job-application.service.ts

getApplicationsByJob(jobId: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/by-job/${jobId}`).pipe(
    map((applications: any[]) => this.mapApplications(applications)),
    catchError(error => {
      console.error('API Error:', error);
      return throwError(() => new Error('Failed to load applications'));
    })
  );
}

private mapApplications(applications: any[]): any[] {
  return applications.map(app => ({
    id: app.id,
    name: app.jobseeker?.nom || 'Unknown Candidate',
    role: app.job?.jobTitle || 'N/A',
    // Correspond exactement aux champs de votre entité Jobseeker
    experience: app.jobseeker?.experience || 'N/A', 
    education: app.jobseeker?.education || 'N/A',
    date: app.applicationDate ? new Date(app.applicationDate).toLocaleDateString('fr-FR') : 'N/A',
    // Chemin complet pour la photo de profil
    photo: app.jobseeker?.profilePicture 
           ? `http://localhost:8080/Smarthire${app.jobseeker.profilePicture}`
           : '../../assets/default-profile.png',
    title: app.job?.jobTitle || 'N/A',
    bio: app.jobseeker?.biography || 'No biography available',
    coverLetter: app.coverLetter || 'No cover letter provided',
    // Formatage de la date de naissance
    birth: app.jobseeker?.birthday 
           ? new Date(app.jobseeker.birthday).toLocaleDateString('fr-FR') 
           : 'N/A',
    nationality: app.jobseeker?.nationality || 'N/A',
    maritalStatus: app.jobseeker?.maritalStatus || 'N/A',
    gender: app.jobseeker?.gender || 'N/A',
    // Utilisation du champ location de Jobseeker
    address: app.jobseeker?.location || 'N/A', 
    phone: app.jobseeker?.phone || 'N/A',
    secondaryPhone: 'N/A', // Champ non présent dans votre entité
    email: app.jobseeker?.email || 'N/A', // Hérité de Utilisateur
    // Gestion des CVs
    resumeUrl: app.resume?.id 
              ? `http://localhost:8080/Smarthire/api/resumes/download/${app.resume.id}`
              : '#',
    resumeFileName: app.resume?.fileName || 'No resume',
    status: app.status || 'Pending'
  }));
}

// job-application.service.ts
updateApplicationStatus(applicationId: number, newStatus: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${applicationId}/status`, { status: newStatus }).pipe(
    catchError(error => {
      console.error('Error updating application status:', error);
      return throwError(() => new Error(
        error.error?.message || 
        'Failed to update application status'
      ));
    })
  );
}
}