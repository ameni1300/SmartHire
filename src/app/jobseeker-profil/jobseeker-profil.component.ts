import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedDataService } from '../services/shared-data.service';

interface Resume {
  file: File;
  name: string;
  size: string;
  type: string;
  content: ArrayBuffer | string | null;
  // Ajoutez cette propriété si nécessaire
  isSelected?: boolean;
}


@Component({
  selector: 'app-jobseeker-profil',
  templateUrl: './jobseeker-profil.component.html',
  styleUrls: ['./jobseeker-profil.component.scss']
})
export class JobseekerProfilComponent {
  profileForm: FormGroup;
  profilePicture: string | ArrayBuffer | null = null;
  tags: string[] = [];
  resumes: Resume[] = [];
  maxFileSizeMB = 5;
  selectedResume: Resume | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sharedData: SharedDataService
  ) {
    this.profileForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      tagInput: [''],
      resume: [null],
    });
  }

  

onCvSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;

  // Acceptez plus de types de fichiers
  const acceptedTypes = ['application/pdf', 'application/msword', 
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (!acceptedTypes.includes(file.type)) {
    alert('Please select a PDF, DOC or DOCX file');
    return;
  }

  if (file.size > this.maxFileSizeMB * 1024 * 1024) {
    alert(`File size should not exceed ${this.maxFileSizeMB}MB`);
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const newResume: Resume = {
      file,
      name: file.name,
      size: this.formatFileSize(file.size),
      type: file.type,
      content: reader.result
    };
    this.resumes.push(newResume);
    this.selectedResume = newResume;
  };
  reader.readAsArrayBuffer(file);
  input.value = '';
}

// Ajoutez une méthode pour sélectionner un CV principal
selectMainResume(index: number): void {
  this.selectedResume = this.resumes[index];
}

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  }

  removeResume(index: number): void {
    this.resumes.splice(index, 1);
  }

  addTag(event: Event): void {
    event.preventDefault();
    const input = this.profileForm.get('tagInput')?.value?.trim();
    
    if (input && !this.tags.includes(input)) {
      this.tags.push(input);
      this.profileForm.get('tagInput')?.setValue('');
    }
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  onSubmit(): void {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }

  const profileData = {
    photoUrl: this.profilePicture,
    headline: this.profileForm.get('title')?.value,
    tags: this.tags,
    resumes: this.resumes // Envoyez l'objet Resume complet
  };

  this.sharedData.setData('profile', profileData);
  this.router.navigate(['/jobseeker-social']);
}
}