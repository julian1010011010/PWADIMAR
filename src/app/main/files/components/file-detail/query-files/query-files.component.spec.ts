import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QueryFilesComponent } from './query-files.component';

describe('QueryFilesComponent', () => {
  let component: QueryFilesComponent;
  let fixture: ComponentFixture<QueryFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QueryFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
