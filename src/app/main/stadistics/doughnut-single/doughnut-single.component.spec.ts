import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoughnutSingleComponent } from './doughnut-single.component';

describe('DoughnutSingleComponent', () => {
  let component: DoughnutSingleComponent;
  let fixture: ComponentFixture<DoughnutSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoughnutSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoughnutSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
