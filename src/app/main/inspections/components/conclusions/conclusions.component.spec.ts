import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConclusionsComponent } from './conclusions.component';

describe('ModalConclusionsComponent', () => {
  let component: ConclusionsComponent;
  let fixture: ComponentFixture<ConclusionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConclusionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConclusionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
