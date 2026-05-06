import { Component, inject, AfterViewInit, ElementRef, ViewChild, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../services/event.service';
import { SocialEvent } from '../../models/event.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private eventService = inject(EventService);

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map?: L.Map;
  private markers: L.Marker[] = [];
  private DEFAULT_CENTER: L.LatLngExpression = [40.4168, -3.7038];
  private DEFAULT_ZOOM = 13;

  categories = Object.keys(this.eventService.CATEGORY_CONFIG);
  categoryConfig = this.eventService.CATEGORY_CONFIG;

  constructor() {
    // Effect to update markers when filtered events change
    effect(() => {
      this.updateMarkers(this.eventService.filteredEvents());
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap() {
    this.map = L.map(this.mapContainer.nativeElement, { zoomControl: false })
      .setView(this.DEFAULT_CENTER, this.DEFAULT_ZOOM);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.updateMarkers(this.eventService.filteredEvents());
  }

  private updateMarkers(events: SocialEvent[]) {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(m => m.remove());
    this.markers = [];

    events.forEach(event => {
      const config = this.categoryConfig[event.category] || this.categoryConfig['fiesta'];
      const icon = L.divIcon({
        html: `<div class="custom-marker"><i class="fas ${config.icon}"></i></div>`,
        className: 'custom-div-icon',
        iconSize: [44, 44],
        iconAnchor: [22, 44],
        popupAnchor: [0, -44]
      });

      const marker = L.marker(event.coordinates, { icon })
        .addTo(this.map!)
        .bindPopup(`
          <div class="p-2 text-uppercase" style="min-width: 200px;">
            <h5 class="mb-3">${event.title}</h5>
            <div class="small text-muted mb-2">${event.location}</div>
            <div class="h5 text-primary my-3">${event.price === 0 ? 'GRATIS' : event.price + '€'}</div>
          </div>
        `);

      this.markers.push(marker);
    });

    if (this.markers.length > 0 && this.markers.length < 4) { // 4 is arbitrary for "some filtered"
      const group = L.featureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  zoomIn() { this.map?.zoomIn(); }
  zoomOut() { this.map?.zoomOut(); }
  resetView() { this.map?.setView(this.DEFAULT_CENTER, this.DEFAULT_ZOOM); }
  clearFilters() { this.eventService.clearFilters(); }
  showAll() {
    if (this.markers.length > 0) {
      this.map?.fitBounds(L.featureGroup(this.markers).getBounds().pad(0.1));
    }
  }

  toggleCategory(cat: string) {
    this.eventService.toggleCategoryFilter(cat);
  }

  isCategoryActive(cat: string): boolean {
    return this.eventService.getFilters().category.includes(cat);
  }

  getCategoryCount(cat: string): number {
    return this.eventService.filteredEvents().filter(e => e.category === cat).length;
  }
}
