import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MainFilesComponent } from './main-files.component';

describe('MainFilesComponent', () => {
  let component: MainFilesComponent;
  let fixture: ComponentFixture<MainFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
