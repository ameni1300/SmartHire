import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerJobsearchComponent } from './jobseeker-jobsearch.component';

describe('JobseekerJobsearchComponent', () => {
  let component: JobseekerJobsearchComponent;
  let fixture: ComponentFixture<JobseekerJobsearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobseekerJobsearchComponent]
    });
    fixture = TestBed.createComponent(JobseekerJobsearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
