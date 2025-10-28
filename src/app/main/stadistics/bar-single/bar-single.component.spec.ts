import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarSingleComponent } from './bar-single.component';

describe('BarSingleComponent', () => {
  let component: BarSingleComponent;
  let fixture: ComponentFixture<BarSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
