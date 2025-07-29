import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  loginForm: FormGroup;
  currentLanguage = 'English';
  showLanguageDropdown = false;

  constructor(
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