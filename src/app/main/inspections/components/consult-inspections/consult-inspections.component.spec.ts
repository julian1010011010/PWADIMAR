import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsultInspectionsComponent } from './consult-inspections.component';

describe('ConsultInspectionsComponent', () => {
  let component: ConsultInspectionsComponent;
  let fixture: ComponentFixture<ConsultInspectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultInspectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultInspectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
