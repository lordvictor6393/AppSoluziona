import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrSelectorComponent } from './fr-selector.component';

describe('FrSelectorComponent', () => {
  let component: FrSelectorComponent;
  let fixture: ComponentFixture<FrSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
