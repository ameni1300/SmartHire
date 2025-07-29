import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecruiterService } from '../services/recruiter.service';

@Component({
  selector: 'app-recruiter-accountprofile',
  templateUrl: './recruiter-accountprofile.component.html',
  styleUrls: ['./recruiter-accountprofile.component.scss']
})
export class RecruiterAccountprofileComponent {
  showProfileMenu = false;
  isLoading = true;
  userId: number | null = null;

  recruiter = {
    photoUrl: '../../assets/recruiter/recruiter.png',
    name: '',
    email: '',
    bio: '',
    companyName: '',
    website: ''
  };

   additionalDetails = [
    { label: 'Nationality', value: '', icon: 'fas fa-globe' },
    { label: 'Organization Type', value: '', icon: 'fas fa-sitemap' },
    { label: 'Company Vision', value: '', icon: 'fas fa-eye' }
  ];

   socialLinks = [
    { name: 'Facebook', url: '', icon: 'fab fa-facebook' },
    { name: 'Twitter', url: '', icon: 'fab fa-twitter' },
    { name: 'LinkedIn', url: '', icon: 'fab fa-linkedin' },
    { name: 'GitHub', url: '', icon: 'fab fa-github' }
  ];

  recruiterDetails = [
    { label: 'Position', value: '', icon: 'fas fa-user-tie' },
    { label: 'Company', value: '', icon: 'fas fa-building' },
    { label: 'Industry', value: '', icon: 'fas fa-network-wired' },
    { label: 'Location', value: '', icon: 'fas fa-map-marker-alt' },
    { label: 'Phone', value: '', icon: 'fas fa-phone' },
    { label: 'Email', value: '', icon: 'fas fa-envelope' },
    { label: 'Joined', value: '', icon: 'fas fa-calendar-check' }
  ];

  constructor(
    private router: Router,
    private recruiterService: RecruiterService
  ) {}

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.loadRecruiterProfile();
    }
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
      photoUrl: profileData.photoUrl,
      name: profileData.name,
      email: profileData.email,
      bio: profileData.bio,
      companyName: profileData.companyName,
      website: profileData.website
    };

    this.recruiterDetails = [
      { label: 'Position', value: profileData.position, icon: 'fas fa-user-tie' },
      { label: 'Company', value: profileData.companyName, icon: 'fas fa-building' },
      { label: 'Industry', value: profileData.industry, icon: 'fas fa-network-wired' },
      { label: 'Location', value: profileData.location, icon: 'fas fa-map-marker-alt' },
      { label: 'Phone', value: profileData.phone, icon: 'fas fa-phone' },
      { label: 'Company Email', value: profileData.companyEmail, icon: 'fas fa-envelope' },
      { label: 'Joined', value: profileData.joinDate, icon: 'fas fa-calendar-check' }
    ];

    // Update additional details
    this.additionalDetails = [
      { label: 'Nationality', value: profileData.nationality || 'Not specified', icon: 'fas fa-globe' },
      { label: 'Organization Type', value: profileData.organizationType || 'Not specified', icon: 'fas fa-sitemap' },
      { label: 'Company Vision', value: profileData.companyVision || 'Not specified', icon: 'fas fa-eye' }
    ];

    // Update social links
    this.socialLinks = [
      { name: 'Facebook', url: profileData.facebook || '#', icon: 'fab fa-facebook' },
      { name: 'Twitter', url: profileData.twitter || '#', icon: 'fab fa-twitter' },
      { name: 'LinkedIn', url: profileData.linkedin || '#', icon: 'fab fa-linkedin' },
      { name: 'GitHub', url: profileData.github || '#', icon: 'fab fa-github' }
    ];
  }


  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
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


