import { Component } from '@angular/core';
import { SharedDataService } from '../services/shared-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recruiter-sociallink',
  templateUrl: './recruiter-sociallink.component.html',
  styleUrls: ['./recruiter-sociallink.component.scss']
})
export class RecruiterSociallinkComponent {
 facebook = '';
  twitter = '';
  linkedin = '';
  github = '';

  constructor(private sharedData: SharedDataService, private router: Router) {}

  onNext(): void {
    const socialData = {
      facebook: this.facebook,
      twitter: this.twitter,
      linkedin: this.linkedin,
      github: this.github
    };
    this.sharedData.setData('sociall', socialData);
    this.router.navigate(['/recruiter-contact']);
  }
}