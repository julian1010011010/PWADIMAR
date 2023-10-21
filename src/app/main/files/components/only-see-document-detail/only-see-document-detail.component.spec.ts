import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OnlySeeDocumentDetailComponent } from './only-see-document-detail.component';

describe('OnlySeeDocumentDetailComponent', () => {
  let component: OnlySeeDocumentDetailComponent;
  let fixture: ComponentFixture<OnlySeeDocumentDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OnlySeeDocumentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlySeeDocumentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
