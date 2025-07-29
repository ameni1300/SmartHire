import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { EmailCheckService } from '../services/email-check.service';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgetpassword',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.scss']
})
export class ForgetpasswordComponent {
  forgotPasswordForm: FormGroup;
  verificationForm: FormGroup;
  newPasswordForm: FormGroup;

  showVerificationCode = false;
  showNewPasswordForm = false;
  isSubmitting = false;
  isVerifying = false;
  emailChecking = false;
  emailExists = false;
  successMessage = '';
  errorMessage = '';
  currentEmail = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private emailCheckService: EmailCheckService
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.verificationForm = this.fb.group({
      verificationCode: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('newPassword')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.forgotPasswordForm.invalid) return;

    this.isSubmitting = true;
    this.currentEmail = this.forgotPasswordForm.value.email;

    this.emailCheckService.checkEmailExists(this.currentEmail).subscribe({
      next: (exists) => {
        if (exists) {
          this.authService.sendVerificationCode(this.currentEmail).subscribe({
            next: () => {
              this.showVerificationCode = true;
              this.successMessage = 'Verification code sent to your email';
              this.errorMessage = '';
              this.isSubmitting = false;
            },
            error: (err) => {
              this.errorMessage = 'Failed to send verification code';
              this.isSubmitting = false;
              console.error(err);
            }
          });
        } else {
          this.errorMessage = 'Email not found in our system';
          this.isSubmitting = false;
        }
      },
      error: (err) => {
        this.errorMessage = 'Error checking email';
        this.isSubmitting = false;
        console.error(err);
      }
    });
  }

 verifyCode() {
    if (this.verificationForm.invalid) return;

    this.isVerifying = true;
    const code = this.verificationForm.value.verificationCode;

    this.authService.verifyCode(this.currentEmail, code).subscribe({
        next: (response: any) => {  // Modifié ici
            if (response.valid) {
                this.showNewPasswordForm = true;
                this.successMessage = 'Code verified successfully';
            } else {
                this.errorMessage = 'Invalid verification code';
            }
            this.isVerifying = false;
        },
        error: (err) => {
            this.errorMessage = 'Error verifying code';
            this.isVerifying = false;
        }
    });
}

  resetPassword() {
    if (this.newPasswordForm.invalid) return;

    const newPassword = this.newPasswordForm.value.newPassword;
    
    this.authService.resetPassword(this.currentEmail, newPassword).subscribe({
      next: () => {
        this.successMessage = 'Password reset successfully';
        this.errorMessage = '';
        this.showNewPasswordForm = false;

        this.router.navigate(['/signin']);
        // Rediriger vers la page de connexion
      },
      error: (err) => {
        this.errorMessage = 'Failed to reset password';
        console.error(err);
      }
    });
  }
}