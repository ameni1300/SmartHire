import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerPersonalComponent } from './jobseeker-personal.component';

describe('JobseekerPersonalComponent', () => {
  let component: JobseekerPersonalComponent;
  let fixture: ComponentFixture<JobseekerPersonalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobseekerPersonalComponent]
    });
    fixture = TestBed.createComponent(JobseekerPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
