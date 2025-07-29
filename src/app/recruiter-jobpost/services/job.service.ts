import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  jobs: any[] = [];

  private jobToEdit: any = null;
  private jobToEditIndex: number = -1;

  addJob(job: any) {
    job.status = 'Open';
    job.showMenu = false;
    job.applications = 0;
    job.openings = Number(job.openings) || 1;

    const today = new Date();
    const deadline = new Date(job.deadline);
    if (deadline < today) job.status = 'Close';

    this.jobs.unshift(job);
  }

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

  updateJob(index: number, updatedJob: any) {
    this.jobs[index] = {
      ...this.jobs[index], // garde status et applications
      ...updatedJob,
      showMenu: false
    };
    this.clearEdit(); // facultatif
  }

  clearEdit() {
    this.jobToEdit = null;
    this.jobToEditIndex = -1;
  }

  getJobs() {
    return this.jobs;
  }
}
