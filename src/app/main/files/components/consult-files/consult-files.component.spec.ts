import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsultFilesComponent } from './consult-files.component';

describe('ConsultFilesComponent', () => {
  let component: ConsultFilesComponent;
  let fixture: ComponentFixture<ConsultFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
