import {async, ComponentFixture, TestBed ,waitForAsync } from '@angular/core/testing';

import { ReportsInspectionsComponent } from './reports-inspections.component';

describe('ReportsInspectionsComponent', () => {
  let component: ReportsInspectionsComponent;
  let fixture: ComponentFixture<ReportsInspectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsInspectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsInspectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});