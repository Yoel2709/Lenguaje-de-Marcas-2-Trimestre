import { Component, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { EventService } from '../../services/event.service';
import { SocialEvent } from '../../models/event.model';

registerLocaleData(localeEs);

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent {
  private eventService = inject(EventService);

  events = this.eventService.filteredEvents;
  filters = this.eventService.getFilters;

  setFilter(filter: string) {
    this.eventService.updateDateFilter(filter);
  }

  showDetails(event: SocialEvent) {
    if (confirm(`INFO DEL EVENTO:\n\n${event.title}\nLugar: ${event.location}\nPrecio: ${event.price}€\n\n¿Inscribirse?`)) {
      alert('INSCRIPCIÓN EXITOSA');
    }
  }

  isActive(filter: string): boolean {
    return this.eventService.getFilters().date === filter;
  }
}
