import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeficienciesComponent } from './deficiencies.component';

describe('ModalDeficienciesComponent', () => {
  let component: DeficienciesComponent;
  let fixture: ComponentFixture<DeficienciesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeficienciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeficienciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
