import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../services/job.service'; // adapte selon ton projet

@Component({
  selector: 'app-recruiter-jobpost',
  templateUrl: './recruiter-jobpost.component.html',
  styleUrls: ['./recruiter-jobpost.component.scss']
})
export class RecruiterJobpostComponent {
  showProfileMenu = false;
  postJobForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private router: Router, public jobService: JobService) {
    this.postJobForm = this.fb.group({
      title: ['', Validators.required],
      category: ['', Validators.required],
      department: ['', Validators.required],
      mode: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      experience: ['', Validators.required],
      deadline: ['', Validators.required],
      description: ['', Validators.required],
      skills: ['', Validators.required],
      joinus: ['', Validators.required],
      salaryMin: [''],
      salaryMax: [''],
      openings: ['', [Validators.required, Validators.min(1)]],

    });
  }

 
 onSubmit() {
  this.submitted = true;

  if (this.postJobForm.valid) {
    const formData = this.postJobForm.value;
    const jobToEdit = this.jobService.getJobToEdit();

    // Map form fields to backend fields
    const jobData = {
      jobTitle: formData.title,
      employmentType: formData.category,
      department: formData.department,
      workMode: formData.mode,
      country: formData.country,
      city: formData.city,
      numberOfOpenings: formData.openings,
      experience: formData.experience,
      applicationDeadline: formData.deadline,  // This is the critical mapping
      jobDescription: formData.description,
      skillsAndQualifications: formData.skills.split(',').map((skill: string) => skill.trim()),
      whyJoinUs: formData.joinus,
      minSalary: formData.salaryMin,
      maxSalary: formData.salaryMax
    };

    const recruiterId = localStorage.getItem('userId');

    if (this.jobService.isEditMode() && jobToEdit) {
      // Mode édition
      this.jobService.updateJob(jobToEdit.id, jobData).subscribe({
        next: (res) => {
          alert('Offer successfully updated !');
          this.jobService.clearEdit();
          this.jobService.setEditMode(false);
          this.router.navigate(['/recruiter-dash']);
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour:', err);
          alert("Erreur lors de la mise à jour");
        }
      });
    } else {
      // Mode création
      this.jobService.createJob(jobData, Number(recruiterId)).subscribe({
        next: (res) => {
          alert('Offer created successfully!');
          this.router.navigate(['/recruiter-dash']);
        },
        error: (err) => {
          console.error('Erreur création:', err);
          alert("Erreur création");
        }
      });
    }
  }
}

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  goToProfile() {
    this.router.navigate(['/recruiter-profil']);
  }

  goToSettings() {
    this.router.navigate(['/recruiter-settings']);
  }
  logout() {
    this.router.navigate(['/home']);
  }

  goToDashboard() {
    this.router.navigate(['/recruiter-dash']);
  }
   ngOnInit() {
    const jobToEdit = this.jobService.getJobToEdit();
    if (jobToEdit) {
      this.postJobForm.patchValue(jobToEdit);
    }
  }
}
