import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantToursComponent } from './participant-tours.component';

describe('ParticipantToursComponent', () => {
  let component: ParticipantToursComponent;
  let fixture: ComponentFixture<ParticipantToursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ParticipantToursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantToursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
