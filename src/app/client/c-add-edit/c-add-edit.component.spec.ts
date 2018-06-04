import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CAddEditComponent } from './c-add-edit.component';

describe('CAddEditComponent', () => {
  let component: CAddEditComponent;
  let fixture: ComponentFixture<CAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
