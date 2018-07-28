import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErPrintPreviewComponent } from './er-print-preview.component';

describe('ErPrintPreviewComponent', () => {
  let component: ErPrintPreviewComponent;
  let fixture: ComponentFixture<ErPrintPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErPrintPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErPrintPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
