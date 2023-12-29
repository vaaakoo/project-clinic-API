import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPageComponent } from './client-page.component';

describe('ClientPageComponent', () => {
  let component: ClientPageComponent;
  let fixture: ComponentFixture<ClientPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClientPageComponent]
    });
    fixture = TestBed.createComponent(ClientPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
