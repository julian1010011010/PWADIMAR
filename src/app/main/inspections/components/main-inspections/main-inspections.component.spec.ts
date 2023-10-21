import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainInspectionsComponent } from './main-inspections.component';

describe('MainInspectionsComponent', () => {
  let component: MainInspectionsComponent;
  let fixture: ComponentFixture<MainInspectionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainInspectionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainInspectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
