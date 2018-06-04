import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrListComponent } from './fr-list.component';

describe('ListComponent', () => {
  let component: FrListComponent;
  let fixture: ComponentFixture<FrListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
