import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UAddEditComponent } from './u-add-edit.component';

describe('UAddEditComponent', () => {
  let component: UAddEditComponent;
  let fixture: ComponentFixture<UAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
