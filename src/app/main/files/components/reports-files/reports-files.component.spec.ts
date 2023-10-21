import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportsFilesComponent } from './reports-files.component';

describe('ReportsFilesComponent', () => {
  let component: ReportsFilesComponent;
  let fixture: ComponentFixture<ReportsFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportsFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
