import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RecruiterService } from '../../services/recruiter.service';
import { SharedDataService } from '../../services/shared-data.service';
import { debounceTime, switchMap, map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule, // <-- Ajoutez ceci
    TranslateModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  emailExists = false;
  isCheckingEmail = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private recruiterService: RecruiterService,
    private sharedData: SharedDataService
  ) {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailValidator()]
      ],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      const email = control.value;
      if (!email || email.length < 3) {
        this.emailExists = false;
        return of(null);
      }

      this.isCheckingEmail = true;
      this.emailExists = false;

      return of(email).pipe(
        debounceTime(500),
        switchMap(email => this.recruiterService.checkEmailExists(email)),
        map(exists => {
          this.emailExists = exists;
          return exists ? { emailTaken: true } : null;
        }),
        catchError(() => {
          this.emailExists = true;
          return of({ emailTaken: true });
        }),
        tap(() => this.isCheckingEmail = false)
      );
    };
  }

  onSubmit() {
    if (this.registerForm.invalid || this.emailExists || this.isCheckingEmail) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Utilisation correcte du SharedDataService
    this.sharedData.setData('register', {
      nom: this.registerForm.value.nom,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    });

    this.router.navigate(['/welcome']);
  }
}