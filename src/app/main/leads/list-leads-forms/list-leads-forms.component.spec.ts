import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLeadsFormsComponent } from './list-leads-forms.component';

describe('ListLeadsFormsComponent', () => {
  let component: ListLeadsFormsComponent;
  let fixture: ComponentFixture<ListLeadsFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListLeadsFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListLeadsFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
