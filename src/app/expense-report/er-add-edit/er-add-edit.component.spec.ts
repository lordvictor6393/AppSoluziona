import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErAddEditComponent } from './er-add-edit.component';

describe('ErAddEditComponent', () => {
  let component: ErAddEditComponent;
  let fixture: ComponentFixture<ErAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
