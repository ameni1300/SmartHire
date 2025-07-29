import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { SharedDataService } from '../services/shared-data.service';
import { JobseekerService } from '../services/jobseeker.service';

@Component({
  selector: 'app-jobseeker-accountsettings',
  templateUrl: './jobseeker-accountsettings.component.html',
  styleUrls: ['./jobseeker-accountsettings.component.scss']
})
export class JobseekerAccountsettingsComponent {
  accountForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sharedData: SharedDataService,
    private jobseekerService: JobseekerService,
    private router: Router
  ) {
    this.accountForm = this.fb.group({
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      portfolioUrl: ['', Validators.pattern(/^(http|https):\/\/[^ "]+$/)]
    });

    this.verifyPreviousSteps();
  }

  private verifyPreviousSteps(): void {
    const requiredSteps: Array<'register' | 'userType' | 'personal' | 'social'> = ['register', 'userType', 'personal', 'social'];
    const missingSteps = requiredSteps.filter(step => !this.sharedData.getData(step));

    if (missingSteps.length > 0) {
      alert(`Please complete these steps first: ${missingSteps.join(', ')}`);
      this.router.navigate(['/register']);
    }
  }

  onSubmit(): void {
    if (this.accountForm.invalid) {
      this.markFormGroupTouched(this.accountForm);
      return;
    }

    const accountData = this.accountForm.value;
    this.sharedData.setData('account', accountData);

    const completeJobseeker = {
      ...this.sharedData.getData('register'),
      ...this.sharedData.getData('personal'),
      ...this.sharedData.getData('profile'), 
      ...this.sharedData.getData('social'),
      ...accountData,
      role: { id: 1 },
    };

    this.createJobseekerAccount(completeJobseeker);
    this.router.navigate(['/signin']);
  }

  // Modifiez la méthode createJobseekerAccount
private createJobseekerAccount(jobseekerData: any): void {
  const profileData = this.sharedData.getData('profile');
  
  // Récupérez le premier fichier CV
  const cvFile = profileData?.resumes?.[0]?.file;

  if (cvFile) {
    console.log('CV File found:', cvFile.name, cvFile.size, cvFile.type);
  } else {
    console.warn('No CV file available in profile data');
  }

  this.jobseekerService.createJobseekerWithCv(jobseekerData, cvFile).subscribe({
    next: (response) => this.handleSuccess(response),
    error: (error) => this.handleError(error)
  });
}

  private handleSuccess(response: any): void {
    console.log('Account creation success:', response);
    this.sharedData.clearAll();
    alert('Your account has been created successfully!');
    this.router.navigate(['/jobseeker-dashboard']);
  }

  private handleError(error: any): void {
    console.error('Account creation error:', error);
    let errorMessage = 'An error occurred during account creation.';
    
    if (error.status === 409) {
      errorMessage = 'This email is already registered.';
    } else if (error.status === 400) {
      errorMessage = 'Invalid data provided. Please check your information.';
    }

    alert(errorMessage);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: AbstractControl) => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}