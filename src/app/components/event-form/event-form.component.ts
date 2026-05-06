import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { SocialEvent } from '../../models/event.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent {
  private eventService = inject(EventService);

  newEvent: Partial<SocialEvent> = {
    title: '',
    type: '',
    location: '',
    date: '',
    capacity: 0,
    price: 0,
    description: '',
    image: ''
  };

  onSubmit() {
    const event: SocialEvent = {
      ...(this.newEvent as SocialEvent),
      id: Date.now(),
      available: this.newEvent.capacity || 0,
      category: 'fiesta',
      coordinates: [40.4168 + (Math.random()*0.02-0.01), -3.7038 + (Math.random()*0.02-0.01)]
    };
    this.eventService.addEvent(event);
    this.resetForm();
    alert('EVENTO PUBLICADO');
  }

  resetForm() {
    this.newEvent = {
      title: '',
      type: '',
      location: '',
      date: '',
      capacity: 0,
      price: 0,
      description: '',
      image: ''
    };
  }

  get previewImage() {
    return this.newEvent.image || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80';
  }
}
