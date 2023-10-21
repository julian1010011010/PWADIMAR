import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhotographicAnnexComponent } from './photographic-annex.component';

describe('PhotographicAnnexComponent', () => {
  let component: PhotographicAnnexComponent;
  let fixture: ComponentFixture<PhotographicAnnexComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotographicAnnexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotographicAnnexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
