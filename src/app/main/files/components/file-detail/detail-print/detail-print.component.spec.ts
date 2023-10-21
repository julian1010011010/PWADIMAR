import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DetailPrintComponent } from './detail-print.component';

describe('DetailPrintComponent', () => {
  let component: DetailPrintComponent;
  let fixture: ComponentFixture<DetailPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
