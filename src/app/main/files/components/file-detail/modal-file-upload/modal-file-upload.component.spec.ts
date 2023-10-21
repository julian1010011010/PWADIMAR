import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalFileUploadComponent } from './modal-file-upload.component';

describe('ModalAddFileComponent', () => {
  let component: ModalFileUploadComponent;
  let fixture: ComponentFixture<ModalFileUploadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
