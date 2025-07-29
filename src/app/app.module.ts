import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RouterOutlet } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { RegisterComponent } from './register/register.component';
import { WelcomComponent } from './welcom/welcom.component';
import { JobseekerPersonalComponent } from './jobseeker-personal/jobseeker-personal.component';
import { JobseekerProfilComponent } from './jobseeker-profil/jobseeker-profil.component';
import { JobseekerSociallinksComponent } from './jobseeker-sociallinks/jobseeker-sociallinks.component';
import { JobseekerAccountsettingsComponent } from './jobseeker-accountsettings/jobseeker-accountsettings.component';
import { RecruiterContactComponent } from './recruiter-contact/recruiter-contact.component';
import { RecruiterFoundingComponent } from './recruiter-founding/recruiter-founding.component';
import { RecruiterSociallinkComponent } from './recruiter-sociallink/recruiter-sociallink.component';
import { RecruiterCompanyComponent } from './recruiter-company/recruiter-company.component';
import { JobseekerJobsearchComponent } from './jobseeker-jobsearch/jobseeker-jobsearch.component';
import { JobseekerDashboardComponent } from './jobseeker-dashboard/jobseeker-dashboard.component';
import { JobseekerPersonalprofilComponent } from './jobseeker-personalprofil/jobseeker-personalprofil.component';
import { ApplicationFormModalComponent } from './application-form-modal/application-form-modal.component';
import { RecruiterJobpostComponent } from './recruiter-jobpost/recruiter-jobpost.component';
import { RecruiterDashboardComponent } from './recruiter-dashboard/recruiter-dashboard.component';
import { RecruiterAccountprofileComponent } from './recruiter-accountprofile/recruiter-accountprofile.component';
import { RecruiterApplicationsComponent } from './recruiter-applications/recruiter-applications.component';
import { ForgetpasswordComponent } from './forgetpassword/forgetpassword.component';
import { JobseekerSettingsComponent } from './jobseeker-settings/jobseeker-settings.component';
import { RecruiterSettingsComponent } from './recruiter-settings/recruiter-settings.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    JobseekerPersonalComponent,
    JobseekerProfilComponent,
    JobseekerSociallinksComponent,
    JobseekerAccountsettingsComponent,
    RecruiterContactComponent,
    RecruiterFoundingComponent,
    RecruiterSociallinkComponent,
    RecruiterCompanyComponent,
    JobseekerJobsearchComponent,
    JobseekerDashboardComponent,
    JobseekerPersonalprofilComponent,
    ApplicationFormModalComponent,
    RecruiterJobpostComponent,
    RecruiterDashboardComponent,
    RecruiterAccountprofileComponent,
    RecruiterApplicationsComponent,
    JobseekerSettingsComponent,
    RecruiterSettingsComponent,
    
    
    
    
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    RegisterComponent,
    WelcomComponent,
    ForgetpasswordComponent,
    BrowserAnimationsModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }