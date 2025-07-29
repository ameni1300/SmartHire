import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-recruiter-founding',
  templateUrl: './recruiter-founding.component.html',
  styleUrls: ['./recruiter-founding.component.scss']
})
export class RecruiterFoundingComponent {
foundingForm: FormGroup;
organizationTypes = ['Startup', 'Corporation', 'Non-profit'];
industryTypes = ['IT', 'Healthcare', 'Finance', 'Education'];

constructor(private fb: FormBuilder,private router: Router,private sharedData: SharedDataService) {
  this.foundingForm = this.fb.group({
    organizationType: ['', Validators.required],
    industryType: ['', Validators.required],
    yearOfEstablishment: ['', Validators.required],
    companyWebsite: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    companyVision: ['', Validators.required],
  });
}

onSubmit() {
  if (this.foundingForm.valid) {
    this.sharedData.setData('founding', this.foundingForm.value);
    this.router.navigate(['/recruiter-social']);
  }
}

onPrevious(): void {
  // navigation logic (emit event or route to previous step)
}
 
}
