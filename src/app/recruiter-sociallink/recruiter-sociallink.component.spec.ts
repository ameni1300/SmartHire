import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterSociallinkComponent } from './recruiter-sociallink.component';

describe('RecruiterSociallinkComponent', () => {
  let component: RecruiterSociallinkComponent;
  let fixture: ComponentFixture<RecruiterSociallinkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterSociallinkComponent]
    });
    fixture = TestBed.createComponent(RecruiterSociallinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
