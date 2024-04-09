import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfLinksComponent } from './list-of-links.component';

describe('ListOfLinksComponent', () => {
  let component: ListOfLinksComponent;
  let fixture: ComponentFixture<ListOfLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOfLinksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListOfLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
