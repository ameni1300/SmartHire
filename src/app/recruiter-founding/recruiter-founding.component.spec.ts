import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterFoundingComponent } from './recruiter-founding.component';

describe('RecruiterFoundingComponent', () => {
  let component: RecruiterFoundingComponent;
  let fixture: ComponentFixture<RecruiterFoundingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterFoundingComponent]
    });
    fixture = TestBed.createComponent(RecruiterFoundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
