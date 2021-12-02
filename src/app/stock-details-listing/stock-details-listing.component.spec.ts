import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailsListingComponent } from './stock-details-listing.component';

describe('StockDetailsListingComponent', () => {
  let component: StockDetailsListingComponent;
  let fixture: ComponentFixture<StockDetailsListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockDetailsListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockDetailsListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
