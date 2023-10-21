import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoadFilesComponent } from './load-files.component';


describe('LoadFilesComponent', () => {
  let component: LoadFilesComponent;
  let fixture: ComponentFixture<LoadFilesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
