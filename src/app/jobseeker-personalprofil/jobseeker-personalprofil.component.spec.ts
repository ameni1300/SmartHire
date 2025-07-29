import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerPersonalprofilComponent } from './jobseeker-personalprofil.component';

describe('JobseekerPersonalprofilComponent', () => {
  let component: JobseekerPersonalprofilComponent;
  let fixture: ComponentFixture<JobseekerPersonalprofilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobseekerPersonalprofilComponent]
    });
    fixture = TestBed.createComponent(JobseekerPersonalprofilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
