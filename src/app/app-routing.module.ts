import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { JobseekerPersonalComponent } from './jobseeker-personal/jobseeker-personal.component';
import { JobseekerProfilComponent } from './jobseeker-profil/jobseeker-profil.component';
import { JobseekerSociallinksComponent } from './jobseeker-sociallinks/jobseeker-sociallinks.component';
import { JobseekerAccountsettingsComponent } from './jobseeker-accountsettings/jobseeker-accountsettings.component';
import { RecruiterCompanyComponent } from './recruiter-company/recruiter-company.component';
import { RecruiterFoundingComponent } from './recruiter-founding/recruiter-founding.component';
import { RecruiterSociallinkComponent } from './recruiter-sociallink/recruiter-sociallink.component';
import { RecruiterContactComponent } from './recruiter-contact/recruiter-contact.component';
import { JobseekerJobsearchComponent } from './jobseeker-jobsearch/jobseeker-jobsearch.component';
import { JobseekerDashboardComponent } from './jobseeker-dashboard/jobseeker-dashboard.component';
import { JobseekerPersonalprofilComponent } from './jobseeker-personalprofil/jobseeker-personalprofil.component';
import { RecruiterDashboardComponent } from './recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterJobpostComponent } from './recruiter-jobpost/recruiter-jobpost.component';
import { RecruiterApplicationsComponent } from './recruiter-applications/recruiter-applications.component';
import { RecruiterAccountprofileComponent } from './recruiter-accountprofile/recruiter-accountprofile.component';
import { JobseekerSettingsComponent } from './jobseeker-settings/jobseeker-settings.component';
import { RecruiterSettingsComponent } from './recruiter-settings/recruiter-settings.component';
const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'signin', 
    loadComponent: () => import('./sign-in/sign-in.component').then(m => m.SignInComponent)
  },

  {
    path: 'register', 
    loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent)
  },

  { path: 'application/:id', component: RecruiterApplicationsComponent },


  {
    path: 'welcom',
    loadComponent: () => import('./welcom/welcom.component').then(m => m.WelcomComponent)
  },

  {
    path: 'fpswd',
    loadComponent: () => import('./forgetpassword/forgetpassword.component').then(m => m.ForgetpasswordComponent)
  },

    { path: 'jobseeker-personal', component: JobseekerPersonalComponent },
    { path: 'jobseeker-profile', component: JobseekerProfilComponent },
    { path: 'jobseeker-social', component: JobseekerSociallinksComponent },
    { path: 'jobseeker-account', component: JobseekerAccountsettingsComponent },
    { path: 'recruiter-company', component: RecruiterCompanyComponent },
    { path: 'recruiter-founding', component: RecruiterFoundingComponent },
    { path: 'recruiter-social', component: RecruiterSociallinkComponent },
    { path: 'recruiter-contact', component: RecruiterContactComponent },
    { path: 'jobseeker-jobsearch', component: JobseekerJobsearchComponent },
    { path: 'dashboard', component: JobseekerDashboardComponent },

    { path: 'profil', component: JobseekerPersonalprofilComponent },
    { path: 'jobpost', component: RecruiterJobpostComponent },
    { path: 'recruiter-dash', component: RecruiterDashboardComponent },
    //{ path: 'application', component: RecruiterApplicationsComponent },

    { path: 'recruiter-profil', component: RecruiterAccountprofileComponent },
    { path: 'jobseeker-setting', component: JobseekerSettingsComponent },
    { path: 'recruiter-settings', component: RecruiterSettingsComponent },


  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
