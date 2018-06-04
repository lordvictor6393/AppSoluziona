import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PListComponent } from './p-list.component';

describe('PListComponent', () => {
  let component: PListComponent;
  let fixture: ComponentFixture<PListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
