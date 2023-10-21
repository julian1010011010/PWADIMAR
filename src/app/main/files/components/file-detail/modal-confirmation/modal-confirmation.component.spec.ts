import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalConfirmationComponent } from './modal-confirmation.component';

describe('ModalConfirmationComponent', () => {
  let component: ModalConfirmationComponent;
  let fixture: ComponentFixture<ModalConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
