import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardStaditicsComponent } from './product-card-staditics.component';

describe('ProductCardStaditicsComponent', () => {
  let component: ProductCardStaditicsComponent;
  let fixture: ComponentFixture<ProductCardStaditicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductCardStaditicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardStaditicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
