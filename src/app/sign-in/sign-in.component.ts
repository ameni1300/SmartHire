import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
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
   errorMessage: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private authService: AuthService
  ) {
     this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      userType: ['jobseeker', Validators.required] // Ajout du champ userType
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
    this.loading = true;
    this.errorMessage = null;
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 404) {
          this.errorMessage = 'Utilisateur non trouvé';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }
}
}