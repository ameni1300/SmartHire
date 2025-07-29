import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { JobApplicationService } from '../services/job-application.service'; // Importez votre service

@Component({
  selector: 'app-recruiter-applications',
  templateUrl: './recruiter-applications.component.html',
  styleUrls: ['./recruiter-applications.component.scss']
})
export class RecruiterApplicationsComponent implements OnInit {
 showProfileMenu = false;
  selectedApplicant: any = null;
  jobId!: string;
  applications: any[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private jobApplicationService: JobApplicationService // Injectez le service
  ) {}

  // Modifiez ngOnInit comme ceci :
ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.jobId = params['id'];
    if (this.jobId) {
      this.loadApplications();
    } else {
      this.errorMessage = 'No job ID provided';
      this.isLoading = false;
    }
  });
}
  
loadApplications(): void {
  this.isLoading = true;
  this.errorMessage = '';
  
  this.jobApplicationService.getApplicationsByJob(this.jobId).subscribe({
    next: (applications) => {
      this.applications = applications;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('Error loading applications:', error);
      this.errorMessage = 'Failed to load applications. Please try again later.';
      this.isLoading = false;
    }
  });
}
  
  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goToProfile() {
    this.router.navigate(['/recruiter-profil']);
  }

  goToSettings() {
    this.router.navigate(['/recruiter-settings']);
  }


  goToDashboard() {
    this.router.navigate(['/recruiter-dash']);
  }
  
  logout() {
    this.router.navigate(['/home']);
  }

  goToPost() {
    this.router.navigate(['/jobpost']);
  }

}
