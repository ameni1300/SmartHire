import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobApplicationService } from '../services/job-application.service';
import { JobService } from '../services/job.service';
import { JobseekerService } from '../services/jobseeker.service';
import { ResumeService } from '../services/resume.service';

@Component({
  selector: 'app-jobseeker-jobsearch',
  templateUrl: './jobseeker-jobsearch.component.html',
  styleUrls: ['./jobseeker-jobsearch.component.scss']
})
export class JobseekerJobsearchComponent implements OnInit {
  // Filtres
  searchTitle: string = '';
  selectedCategories: string[] = [];
  selectedJobTypes: string[] = [];
  minSalary: number = 0;
  maxSalary: number = 120000;
  selectedCountry: string = '';

  // Modal state
  applicationStep: number = 0; // 0 = fermé, 1 = détails job, 2 = formulaire
  selectedJob: any = null;
  isSubmitting: boolean = false;

  // Formulaire
  nom: string = '';
  coverLetter: string = '';
  cvOption: 'existing' | 'new' = 'existing';
  selectedExistingCv: number | null = null;
  savedCvs: any[] = [];
  selectedFile: File | null = null;

  // Données utilisateur
  userId = Number(localStorage.getItem('userId'));
  tags: string[] = [];
  loadingTags = true;

  // Catégories
  categories: string[] = [
    'Commerce', 'Telecommunications', 'Hotels & Tourism', 'Education',
    'Financial Services', 'IT & Software', 'Healthcare', 'Engineering',
    'Legal', 'Logistics', 'Real Estate'
  ];
  visibleCategories: string[] = [];
  showAllCategories = false;

  // Jobs
  allJobs: any[] = [];
  filteredJobs: any[] = [];
  pagedJobs: any[] = [];

  // Pagination
  itemsPerPage = 12;
  currentPage = 1;
  pages: number[] = [];
  totalPages = 0;

  // Liste des pays
  countries: string[] = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Argentina', 'Australia',
    'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Belgium', 'Brazil', 'Canada',
    'China', 'France', 'Germany', 'India', 'Italy', 'Japan', 'Mexico', 'Morocco',
    'Netherlands', 'Portugal', 'Russia', 'Saudi Arabia', 'South Africa', 'Spain',
    'Switzerland', 'Tunisia', 'United Arab Emirates', 'United Kingdom', 'United States'
  ];

  constructor(
    private router: Router,
    private jobApplicationService: JobApplicationService,
    private jobService: JobService,
    private jobseekerService: JobseekerService,
    private resumeService: ResumeService
  ) {}

  ngOnInit() {
    this.visibleCategories = this.categories.slice(0, 5);
    this.loadJobseekerData(this.userId);
    this.loadJobs();
    this.loadSavedCvs();
  }

  loadJobseekerData(userId: number): void {
    this.jobseekerService.getJobseekerById(userId).subscribe({
      next: (data) => {
        this.nom = data.nom || 'Utilisateur';
        this.tags = data.tags || [];
        this.loadingTags = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement:", err);
        this.tags = [];
        this.loadingTags = false;
      }
    });
  }

loadJobs(): void {
  this.jobService.getJobsForListing().subscribe({
    next: (jobs) => {
       console.log('Jobs reçus:', jobs); 
      // Filtrer dès le chargement initial
      this.allJobs = jobs.filter(job =>
  !['Closed', 'Active', 'Expired', 'Expire'].includes(job.status) && !this.isJobExpired(job));

      this.filteredJobs = [...this.allJobs];
      this.setupPagination();
    },
    error: (err) => {
      console.error('Erreur lors du chargement des jobs:', err);
    }
  });
}

private isJobExpired(job: any): boolean {
  if (!job.deadline) return false;
  
  try {
    const deadlineDate = new Date(job.deadline);
    const today = new Date();
    return deadlineDate < today;
  } catch (e) {
    console.error('Error parsing deadline:', job.deadline, e);
    return false;
  }
}

  loadSavedCvs(): void {
    if (this.userId) {
      this.resumeService.getUserResumes(this.userId).subscribe({
        next: (cvs) => {
          this.savedCvs = cvs.map(cv => ({
            id: cv.id,
            name: cv.fileName,
            uploadDate: cv.uploadDate || new Date()
          }));
          
          if (this.savedCvs.length > 0) {
            this.selectedExistingCv = this.savedCvs[0].id;
          }
        },
        error: (err) => {
          console.error('Error loading CVs:', err);
          this.savedCvs = [];
        }
      });
    }
  }

  // Méthodes pour les filtres
  onCategoryChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedCategories.push(value);
    } else {
      this.selectedCategories = this.selectedCategories.filter(cat => cat !== value);
    }
    this.applyFilters();
  }

  onJobTypeChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedJobTypes.push(value);
    } else {
      this.selectedJobTypes = this.selectedJobTypes.filter(type => type !== value);
    }
    this.applyFilters();
  }

  private getSalaryValue(kValue: number): number {
  return kValue * 1000; // Convertit 35K en 35000
}
applyFilters(): void {

  this.filteredJobs = this.allJobs.filter(job => {
    // Pas besoin de vérifier le statut ici car déjà filtré dans loadJobs()
    
    const matchesTitle = this.searchTitle === '' || 
                       job.title.toLowerCase().includes(this.searchTitle.toLowerCase()) || 
                       job.company.toLowerCase().includes(this.searchTitle.toLowerCase());
    
    const matchesCountry = this.selectedCountry === '' || 
                         job.location.toLowerCase().includes(this.selectedCountry.toLowerCase());
    
     const matchesCategory = this.selectedCategories.length === 0 || 
                          (job.category && this.selectedCategories.some(
                            cat => job.category.toLowerCase() === cat.toLowerCase()));
    
    // Filtre par type (employmentType)
    const matchesType = this.selectedJobTypes.length === 0 || 
                        (job.type && this.selectedJobTypes.some(
                          type => job.type.toLowerCase() === type.toLowerCase()));

     let matchesSalary = true;
    if (this.minSalary > 0 || this.maxSalary < 12000) {
      try {
        // Convertit les valeurs des sliders en valeurs brutes
        const filterMin = this.getSalaryValue(this.minSalary);
        const filterMax = this.getSalaryValue(this.maxSalary);
        
        // Utilise les valeurs brutes du job
        const jobMin = job.minSalary || 0;
        const jobMax = job.maxSalary || 0;
        
        // Vérifie le chevauchement des fourchettes
        matchesSalary = (jobMax >= filterMin) && (jobMin <= filterMax);
      } catch (e) {
        console.error('Erreur de filtre salaire:', e);
        matchesSalary = false;
      }
    }
    
    return matchesTitle && matchesCountry && matchesCategory && matchesType && matchesSalary;
  });
  
  this.currentPage = 1;
  this.setupPagination();
}

  // Méthodes pour les catégories
  toggleCategories(): void {
    this.showAllCategories = !this.showAllCategories;
    this.visibleCategories = this.showAllCategories ? this.categories : this.categories.slice(0, 5);
  }

  // Méthodes de pagination
  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updatePage();
  }

  updatePage(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedJobs = this.filteredJobs.slice(start, end);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePage();
    }
  }

  goToPreviousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  // Méthodes pour les modales
  openModal(job: any): void {
    this.jobService.getJobDetails(job.id).subscribe({
      next: (jobDetails) => {
        this.selectedJob = jobDetails;
        this.applicationStep = 1;
      },
      error: (err) => {
        console.error('Error loading job details:', err);
        this.selectedJob = job;
        this.applicationStep = 1;
      }
    });
  }

  closeModal(): void {
    this.applicationStep = 0;
    this.selectedJob = null;
    this.resetForm();
  }

  applyForJob(): void {
    this.applicationStep = 2;
  }

  // Méthodes pour le formulaire
  onCvOptionChange(option: 'existing' | 'new'): void {
    this.cvOption = option;
  }

  handleFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['application/pdf', 'application/msword', 
                         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024;

      if (file.size > maxSize) {
        alert('File size exceeds 5MB limit');
        return;
      }

      if (!validTypes.includes(file.type)) {
        alert('Only PDF, DOC and DOCX files are allowed');
        return;
      }

      this.selectedFile = file;
    }
  }

  previewCv(cvId: number): void {
    const downloadUrl = this.resumeService.getDownloadUrl(cvId);
    window.open(downloadUrl, '_blank');
  }

submitForm(): void {
  if (this.isSubmitting) return;
  
  if (!this.validateForm()) {
    return;
  }

  this.isSubmitting = true;

  const applicationData = {
    jobseekerId: this.userId,
    jobId: this.selectedJob.id,
    fullName: this.nom,
    coverLetter: this.coverLetter,
    cvOption: this.cvOption,
    cvId: this.cvOption === 'existing' ? this.selectedExistingCv : null
  };

  this.jobApplicationService.submitApplication(
    applicationData,
      this.cvOption === 'new' && this.selectedFile ? this.selectedFile : undefined
  ).subscribe({
    next: () => {
      this.isSubmitting = false;
      this.showSuccess('Application submitted successfully!');
      this.closeModal();
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      this.isSubmitting = false;
      this.showError(error);
    }
  });
}

private showError(message: string): void {
  // Utilisez un toast/snackbar ou une alerte plus élégante
  alert(message);
}

private showSuccess(message: string): void {
  alert(message);
}

  private validateForm(): boolean {
    if (!this.nom || !this.coverLetter) {
      alert('Please fill all required fields');
      return false;
    }

    if (this.cvOption === 'existing' && !this.selectedExistingCv) {
      alert('Please select a CV from your profile');
      return false;
    }

    if (this.cvOption === 'new' && !this.selectedFile) {
      alert('Please upload a CV file');
      return false;
    }

    return true;
  }

  private resetForm(): void {
    this.nom = '';
    this.coverLetter = '';
    this.selectedFile = null;
    this.cvOption = 'existing';
    this.selectedExistingCv = this.savedCvs.length > 0 ? this.savedCvs[0].id : null;
    this.isSubmitting = false;
  }

  // Navigation
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  showProfileMenu = false;

  toggleProfileMenu(): void {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goToProfile(): void {
    this.router.navigate(['/profil']);
  }

  goToSettings(): void {
    this.router.navigate(['/jobseeker-setting']);
  }

  logout(): void {
    localStorage.removeItem('userId');
    this.router.navigate(['/home']);
  }
}