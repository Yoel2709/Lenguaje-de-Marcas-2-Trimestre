import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { EventListComponent } from './components/event-list/event-list.component';
import { MapComponent } from './components/map/map.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    HeroComponent,
    EventListComponent,
    MapComponent,
    EventFormComponent,
    FooterComponent
  ],
  template: `
    <app-header />
    <main>
      <app-hero />
      <app-event-list />
      <app-map />
      <app-event-form />
    </main>
    <app-footer />
  `
})
export class App {}
