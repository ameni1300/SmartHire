import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private apiUrl = 'http://localhost:8080/Smarthire/api/resumes';

  constructor(private http: HttpClient) { }

getBaseUrl(): string {
    return this.apiUrl;
  }

 // Dans resume.service.ts
getUserResumes(userId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/jobseeker/${userId}`);
}

downloadResume(resumeId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${resumeId}`, {
      responseType: 'blob'
    });
  }

getDownloadUrl(cvId: number): string {
    return `${this.apiUrl}/download/${cvId}`;
  }

  uploadResume(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload/${userId}`, formData);
  }

 deleteResume(resumeId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${resumeId}`, { 
        observe: 'response' 
    }).pipe(
        catchError(error => {
            // Pass the entire response to handle specific status codes
            throw error;
        })
    );
}

deleteResumeByJobseeker(jobseekerId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/jobseeker/${jobseekerId}`);
}

}