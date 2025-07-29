import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-jobseeker-sociallinks',
  templateUrl: './jobseeker-sociallinks.component.html',
  styleUrls: ['./jobseeker-sociallinks.component.scss']
})
export class JobseekerSociallinksComponent {
facebook = '';
twitter = '';
linkedin = '';
github = '';
 constructor(private router: Router,private sharedData: SharedDataService) {}

onSubmit() {
  const socialData = {
    facebook: this.facebook,
    twitter: this.twitter,
    linkedin: this.linkedin,
    github: this.github
  };
  
  this.sharedData.setData('social', socialData);
  console.log('Social data saved:', socialData);
  this.router.navigate(['/jobseeker-account']);
}

}

