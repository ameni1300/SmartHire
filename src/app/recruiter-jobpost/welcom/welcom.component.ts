import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';


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
    this.router.navigate(['/jobseeker-personal']);
  }

  navigateToRecruiter() {
    this.selectedCard = 'recruiter';
    this.router.navigate(['/recruiter-company']); // Remplacez par votre route réelle
  }
  loginForm: FormGroup;
  currentLanguage = 'English';
  showLanguageDropdown = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Configuration de la langue par défaut
    translate.setDefaultLang('en');
    translate.use('en');
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

