import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrAddEditComponent } from './fr-add-edit.component';

describe('FrAddEditComponent', () => {
  let component: FrAddEditComponent;
  let fixture: ComponentFixture<FrAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
