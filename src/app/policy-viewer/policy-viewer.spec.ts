import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyViewer } from './policy-viewer';

describe('PolicyViewer', () => {
  let component: PolicyViewer;
  let fixture: ComponentFixture<PolicyViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyViewer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
