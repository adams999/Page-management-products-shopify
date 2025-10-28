import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLeadFormComponent } from './choose-lead-form.component';

describe('ChooseLeadFormComponent', () => {
  let component: ChooseLeadFormComponent;
  let fixture: ComponentFixture<ChooseLeadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseLeadFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseLeadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
