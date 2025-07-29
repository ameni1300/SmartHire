import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterContactComponent } from './recruiter-contact.component';

describe('RecruiterContactComponent', () => {
  let component: RecruiterContactComponent;
  let fixture: ComponentFixture<RecruiterContactComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterContactComponent]
    });
    fixture = TestBed.createComponent(RecruiterContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
