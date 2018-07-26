import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrPrintPreviewComponent } from './fr-print-preview.component';

describe('FrPrintPreviewComponent', () => {
  let component: FrPrintPreviewComponent;
  let fixture: ComponentFixture<FrPrintPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrPrintPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrPrintPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
