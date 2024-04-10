import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtListComponent } from './rt-list.component';

describe('RtListComponent', () => {
  let component: RtListComponent;
  let fixture: ComponentFixture<RtListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
