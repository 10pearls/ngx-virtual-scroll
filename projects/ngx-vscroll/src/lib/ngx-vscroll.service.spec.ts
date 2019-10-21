import { TestBed } from '@angular/core/testing';

import { NgxVScrollService } from './ngx-vscroll.service';

describe('NgxVScrollService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgxVScrollService = TestBed.get(NgxVScrollService);
    expect(service).toBeTruthy();
  });
});
