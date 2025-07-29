import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { JobApplicationService } from '../services/job-application.service';

@Component({
  selector: 'app-application-form-modal',
  templateUrl: './application-form-modal.component.html',
  styleUrls: ['./application-form-modal.component.scss']
})
export class ApplicationFormModalComponent {
  @Output() close = new EventEmitter<void>();
  @Input() job: any;

  fullName: string = '';
  coverLetter: string = '';
  selectedFile: File | null = null;

  constructor(
    private router: Router,
    private jobApplicationService: JobApplicationService
  ) {}

  closeModal(): void {
    this.close.emit();
  }

  handleFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  submitForm(): void {
    if (!this.fullName || !this.coverLetter) {
      alert('Please fill all required fields');
      return;
    }

    // Créer l'objet application
    const application = {
      ...this.job,
      fullName: this.fullName,
      coverLetter: this.coverLetter,
      fileName: this.selectedFile?.name || 'No file',
      dateApplied: new Date(),
      status: 'Active'
    };

    // Ajouter la candidature via le service

    // Redirection vers le dashboard
    this.router.navigate(['/dashboard']);

    // Fermer la modal
    this.closeModal();
  }
}