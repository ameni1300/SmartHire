import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobApplicationService } from '../services/job-application.service';
import { JobseekerService } from '../services/jobseeker.service';
import { JobService } from '../services/job.service';
import { forkJoin } from 'rxjs';
@Component({
  selector: 'app-jobseeker-dashboard',
  templateUrl: './jobseeker-dashboard.component.html',
  styleUrls: ['./jobseeker-dashboard.component.scss']
})
export class JobseekerDashboardComponent implements OnInit {
  nom: string = ' ';
  appliedJobs: any[] = [];
  showProfileMenu = false;
  showModal = false;
  selectedJob: any = null;
  isLoading=false;
  errorMessage='';

  constructor(
    private router: Router, 
    private jobApplicationService: JobApplicationService,
    private jobseekerService: JobseekerService, // << ajoute ceci
    private jobService: JobService
  ) {}

  ngOnInit() {
    this.loadAppliedJobs();
    this.loadJobseekerName();
    this.loadJobLogo();
     
  }

  // jobseeker-dashboard.component.ts
private showSuccessToast(message: string): void {
  // Implémentez selon votre système de notifications
  alert('Succès: ' + message); // Solution basique
  // Ou utilisez un service de toast dédié si disponible
}

private showErrorToast(message: string): void {
  alert('Erreur: ' + message); // Solution basique
}

 loadJobLogo(): void {
  // Pour chaque job appliqué, charger ses détails (dont le logo du recruteur)
  this.appliedJobs.forEach((job, index) => {
    this.jobService.getJobDetails(job.jobId).subscribe({
      next: (jobDetails) => {
        this.appliedJobs[index].logo = jobDetails.recruiter?.companyLogo
          ? `http://localhost:8080/Smarthire${jobDetails.recruiter.companyLogo}`
          : '../../assets/recruiter/recruiter.png';
      },
      error: (err) => {
        console.error(`Erreur lors du chargement du logo pour le job ${job.jobId}:`, err);
        this.appliedJobs[index].logo = '../../assets/recruiter/recruiter.png'; // Logo par défaut
      }
    });
  });
}



   loadJobseekerName(): void {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) return;

    this.jobseekerService.getJobseekerById(userId).subscribe({
      next: (jobseeker) => {
        this.nom = jobseeker.nom || 'Utilisateur';
      },
      error: (err) => {
        console.error('Erreur chargement jobseeker:', err);
        this.nom = 'Utilisateur';
      }
    });
  }

    loadAppliedJobs(): void {
  const userId = Number(localStorage.getItem('userId'));
  if (!userId) return;

  this.isLoading = true;
  this.errorMessage = '';

  this.jobApplicationService.getApplicationsByUser(userId).subscribe({
    next: (applications) => {
      console.log('Applications with jobs:', applications); // Debug
      
      this.appliedJobs = applications.map(app => {
        // Si l'API retourne déjà le job complet
        if (app.job) {
          return this.mapApplicationWithJob(app, app.job);
        }
        
        // Sinon, utilisez les valeurs par défaut avec les données de base
        return {
          id: app.id,
          title: app.job?.jobTitle || 'No title',
          company: app.job?.recruiter?.companyName || 'No company',
          dateApplied: app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : 'N/A',
          status: app.job?.status,
          email: app.job?.recruiter?.companyEmail,
          phone:app.job?.recruiter?.phone,
          companyWebsite:app.job?.recruiter?.companyWebsite,
          deadline: app.job?.applicationDeadline
           };
      });
      
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading applications:', err);
      this.errorMessage = 'Failed to load applications';
      this.isLoading = false;
    }
  });
}

private mapApplicationWithJob(application: any, job: any): any {
  return {
    id: application.id,
    title: job.jobTitle,
    description: job.jobDescription,
    type: job.employmentType,
    company: job.recruiter?.companyName,
    dateApplied: application.dateApplied,
    status: job?.status,
    location: `${job.city}, ${job.country}`,
    email: job?.recruiter?.companyEmail,
    phone:job?.recruiter?.phone,
    companyWebsite:job?.recruiter?.companyWebsite,
    deadline: job?.applicationDeadline,

    salary: job.minSalary && job.maxSalary 
      ? `$${job.minSalary}K - $${job.maxSalary}K` 
      : 'Salary not specified',
    // ... autres champs
  };
}




 

goToProfile() {
  this.router.navigate(['/profil']);
}

goToSettings() {
  this.router.navigate(['/jobseeker-setting']);
}

logout() {
 this.router.navigate(['/home']);
}

    

toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

goToSearch() {
  console.log('Navigating to search...'); // Vérifiez dans la console
  this.router.navigate(['/jobseeker-jobsearch']);
}
openModal(job: any) {
    this.selectedJob = job;
    this.showModal = true;
  }

  // Fermer le modal
  closeModal() {
    this.showModal = false;
    this.selectedJob = null;
  }



}


