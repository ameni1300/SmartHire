import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobService } from '../services/job.service'; // adapte le chemin si besoin
import { JobApplicationService } from '../services/job-application.service'; // Importez votre service
import { AuthService } from '../services/auth.service'; // Ajoutez ce service si vous ne l'avez pas
import { RecruiterService } from '../services/recruiter.service';

@Component({
  selector: 'app-recruiter-dashboard',
  templateUrl: './recruiter-dashboard.component.html',
  styleUrls: ['./recruiter-dashboard.component.scss']
})
export class RecruiterDashboardComponent implements OnInit {
  showProfileMenu = false;
  isDeleting=false;
  jobs: any[] = [];
  applications: any[] = [];
  isLoading = true;
  errorMessage = '';
  nom: string = '';
  userId: number | null = null;

recruiter = {
    name: ''
  };
  constructor(private router: Router,private recruiterService: RecruiterService, private jobService: JobService, private jobApplicationService:JobApplicationService) {}

 ngOnInit() {
   this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.loadRecruiterProfile();
    }
  this.loadJobs();
}

loadRecruiterProfile() {
    this.recruiterService.getRecruiterProfile(this.userId!).subscribe({
      next: (data) => {
        this.updateProfileData(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
      }
    });
  }

  updateProfileData(profileData: any) {
    this.recruiter = {
      
      name: profileData.name,
      
    };
  }


 loadRecruiterData(userId: number): void {
    this.recruiterService.getRecruiterProfile(userId).subscribe({
      next: (data) => {
        this.nom = data.nom || 'Utilisateur';
        
      },
      error: (err) => {
        console.error("Erreur lors du chargement:", err);
      }
    });
  }

  

   loadApplicationCount(job: any) {
    this.jobApplicationService.getApplicationsByJob(job.id).subscribe({
      next: (applications) => {
        job.applications = applications.length;
      },
      error: (err) => {
        console.error('Error loading applications count:', err);
        job.applications = 0;
      }
    });
  }


  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goToProfile() {
    this.router.navigate(['/recruiter-profil']);
  }

  
  logout() {
    this.router.navigate(['/home']);
  }

  goToPost() {
    this.router.navigate(['/jobpost']);
  }

  editJob(index: number) {
  const job = this.jobs[index];
  // Convertir les données pour correspondre au formulaire
  const jobForForm = {
      jobTitle: job.title,
      employmentType: job.category,
      department: job.department,
      workMode: job.mode,
      country: job.country,
      city: job.city,
      numberOfOpenings: job.openings,
      experience: job.experience,
      applicationDeadline: job.deadline,  // This is the critical mapping
      jobDescription: job.description,
      skillsAndQualifications: job.skills.split(',').map((skill: string) => skill.trim()),
      whyJoinUs: job.joinus,
      minSalary: job.salaryMin,
      maxSalary: job.salaryMax
  };
  
  this.jobService.setJobToEdit(job, index);
  this.jobService.setEditMode(true);
  this.router.navigate(['/jobpost']);
}

  // recruiter-dashboard.component.ts
toggleStatus(index: number) {
  const job = this.jobs[index];
  
  // Don't allow status change if deadline passed
  if (this.isDeadlinePassed(job.deadline)) {
    this.showErrorToast('Cannot change status - job deadline has passed');
    return;
  }

  const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
  
  this.jobService.updateJobStatus(job.id, newStatus).subscribe({
    next: () => {
      job.status = newStatus;
      this.showSuccessToast('Status updated successfully');
    },
    error: (err) => {
      console.error('Error updating status:', err);
      this.showErrorToast(err.message || 'Failed to update status');
    }
  });
}

isDeadlinePassed(deadline: string | Date): boolean {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const today = new Date();
  return deadlineDate < today;
}

loadJobs() {
  this.isLoading = true;
  this.jobService.getJobs().subscribe({
    next: (data) => {
      this.jobs = data.map(job => {
        // Auto-close jobs with passed deadline
        if (this.isDeadlinePassed(job.deadline) && job.status !== 'Closed') {
          this.jobService.updateJobStatus(job.id, 'Closed').subscribe({
            next: () => job.status = 'Closed',
            error: (err) => console.error('Error auto-closing job:', err)
          });
        }
        return job;
      });
      
      this.jobs.forEach(job => this.loadApplicationCount(job));
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading jobs:', err);
      this.isLoading = false;
    }
  });
}

// Méthode pour mettre à jour le statut d'une candidature
updateApplicationStatus(applicationId: number, newStatus: string) {
  this.jobApplicationService.updateApplicationStatus(applicationId, newStatus).subscribe({
    next: (updatedApp) => {
      // 1. Mettre à jour localement
      const application = this.applications.find(app => app.id === applicationId);
      if (application) {
        application.status = newStatus;
      }

      // 2. Notifier les autres composants (dont jobseeker-dashboard)
      this.jobApplicationService.notifyStatusChange({
        applicationId,
        newStatus
      });

      this.showSuccessToast('Statut mis à jour avec succès');
    },
    error: (err) => {
      console.error('Erreur de mise à jour:', err);
      this.showErrorToast('Échec de la mise à jour du statut');
    }
  });
}

// Exemple d'appel depuis le template
changeStatus(applicationId: number, newStatus: string) {
  if (confirm('Confirmez le changement de statut ?')) {
    this.updateApplicationStatus(applicationId, newStatus);
  }
}

  toggleMenu(index: number) {
    this.jobs.forEach((job, i) => job.showMenu = i === index ? !job.showMenu : false);
  }

async deleteJob(index: number) {
  const job = this.jobs[index];
  
  if (!job?.id) {
    console.error('Missing job ID');
    return;
  }

  try {
    const confirmed = await this.showConfirmationDialog(
      `Delete offer"${job.title}" ?`,
      'This action is irreversible'
    );
    
    if (!confirmed) return;

    this.isDeleting = true;
    
    this.jobService.deleteJob(job.id).subscribe({
      next: () => {
        this.jobs.splice(index, 1);
        this.showSuccessToast('Offer successfully removed');
      },
      error: (err) => {
        console.error('Error details:', err);
        this.showErrorToast(
          err.message || 'Deletion failed. Please try again.'
        );
      },
      complete: () => this.isDeleting = false
    });
    
  } catch (err) {
    console.error('Erreur inattendue:', err);
    this.isDeleting = false;
  }
}

// Méthodes utilitaires (à implémenter ou utiliser un service dédié)
private showConfirmationDialog(title: string, message: string): Promise<boolean> {
  return new Promise(resolve => {
    // Utilisez une librairie de dialogue ou window.confirm
    resolve(window.confirm(`${title}\n${message}`));
  });
}

private showSuccessToast(message: string) {
  // Implémentez avec ToastService ou autre
  alert('SUCCESS: ' + message);
}

private showErrorToast(message: string) {
  alert('ERROR: ' + message);
}

  updateStatusByDeadline(job: any) {
    const today = new Date();
    const deadlineDate = new Date(job.deadline);
    if (deadlineDate < today) {
      job.status = 'Closed';
    }
  }

   selectedJob: any = null;  // job sélectionné pour modal

  viewDetail(index: number) {
    this.jobs.forEach(job => job.showMenu = false);
    this.selectedJob = this.jobs[index];
  }

  viewApplications(jobId: string) {
  this.router.navigate(['/application', jobId]);
  //this.router.navigate(['/application']);
}

goToSettings() {
    this.router.navigate(['/recruiter-settings']);
  }

  closeModal() {
    this.selectedJob = null;
  }
}
