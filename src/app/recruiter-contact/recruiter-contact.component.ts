import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';
import { RecruiterService } from '../services/recruiter.service';
@Component({
  selector: 'app-recruiter-contact',
  templateUrl: './recruiter-contact.component.html',
  styleUrls: ['./recruiter-contact.component.scss']
})
export class RecruiterContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(  private fb: FormBuilder,
  private router: Router,
  private sharedData: SharedDataService,
  private recruiterService: RecruiterService
) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      location: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      companyEmail: ['', [Validators.required, Validators.email]]
    });
  }

 onSubmit(): void {
  if (this.contactForm.invalid) {
    this.contactForm.markAllAsTouched();
    return;
  }

  this.sharedData.setData('contact', this.contactForm.value);
  const recruiterData = this.sharedData.getAllData();

  // Un seul appel API
  this.recruiterService.createRecruiter(recruiterData).subscribe({
    next: (res) => {
      console.log('Success:', res);
      alert('Recruiter successfully created!');
      this.router.navigate(['/signin']);
      this.sharedData.clearAll();
    },
    error: (err) => {
      console.error('Error creating recruiter:', err);
      alert(err.message || 'An error occurred during registration');
    }
  });
}
}
