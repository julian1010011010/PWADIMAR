import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalDeficienciesComponent } from './deficiencies.component';

describe('ModalDeficienciesComponent', () => {
  let component: ModalDeficienciesComponent;
  let fixture: ComponentFixture<ModalDeficienciesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDeficienciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDeficienciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
