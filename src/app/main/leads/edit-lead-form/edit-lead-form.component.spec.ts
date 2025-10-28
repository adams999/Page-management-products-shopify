import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLeadFormComponent } from './edit-lead-form.component';

describe('EditLeadFormComponent', () => {
  let component: EditLeadFormComponent;
  let fixture: ComponentFixture<EditLeadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLeadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
