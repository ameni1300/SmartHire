import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecruiterService } from '../services/recruiter.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Ajoutez cette ligne

@Component({
  selector: 'app-recruiter-settings',
  templateUrl: './recruiter-settings.component.html',
  styleUrls: ['./recruiter-settings.component.scss']
})
export class RecruiterSettingsComponent implements OnInit {
  showProfileMenu = false;
  userId: number | null = null;
  isLoading = false;
  settingsForm: FormGroup;
  passwordForm: FormGroup;

  organizationTypes = ['Startup', 'NGO', 'Corporation', 'Freelance'];
  industryTypes = ['Tech', 'Education', 'Health', 'Finance'];
  selectedLogo: File | null = null;

  constructor(
    private router: Router,
    private recruiterService: RecruiterService,
    private fb: FormBuilder,
    private authService: AuthService // Ajoutez cette ligne
  ) {
    this.settingsForm = this.fb.group({
      companyName: ['', Validators.required],
      companyDescription: [''],
      organizationType: ['', Validators.required],
      industryType: ['', Validators.required],
      yearOfEstablishment: [''],
      companyWebsite: [''],
      companyVision: [''],
      facebook: [''],
      twitter: [''],
      linkedin: [''],
      github: [''],
      location: [''],
      phone: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.userId = Number(localStorage.getItem('userId'));
    if (this.userId) {
      this.loadSettings();
    }
  }

  loadSettings() {
    if (!this.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.recruiterService.getRecruiterSettings(this.userId).subscribe({
      next: (data) => {
        this.settingsForm.patchValue(data);
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          alert('Compte non trouvé, déconnexion en cours...');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          console.error('Erreur chargement paramètres:', err);
          alert('Erreur lors du chargement des paramètres');
        }
        this.isLoading = false;
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onLogoSelected(event: any) {
    this.selectedLogo = event.target.files[0];
  }

  saveSettings() {
    if (this.settingsForm.valid && this.userId) {
      this.isLoading = true;
      const formData = new FormData();
      
      Object.keys(this.settingsForm.value).forEach(key => {
        formData.append(key, this.settingsForm.value[key]);
      });

      if (this.selectedLogo) {
        formData.append('companyLogo', this.selectedLogo);
      }

      this.recruiterService.updateRecruiterSettings(this.userId, formData).subscribe({
        next: () => {
          alert('Paramètres mis à jour avec succès !');
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erreur mise à jour paramètres:', err);
          alert('Erreur lors de la mise à jour des paramètres');
          this.isLoading = false;
        }
      });
    }
  }

  updatePassword() {
    if (this.passwordForm.valid && this.userId) {
      this.isLoading = true;
      const { currentPassword, newPassword } = this.passwordForm.value;

      this.recruiterService.updatePassword(this.userId, { currentPassword, newPassword }).subscribe({
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

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      this.isLoading = true;
      this.recruiterService.deleteRecruiterAccount(this.userId!).subscribe({
        next: () => {
          localStorage.removeItem('userId');
          localStorage.removeItem('token');
          alert('Account successfully deleted');
          this.router.navigate(['/home']).then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          console.error('Erreur suppression compte:', err);
          alert(err.message || 'Error deleting account');
          this.isLoading = false;
        }
      });
    }
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

  goToProfile() {
    this.router.navigate(['/recruiter-profil']);
  }
}