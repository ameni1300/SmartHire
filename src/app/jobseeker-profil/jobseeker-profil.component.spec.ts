import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerProfilComponent } from './jobseeker-profil.component';

describe('JobseekerProfilComponent', () => {
  let component: JobseekerProfilComponent;
  let fixture: ComponentFixture<JobseekerProfilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobseekerProfilComponent]
    });
    fixture = TestBed.createComponent(JobseekerProfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
