import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerAccountsettingsComponent } from './jobseeker-accountsettings.component';

describe('JobseekerAccountsettingsComponent', () => {
  let component: JobseekerAccountsettingsComponent;
  let fixture: ComponentFixture<JobseekerAccountsettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobseekerAccountsettingsComponent]
    });
    fixture = TestBed.createComponent(JobseekerAccountsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
