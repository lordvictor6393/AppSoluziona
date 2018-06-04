import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErFormItemComponent } from './er-form-item.component';

describe('ErFormItemComponent', () => {
  let component: ErFormItemComponent;
  let fixture: ComponentFixture<ErFormItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErFormItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErFormItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
