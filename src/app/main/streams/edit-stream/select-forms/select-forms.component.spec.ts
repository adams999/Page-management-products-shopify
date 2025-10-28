import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFormsComponent } from './select-forms.component';

describe('SelectFormsComponent', () => {
  let component: SelectFormsComponent;
  let fixture: ComponentFixture<SelectFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
