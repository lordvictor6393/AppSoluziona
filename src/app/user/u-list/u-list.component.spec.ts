import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UListComponent } from './u-list.component';

describe('UListComponent', () => {
  let component: UListComponent;
  let fixture: ComponentFixture<UListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
