import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedDataService } from '../services/shared-data.service';
import { EmailCheckService } from '../services/email-check.service'; // <-- Ajoutez ceci
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  loginForm: FormGroup;
  currentLanguage = 'English';
  showLanguageDropdown = false;
  emailChecking = false;
  emailExists = false; // <-- Nouvelle propriété pour suivre l'état de l'email

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private router: Router, // ✅ c’est le bon service
    private sharedData: SharedDataService,
    private emailCheckService: EmailCheckService // <-- Ajoutez ceci

  ) {
    this.loginForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

   this.setupEmailCheck();

    translate.setDefaultLang('en');
    translate.use('en');
  }
  

  private setupEmailCheck(): void {
    this.loginForm.get('email')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.emailChecking = true),
      switchMap(email => {
        if (!email || !this.loginForm.get('email')?.valid) {
          this.emailExists = false;
          this.emailChecking = false;
          return of(false);
        }
        return this.emailCheckService.checkEmailExists(email).pipe(
          tap(exists => {
            this.emailExists = exists;
            this.emailChecking = false;
          }),
          catchError(() => {
            this.emailChecking = false;
            return of(false);
          })
        );
      })
    ).subscribe();
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
     if (this.loginForm.invalid || this.emailExists) {
      return;
    }
      
      this.sharedData.setData('register', {
        nom: this.loginForm.value.nom,
        email: this.loginForm.value.email,
        motDePasse: this.loginForm.value.password
      });
      
      console.log('Registration data saved:', this.loginForm.value);
      alert('Registration successful! Redirecting...');
      this.router.navigate(['/welcom']);
    }
  }

