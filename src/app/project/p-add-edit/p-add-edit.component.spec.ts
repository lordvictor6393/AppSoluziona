import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PAddEditComponent } from './p-add-edit.component';

describe('PAddEditComponent', () => {
  let component: PAddEditComponent;
  let fixture: ComponentFixture<PAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
