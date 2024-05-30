import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerToursComponent } from './organizer-tours.component';

describe('OrganizerToursComponent', () => {
  let component: OrganizerToursComponent;
  let fixture: ComponentFixture<OrganizerToursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizerToursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizerToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
