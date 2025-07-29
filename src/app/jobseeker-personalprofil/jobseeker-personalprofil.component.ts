import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobseekerService } from '../services/jobseeker.service';
import { AuthService } from '../services/auth.service';
import { ResumeService } from '../services/resume.service';

export interface ResumeDto {
  id: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
  jobseekerId: number;
}


@Component({
  selector: 'app-jobseeker-personalprofil',
  templateUrl: './jobseeker-personalprofil.component.html',
  styleUrls: ['./jobseeker-personalprofil.component.scss']
})
export class JobseekerPersonalprofilComponent implements OnInit {
  showProfileMenu = false;
  isLoading = true;
  userId: number | null = null;
    resumes: any[] = [];
  loadingResumes = false;

    savedCvs: any[] = [];

  selectedExistingCv: number | null = null;


   jobseeker = {
  photoUrl: '../../assets/imgprof.png',
  nom: '',
  headline: '',
  email: '',
  bio: '',
  personalMessage: '',
  resumeUrl: '',
  resumeName: 'MyResume.pdf',
  website: '',
  skills: [] as string[]
};


  personalDetails = [
    { label: 'Birthday', value: '', icon: 'fas fa-birthday-cake' },
    { label: 'Nationality', value: '', icon: 'fas fa-globe' },
    { label: 'Location', value: '', icon: 'fas fa-map-marker-alt' },
    { label: 'Gender', value: '', icon: 'fas fa-user' }
  ];

  professionalDetails = [
    { label: 'Experience', value: '', icon: 'fas fa-briefcase' },
    { label: 'Education', value: '', icon: 'fas fa-graduation-cap' },
    { label: 'Skills', value: '', icon: 'fas fa-code' },
    { label: 'Phone', value: '', icon: 'fas fa-phone' }
  ];

  socialLinks = [
    { name: 'LinkedIn', url: '', icon: 'fab fa-linkedin' },
    { name: 'GitHub', url: '', icon: 'fab fa-github' },
    { name: 'Twitter', url: '', icon: 'fab fa-twitter' },
    { name: 'Facebook', url: '', icon: 'fab fa-facebook' }
  ];

  constructor(
    private router: Router,
    private jobseekerService: JobseekerService,
    private authService: AuthService,
    private resumeService : ResumeService
  ) {}

  loadSavedCvs(): void {
  if (this.userId) {
    this.loadingResumes = true; // Active le loading
    this.resumeService.getUserResumes(this.userId).subscribe({
      next: (cvs) => {
        this.resumes = cvs.map(cv => ({
          id: cv.id,
          name: cv.fileName,
          uploadDate: new Date(cv.uploadDate) // Convertit en Date si nécessaire
        }));
        this.loadingResumes = false;
      },
      error: (err) => {
        console.error('Error loading CVs:', err);
        this.resumes = []; // Réinitialise le tableau
        this.loadingResumes = false;
      }
    });
  }
}

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.loadJobseekerProfile();
      this.loadSavedCvs();

    }
  }


   loadJobseekerProfile() {
    this.jobseekerService.getJobseekerProfile(this.userId!).subscribe({
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
    this.jobseeker = {
      photoUrl: profileData.photoUrl,
      nom: profileData.nom,
      headline: profileData.headline,
      email: profileData.email,
      bio: profileData.bio,
      personalMessage: profileData.personalMessage,
      resumeUrl: profileData.resumeUrl,
      resumeName: profileData.resumeName,
      website: profileData.website,
      skills: profileData.skills || []
    };

    this.personalDetails = [
      { label: 'Date of Birth', 
        value: profileData.birthday ? new Date(profileData.birthday).toLocaleDateString() : 'Not specified', 
        icon: 'fas fa-birthday-cake' },
      { label: 'Nationality', 
        value: profileData.nationality || 'Not specified', 
        icon: 'fas fa-globe' },
      { label: 'Location', 
        value: profileData.location || 'Not specified', 
        icon: 'fas fa-map-marker-alt' },
      { label: 'Marital Status', 
        value: profileData.maritalStatus || 'Not specified', 
        icon: 'fas fa-heart' },
      { label: 'Gender', 
        value: profileData.gender ? this.capitalizeFirstLetter(profileData.gender) : 'Not specified', 
        icon: 'fas fa-user' }
    ];

    this.professionalDetails = [
      { label: 'Experience', 
        value: profileData.experience || 'Not specified', 
        icon: 'fas fa-briefcase' },
      { label: 'Education', 
        value: profileData.education || 'Not specified', 
        icon: 'fas fa-graduation-cap' },
      { label: 'Phone', 
        value: profileData.phone || 'Not specified', 
        icon: 'fas fa-phone' }
    ];

    this.socialLinks = [
      { name: 'LinkedIn', url: profileData.linkedin || '#', icon: 'fab fa-linkedin' },
      { name: 'GitHub', url: profileData.github || '#', icon: 'fab fa-github' },
      { name: 'Twitter', url: profileData.twitter || '#', icon: 'fab fa-twitter' },
      { name: 'Facebook', url: profileData.facebook || '#', icon: 'fab fa-facebook' }
    ];
  }
  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  goToSettings() {
    this.router.navigate(['/jobseeker-setting']);
  }

  logout() {
    this.authService.logout();
  }

  goToSearch() {
    this.router.navigate(['/jobseeker-jobsearch']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

 downloadResume(resumeId: number) {
  this.resumeService.downloadResume(resumeId).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${resumeId}.pdf`; // ou utilisez le nom réel du fichier
    a.click();
    window.URL.revokeObjectURL(url);
  });
}
}