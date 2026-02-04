import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalfreshDetail } from './calfresh-detail';

describe('CalfreshDetail', () => {
  let component: CalfreshDetail;
  let fixture: ComponentFixture<CalfreshDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalfreshDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalfreshDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
