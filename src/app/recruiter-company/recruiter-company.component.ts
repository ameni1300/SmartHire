import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from '../services/shared-data.service';

@Component({
  selector: 'app-recruiter-company',
  templateUrl: './recruiter-company.component.html',
  styleUrls: ['./recruiter-company.component.scss']
})
export class RecruiterCompanyComponent {
 personalForm: FormGroup;
  profilePicture: string | null = null;

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

   constructor(private fb: FormBuilder,private router: Router,private sharedData: SharedDataService) {
    this.personalForm = this.fb.group({
  nationality: new FormControl('', Validators.required),
  companyDescription: new FormControl('', [Validators.required, Validators.minLength(20)]),
   companyName: new FormControl(null, Validators.required),

});

 this.personalForm.valueChanges.subscribe(values => {
      console.log('Form values:', values);
      console.log('Form valid:', this.personalForm.valid);
    });
  }

  get isFormValid(): boolean {
    return this.personalForm.valid;
  }

 onSubmit() {
  if (this.personalForm.invalid) {
    this.markAllAsTouched();
    return;
  }

  this.sharedData.setData('company', this.personalForm.value);
  this.router.navigate(['/recruiter-founding']);
}

  private markAllAsTouched() {
    Object.values(this.personalForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  // Dans votre composant
ngOnInit() {
  this.personalForm.statusChanges.subscribe(status => {
    console.log('Form status:', status);
    console.log('Form errors:', this.personalForm.errors);
    console.log('Form controls:', {
      nationality: this.personalForm.get('nationality')?.errors,
      companyDescription: this.personalForm.get('companyDescription')?.errors,
      companyName: this.personalForm.get('companyName')?.errors,
    });
  });
}
onProfileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profilePicture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }
  
}