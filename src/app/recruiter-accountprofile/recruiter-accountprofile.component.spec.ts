import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterAccountprofileComponent } from './recruiter-accountprofile.component';

describe('RecruiterAccountprofileComponent', () => {
  let component: RecruiterAccountprofileComponent;
  let fixture: ComponentFixture<RecruiterAccountprofileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterAccountprofileComponent]
    });
    fixture = TestBed.createComponent(RecruiterAccountprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
