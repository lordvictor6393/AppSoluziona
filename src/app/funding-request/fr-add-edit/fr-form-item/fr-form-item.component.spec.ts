import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrFormItemComponent } from './fr-form-item.component';

describe('FrFormItemComponent', () => {
  let component: FrFormItemComponent;
  let fixture: ComponentFixture<FrFormItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrFormItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
