import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableInformationComponent } from './table-information.component';

describe('TableInformationComponent', () => {
  let component: TableInformationComponent;
  let fixture: ComponentFixture<TableInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
