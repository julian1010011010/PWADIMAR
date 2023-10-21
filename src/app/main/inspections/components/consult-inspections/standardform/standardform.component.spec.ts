import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StandardformComponent } from './standardform.component';

describe('StandardformComponent', () => {
  let component: StandardformComponent;
  let fixture: ComponentFixture<StandardformComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
