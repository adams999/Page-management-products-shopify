import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptablePolicyComponent } from './acceptable-policy.component';

describe('AcceptablePolicyComponent', () => {
  let component: AcceptablePolicyComponent;
  let fixture: ComponentFixture<AcceptablePolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptablePolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptablePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
