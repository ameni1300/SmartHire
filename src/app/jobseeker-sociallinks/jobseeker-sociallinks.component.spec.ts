import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerSociallinksComponent } from './jobseeker-sociallinks.component';

describe('JobseekerSociallinksComponent', () => {
  let component: JobseekerSociallinksComponent;
  let fixture: ComponentFixture<JobseekerSociallinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobseekerSociallinksComponent]
    });
    fixture = TestBed.createComponent(JobseekerSociallinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
