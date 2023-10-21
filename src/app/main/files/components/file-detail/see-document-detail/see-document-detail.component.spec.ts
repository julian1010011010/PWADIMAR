import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SeeDocumentDetailComponent } from './see-document-detail.component';

describe('SeeDocumentDetailComponent', () => {
  let component: SeeDocumentDetailComponent;
  let fixture: ComponentFixture<SeeDocumentDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeeDocumentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
