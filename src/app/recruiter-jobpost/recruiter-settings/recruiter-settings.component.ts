import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-recruiter-settings',
  templateUrl: './recruiter-settings.component.html',
  styleUrls: ['./recruiter-settings.component.scss']
})
export class RecruiterSettingsComponent {
showProfileMenu = false;
  companyName = '';
  companyDescription = '';
  organizationType = '';
  industryType = '';
  establishmentYear: string = '';
  companyWebsite = '';
  companyVision = '';
  facebook = '';
  twitter = '';
  linkedin = '';
  location = '';
  phone = '';
  email = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  selectedLogo: File | null = null;

  organizationTypes = ['Startup', 'NGO', 'Corporation', 'Freelance'];
  industryTypes = ['Tech', 'Education', 'Health', 'Finance'];

  onLogoSelected(event: any) {
    this.selectedLogo = event.target.files[0];
    console.log('Logo selected:', this.selectedLogo?.name);
  }

  saveChanges() {
    console.log('Saving recruiter settings...');
    // 👉 ici tu envoies les données au backend
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete this recruiter account?')) {
      console.log('Deleting recruiter account...');
    }
  }



constructor(private router: Router) {}


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
