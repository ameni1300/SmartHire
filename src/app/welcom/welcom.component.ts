import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';



@Component({
  selector: 'app-welcom',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './welcom.component.html',
  styleUrls: ['./welcom.component.scss']
})
export class WelcomComponent {
    selectedCard: string = '';

  

  navigateToJobSeeker() {
  this.selectedCard = 'jobSeeker';
  this.sharedData.setData('userType', 'jobSeeker');
  console.log('User type set to Job Seeker');
  this.router.navigate(['/jobseeker-personal']);
}

navigateToRecruiter() {
  this.selectedCard = 'recruiter';
  this.sharedData.setData('userType', 'recruiter');
  console.log('User type set to Recruiter');
  this.router.navigate(['/recruiter-company']);
}

  loginForm: FormGroup;
  currentLanguage = 'English';
  showLanguageDropdown = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService,
    private sharedData: SharedDataService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Configuration de la langue par défaut
    translate.setDefaultLang('en');
    translate.use('en');

    
  // Vérifier si les données d'inscription existent
  if (!this.sharedData.getData('register')) {
    alert('Please complete registration first');
    this.router.navigate(['/register']);
  }

}

  toggleLanguageDropdown(): void {
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  changeLanguage(lang: string): void {
    this.currentLanguage = lang;
    this.showLanguageDropdown = false;
    this.translate.use(lang === 'Français' ? 'fr' : 'en');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Form submitted:', this.loginForm.value);
      // Ici vous pourrez ajouter l'appel à votre service d'authentification
    }
  }
}

