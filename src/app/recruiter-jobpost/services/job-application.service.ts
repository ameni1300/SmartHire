import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private applications: any[] = [];

  constructor() { }

  addApplication(job: any) {
    const jobWithDate = {
      ...job,
      dateApplied: new Date(),
      status: 'Active'
    };
    this.applications.push(jobWithDate);
  }

  getApplications(): any[] {
    return this.applications;
  }

  clearApplications() {
    this.applications = [];
  }
}
