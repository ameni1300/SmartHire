import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';
@Component({
  selector: 'app-jobseeker-personal',
  templateUrl: './jobseeker-personal.component.html',
  styleUrls: ['./jobseeker-personal.component.scss']
})
export class JobseekerPersonalComponent {
  personalForm: FormGroup;

  nationalities: string[] = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Argentinian', 'Armenian',
  'Australian', 'Austrian', 'Azerbaijani', 'Bahraini', 'Bangladeshi', 'Belgian', 'Beninese',
  'Bolivian', 'Bosnian', 'Brazilian', 'British', 'Bulgarian', 'Burkinabé', 'Cambodian', 'Cameroonian',
  'Canadian', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Congolese', 'Croatian',
  'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Dutch', 'Ecuadorian', 'Egyptian',
  'Emirati', 'English', 'Eritrean', 'Estonian', 'Ethiopian', 'Finnish', 'French', 'Gabonese', 'Gambian',
  'Georgian', 'German', 'Ghanaian', 'Greek', 'Guatemalan', 'Guinean', 'Haitian', 'Honduran', 'Hungarian',
  'Icelandic', 'Indian', 'Indonesian', 'Iranian', 'Iraqi', 'Irish', 'Italian', 'Ivorian',
  'Jamaican', 'Japanese', 'Jordanian', 'Kazakh', 'Kenyan', 'Kuwaiti', 'Laotian', 'Latvian', 'Lebanese',
  'Liberian', 'Libyan', 'Lithuanian', 'Luxembourgish', 'Malagasy', 'Malaysian', 'Malian', 'Maltese',
  'Mauritanian', 'Mexican', 'Monégasque', 'Mongolian', 'Moroccan', 'Mozambican', 'Namibian',
  'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian', 'North Korean', 'Norwegian', 'Omani',
  'Pakistani', 'Palestinian', 'Panamanian', 'Paraguayan', 'Peruvian', 'Philippine', 'Polish',
  'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Salvadoran', 'Saudi', 'Senegalese',
  'Serbian', 'Singaporean', 'Slovak', 'Slovenian', 'Somali', 'South African', 'South Korean',
  'Spanish', 'Sri Lankan', 'Sudanese', 'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Tajik', 'Tanzanian',
  'Thai', 'Togolese', 'Tunisian', 'Turkish', 'Ukrainian', 'Uruguayan', 'Uzbek', 'Venezuelan',
  'Vietnamese', 'Yemeni', 'Zambian', 'Zimbabwean'
  ];
  genders: string[] = ['Male', 'Female', 'Other', 'Prefer not to say'];
  educationLevels: string[] = ['High School', 'Bachelor', 'Master', 'PhD', 'Other'];
  maritalStatuses: string[] = ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'];
  experienceLevels: string[] = ['No experience', '1-3 years', '3-5 years', '5-10 years', '10+ years'];

  constructor(private fb: FormBuilder, private router: Router, private sharedData: SharedDataService) {
    this.personalForm = this.fb.group({
      nationality: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      education: new FormControl('', Validators.required),
      biography: new FormControl('', [Validators.required, Validators.minLength(20)]),
      birthday: new FormControl('', Validators.required),
      maritalStatus: new FormControl('', Validators.required),
      experience: new FormControl('', Validators.required)
    });

    this.personalForm.valueChanges.subscribe(values => {
      console.log('Form values:', values);
      console.log('Form valid:', this.personalForm.valid);
    });

     if (this.sharedData.getData('userType') !== 'jobSeeker') {
    this.router.navigate(['/welcom']);
  }

  }

  get isFormValid(): boolean {
    return this.personalForm.valid;
  }

 onSubmit() {
  if (this.personalForm.invalid) {
    this.markAllAsTouched();
    return;
  }

  this.sharedData.setData('personal', this.personalForm.value);
  console.log('Personal data saved:', this.personalForm.value);
  
  this.router.navigate(['/jobseeker-profile']).then(nav => {
    console.log('Navigation success:', nav);
  }, err => {
    console.error('Navigation failed:', err);
  });
}

  private markAllAsTouched() {
    Object.values(this.personalForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  ngOnInit() {
    this.personalForm.statusChanges.subscribe(status => {
      console.log('Form status:', status);
      console.log('Form errors:', this.personalForm.errors);
      console.log('Form controls:', {
        nationality: this.personalForm.get('nationality')?.errors,
        gender: this.personalForm.get('gender')?.errors,
        education: this.personalForm.get('education')?.errors,
        biography: this.personalForm.get('biography')?.errors,
        birthday: this.personalForm.get('birthday')?.errors,
        maritalStatus: this.personalForm.get('maritalStatus')?.errors,
        experience: this.personalForm.get('experience')?.errors
      });
    });
  }
}
