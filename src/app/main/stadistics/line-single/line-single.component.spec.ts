import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineSingleComponent } from './line-single.component';

describe('LineSingleComponent', () => {
  let component: LineSingleComponent;
  let fixture: ComponentFixture<LineSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LineSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
