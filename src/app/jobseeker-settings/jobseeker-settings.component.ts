import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobseekerService } from '../services/jobseeker.service';
import { AuthService } from '../services/auth.service';
import { ResumeService } from '../services/resume.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-jobseeker-settings',
  templateUrl: './jobseeker-settings.component.html',
  styleUrls: ['./jobseeker-settings.component.scss']
})
export class JobseekerSettingsComponent implements OnInit {
  showProfileMenu = false;
  isLoading = true;
  userId: number | null = null;
  showPhotoPopup = false;
  selectedFile: File | undefined; // Au lieu de File | null
  selectedResumeId: number | null = null;
  resumes: any[] = [];
  passwordForm: FormGroup;
  

  // Données du formulaire
  jobseeker = {
    photoUrl: '../../assets/imgprof.png',
    nom: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bio: '',
    personalMessage: '',
    website: '',
    phone: '',
    location: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
    experience: '',
    education: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    github: '',
    cvName: '',
    cvUrl: '',
    headline:''
  };

  constructor(
    private router: Router,
    private jobseekerService: JobseekerService,
    private authService: AuthService,
    private resumeService: ResumeService,
    private fb: FormBuilder

  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.loadJobseekerProfile();
    }
  }

   passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  updatePassword() {
    if (this.passwordForm.valid && this.userId) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.jobseekerService.updatePassword(this.userId, currentPassword, newPassword).subscribe({
        next: () => {
          alert('Mot de passe mis à jour avec succès !');
          this.passwordForm.reset();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur mise à jour mot de passe:', err);
          alert(err.error?.message || 'Erreur lors de la mise à jour du mot de passe');
          this.isLoading = false;
        }
      });
    }
  }

  onCVSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    // Upload the selected CV file
    this.resumeService.uploadResume(this.userId!, file).subscribe({
      next: (response) => {
        alert('CV uploaded successfully!');
        this.jobseeker.cvName = response.fileName; // assuming backend returns this
        this.jobseeker.cvUrl = `http://localhost:8080/Smarthire/api/resumes/download/${response.id}`;
      },
      error: () => alert('Failed to upload CV')
    });
  }
}



downloadCV() {
    if (this.jobseeker.cvUrl) {
      window.open(this.jobseeker.cvUrl, '_blank');
    }
  }

selectResume(resume: any) {
    this.selectedResumeId = resume.id;
    this.jobseeker.cvName = resume.fileName;
    this.jobseeker.cvUrl = `${this.resumeService.getBaseUrl()}/download/${resume.id}`;
  }

  // Modified deleteCV method
  deleteCV() {
    if (!this.selectedResumeId) {
        alert('Please select a CV to delete');
        return;
    }

    if (confirm('Are you sure you want to delete the selected CV?')) {
        this.resumeService.deleteResume(this.selectedResumeId).subscribe({
            next: () => {
                alert('CV deleted successfully!');
                this.jobseeker.cvName = '';
                this.jobseeker.cvUrl = '';
                this.selectedResumeId = null;
                this.loadResume();
            },
            error: (err) => {
                if (err.status === 409) {  // Conflict status code
                    alert('Cannot delete this CV because you have used it to apply for jobs. ' + 
                          'Please use another CV for new applications.');
                } else if (err.status === 404) {
                    alert('CV not found - it may have already been deleted');
                } else {
                    console.error('CV delete error:', err);
                    alert('Error deleting CV. Please try again later.');
                }
            }
        });
    }
}


 onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      
      // Prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.jobseeker.photoUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }



togglePhotoPopup() {
  this.showPhotoPopup = !this.showPhotoPopup;
}

  uploadProfilePicture() {
    if (this.selectedFile && this.userId) {
      this.isLoading = true;
      
      this.jobseekerService.uploadProfilePhoto(this.userId, this.selectedFile).subscribe({
        next: (response: any) => {
          // Mettre à jour l'URL de la photo avec un timestamp pour éviter le cache
          this.jobseeker.photoUrl = response.profilePicture + '?t=' + new Date().getTime();
          this.showPhotoPopup = false;
          this.isLoading = false;
          alert('Photo de profil mise à jour avec succès !');
        },
        error: (err) => {
          console.error('Erreur lors de l\'upload de la photo:', err);
          this.isLoading = false;
          alert('Échec de la mise à jour de la photo de profil');
        }
      });
    }
  }

openPhotoViewer() {
  window.open(this.jobseeker.photoUrl, '_blank');
  this.showPhotoPopup = false;
}



  loadJobseekerProfile() {
    this.jobseekerService.getJobseekerProfile(this.userId!).subscribe({
      next: (data) => {
        this.updateFormData(data);
        this.loadResume();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.isLoading = false;
      }
    });
  }

  loadResume() {
  this.resumeService.getUserResumes(this.userId!).subscribe({
    next: (resumes: any[]) => {
      this.resumes = resumes || []; // Store all resumes
      if (this.resumes.length > 0) {
        // Auto-select the first resume
        this.selectResume(this.resumes[0]);
      }
    },
    error: (err) => {
      console.error('Error loading resumes:', err);
      this.resumes = []; // Ensure empty array on error
    }
  });
}


  updateFormData(profileData: any) {
    this.jobseeker = {
      ...this.jobseeker,
      nom: profileData.nom || profileData.name || '',
      email: profileData.email || '',
      bio: profileData.bio || profileData.biography || '',
      personalMessage: profileData.personalMessage || '',
      website: profileData.website || profileData.portfolioUrl || '',
      phone: profileData.phone || '',
      location: profileData.location || '',
      nationality: profileData.nationality || '',
      gender: profileData.gender || '',
      maritalStatus: profileData.maritalStatus || '',
      experience: profileData.experience || '',
      education: profileData.education || '',
      facebook: profileData.facebook || '',
      twitter: profileData.twitter || '',
      linkedin: profileData.linkedin || '',
      github: profileData.github || '',
      headline: profileData.headline || '',
      photoUrl: profileData.photoUrl || profileData.profilePicture || '../../assets/imgprof.png'
    };

  }


  saveChanges() {
    if (!this.userId) {
      console.error('User ID is null');
      return;
    }

    const updatedData = {
      nom: this.jobseeker.nom,
      email: this.jobseeker.email,
      biography: this.jobseeker.bio,
      personalMessage: this.jobseeker.personalMessage,
      portfolioUrl: this.jobseeker.website,
      phone: this.jobseeker.phone,
      location: this.jobseeker.location,
      nationality: this.jobseeker.nationality,
      gender: this.jobseeker.gender,
      maritalStatus: this.jobseeker.maritalStatus,
      experience: this.jobseeker.experience,
      education: this.jobseeker.education,
      facebook: this.jobseeker.facebook,
      twitter: this.jobseeker.twitter,
      linkedin: this.jobseeker.linkedin,
      github: this.jobseeker.github,
      headline: this.jobseeker.headline,
    };

    this.jobseekerService.updateJobseeker(this.userId, updatedData).subscribe({
      next: () => {
        alert('Changes saved successfully!');
        this.router.navigate(['/profil']);
      },
      error: (err) => {
        console.error('Error saving changes:', err);
        alert('Error saving changes');
      }
    });
  }

 deleteAccount() {
  if (confirm('Are you sure you want to delete your account? All your applications and resumes will also be permanently deleted.')) {
    this.isLoading = true;
    
    this.jobseekerService.deleteJobseeker(this.userId!).subscribe({
      next: (response: any) => {
        this.authService.logout();
        this.router.navigate(['/home']).then(() => {
          alert(response.message || 'Your account has been successfully deleted');
          window.location.reload();
        });
      },
      error: (err) => {
        console.error('Erreur:', err);
        if (err.status === 404) {
          this.authService.logout();
          this.router.navigate(['/home']).then(() => {
            alert('Your account has already been deleted. You have been logged out.');
            window.location.reload();
          });
        } else {
          alert('Échec de la suppression : ' + (err.error?.message || err.message));
        }
        this.isLoading = false;
      }
    });
  }
}

  
   toggleProfileMenu() {
        this.showProfileMenu = !this.showProfileMenu;
    }
  
    goToProfile() {
        // Navigation to profile page
        this.router.navigate(['/profil']);
    }
  
    goToSettings() {
        // Navigation to settings page
        this.router.navigate(['/settings']);
    }
  
    logout() {
        this.router.navigate(['/home']);
    }
  
    goToSearch() {
        this.router.navigate(['/jobseeker-jobsearch']);
    }

    goToDashboard() {
        this.router.navigate(['/dashboard']);
    }

}

