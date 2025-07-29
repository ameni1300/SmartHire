import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterCompanyComponent } from './recruiter-company.component';

describe('RecruiterCompanyComponent', () => {
  let component: RecruiterCompanyComponent;
  let fixture: ComponentFixture<RecruiterCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterCompanyComponent]
    });
    fixture = TestBed.createComponent(RecruiterCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
