// src/app/services/job.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class JobService {
private apiUrl = 'http://localhost:8080/Smarthire/api/jobs'; // Notez le /Smarthire

  private jobToEdit: any = null;
  private jobToEditIndex: number = -1;

  constructor(private http: HttpClient) {}

  /** Créer une offre d’emploi */
createJob(job: any, recruiterId: number): Observable<any> {
  // Convert string → array if "skills" is a string
  if (job.skills) {
    job.skillsAndQualifications = job.skills.split(',').map((s: string) => s.trim());
    delete job.skills;
  }

  // Ensure date is in correct format
  if (job.applicationDeadline && typeof job.applicationDeadline === 'string') {
    job.applicationDeadline = new Date(job.applicationDeadline).toISOString().split('T')[0];
  }

  return this.http.post(`${this.apiUrl}/recruiter/${recruiterId}`, job);
}

private isEditing = false;

setEditMode(editing: boolean) {
  this.isEditing = editing;
}

isEditMode(): boolean {
  return this.isEditing;
}

  /** Récupérer les offres pour un recruteur */
  getJobsForRecruiter(recruiterId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recruiter/${recruiterId}`);
  }

  /** Récupérer tous les jobs (optionnel) */
  getAllJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  /** Modifier une offre existante */
  updateJob(jobId: number, updatedJob: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${jobId}`, updatedJob);
  }

 deleteJob(jobId: number): Observable<{message: string}> {
  return this.http.delete<{message: string}>(`${this.apiUrl}/${jobId}`, {
    observe: 'response' // Pour examiner la réponse complète
  }).pipe(
    map(response => {
      if (response.status === 200) {
        return response.body || {message: 'Suppression réussie'};
      }
      throw new Error('Réponse inattendue du serveur');
    }),
    catchError(error => {
      console.error('Erreur technique:', error);
      return throwError(() => new Error(
        error.error?.message || 
        error.message || 
        'Erreur lors de la suppression'
      ));
    })
  );
}

  // Gestion de l’état local (édition uniquement)
  setJobToEdit(job: any, index: number) {
    this.jobToEdit = { ...job };
    this.jobToEditIndex = index;
  }

  getJobToEdit() {
    return this.jobToEdit;
  }

  getEditIndex() {
    return this.jobToEditIndex;
  }


  clearEdit() {
    this.jobToEdit = null;
    this.jobToEditIndex = -1;
  }

  getJobDetails(jobId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${jobId}`).pipe(
    map(job => ({
      ...job,
      // Formatage des données pour une meilleure présentation
      applicationDeadline: new Date(job.applicationDeadline),
      recruiter: {
        companyName: job.recruiter?.companyName,
        phone: job.recruiter?.phone,
        companyEmail: job.recruiter?.companyEmail,
        companyWebsite: job.recruiter?.companyWebsite || job.companyWebsite || 'N/A'

      }
    }))
  );
}

// Ajoutez cette méthode au service JobService
// job.service.ts
updateJobStatus(jobId: number, status: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/${jobId}/status`, { status }).pipe(
    catchError(error => {
      console.error('Error updating job status:', error);
      return throwError(() => new Error(
        error.error?.message || 
        error.message || 
        'Failed to update job status'
      ));
    })
  );
}

getJobs(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}`).pipe(
    map((jobs: any[]) => {
      return jobs.map(job => ({
        // Map backend fields to frontend expected fields
        id: job.id,
        title: job.jobTitle,
        category: job.employmentType,
        department: job.department,
        mode: job.workMode,
        country: job.country,
        city: job.city,
        openings: job.numberOfOpenings,
        experience: job.experience,
        deadline: job.applicationDeadline,
        description: job.jobDescription,
        skills: job.skillsAndQualifications?.join(', '),
        joinus: job.whyJoinUs,
        salaryMin: job.minSalary,
        salaryMax: job.maxSalary,
        status: job.status || 'Open',
        applications: 0 // Default value, update if you have applications data
      }));
    })
  );
}

getJobsForListing(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}`).pipe(
    map((jobs: any[]) => {
      return jobs.map(job => ({
        id: job.id,
        title: job.jobTitle,
        company: job.recruiter?.companyName || 'Unknown Company',
        logo: job.recruiter?.companyLogo
          ? `http://localhost:8080/Smarthire${job.recruiter.companyLogo}`
          : '../../assets/recruiter/recruiter.png',
        location: `${job.city}, ${job.country}`,
        minSalary: job.minSalary, // Valeur numérique brute
        maxSalary: job.maxSalary, // Valeur numérique brute
        salaryDisplay: job.minSalary && job.maxSalary 
          ? `$${job.minSalary/1000}K - $${job.maxSalary/1000}K` 
          : 'Non spécifié',      
        deadline: job.applicationDeadline,
        type: job.employmentType,
        category: job.department,
        companyWebsite : job.recruiter?.companyWebsite,
        status: job.status // Ajout du statut ici

      }));
    }),
    catchError(err => {
      console.error('Erreur lors du chargement des jobs :', err);
      return throwError(() => new Error('Échec du chargement des offres'));
    })
  );
}

}
