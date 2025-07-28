import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroDetalle } from './libro-detalle';

describe('LibroDetalle', () => {
  let component: LibroDetalle;
  let fixture: ComponentFixture<LibroDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
