import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPageComponent } from './doctor-page.component';

describe('DoctorPageComponent', () => {
  let component: DoctorPageComponent;
  let fixture: ComponentFixture<DoctorPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorPageComponent]
    });
    fixture = TestBed.createComponent(DoctorPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
