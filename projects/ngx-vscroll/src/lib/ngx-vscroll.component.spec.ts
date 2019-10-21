import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxVScrollComponent } from './ngx-vscroll.component';

describe('NgxVScrollComponent', () => {
  let component: NgxVScrollComponent;
  let fixture: ComponentFixture<NgxVScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxVScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxVScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
