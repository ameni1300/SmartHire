import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobpostComponent } from './recruiter-jobpost.component';

describe('RecruiterJobpostComponent', () => {
  let component: RecruiterJobpostComponent;
  let fixture: ComponentFixture<RecruiterJobpostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterJobpostComponent]
    });
    fixture = TestBed.createComponent(RecruiterJobpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
