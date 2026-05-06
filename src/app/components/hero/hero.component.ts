import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {
  private eventService = inject(EventService);

  searchLocation = '';
  searchDate = '';
  searchType = '';

  onSearch() {
    this.eventService.searchEvents(this.searchLocation, this.searchDate, this.searchType);
  }
}
