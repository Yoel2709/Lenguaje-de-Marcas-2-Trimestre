import { Injectable, signal, computed } from '@angular/core';
import { SocialEvent, CategoryConfig, ActiveFilters } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly EVENT_DATA: SocialEvent[] = [
    {
      id: 1,
      title: "Sunset Party Premium",
      location: "La Moraleja",
      date: "2024-06-15T20:00",
      capacity: 25,
      available: 25,
      price: 15,
      type: "Fiesta en Casa",
      category: "fiesta",
      description: "DJ en directo y cócteles premium en una terraza privada exclusiva.",
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
      coordinates: [40.4730, -3.6852]
    },
    {
      id: 2,
      title: "Cena Gourmet",
      location: "Chamberí",
      date: "2024-06-21T21:00",
      capacity: 12,
      available: 12,
      price: 45,
      type: "Cena Privada",
      category: "gastronomia",
      description: "Menú degustación de 5 platos con chef profesional. Experiencia única.",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      coordinates: [40.4340, -3.7030]
    },
    {
      id: 3,
      title: "Board Games Night",
      location: "Malasaña",
      date: "2024-06-20T19:30",
      capacity: 8,
      available: 8,
      price: 10,
      type: "Juegos de Mesa",
      category: "juegos",
      description: "Juegos modernos, snacks y bebidas incluidas. Para amantes de los juegos.",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      coordinates: [40.4250, -3.7020]
    },
    {
      id: 4,
      title: "Concierto Acústico",
      location: "Lavapiés",
      date: "2024-06-22T22:00",
      capacity: 30,
      available: 30,
      price: 20,
      type: "Concierto Íntimo",
      category: "musica",
      description: "Artistas emergentes en un formato íntimo con sonido de alta calidad.",
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      coordinates: [40.4080, -3.7020]
    }
  ];

  public readonly CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    fiesta: { name: "Fiestas", color: "#ff3300", icon: "fa-glass-cheers" },
    gastronomia: { name: "Gastronomía", color: "#f4f4f4", icon: "fa-utensils" },
    juegos: { name: "Juegos", color: "#ff3300", icon: "fa-dice" },
    musica: { name: "Música", color: "#f4f4f4", icon: "fa-music" },
    barbacoa: { name: "Barbacoas", color: "#ff3300", icon: "fa-fire" },
    networking: { name: "Networking", color: "#f4f4f4", icon: "fa-briefcase" }
  };

  private events = signal<SocialEvent[]>([...this.EVENT_DATA]);
  private activeFilters = signal<ActiveFilters>({ category: [], date: 'all' });

  public filteredEvents = computed(() => {
    let filtered = this.events();
    const filters = this.activeFilters();

    if (filters.category.length > 0) {
      filtered = filtered.filter(e => filters.category.includes(e.category));
    }

    if (filters.date !== 'all') {
      filtered = this.filterByDate(filtered, filters.date);
    }

    return filtered;
  });

  public getFilters() {
    return this.activeFilters();
  }

  public updateDateFilter(date: string) {
    this.activeFilters.update(f => ({ ...f, date }));
  }

  public toggleCategoryFilter(category: string) {
    this.activeFilters.update(f => {
      const index = f.category.indexOf(category);
      const newCategories = [...f.category];
      if (index === -1) newCategories.push(category);
      else newCategories.splice(index, 1);
      return { ...f, category: newCategories };
    });
  }

  public clearFilters() {
    this.activeFilters.set({ category: [], date: 'all' });
  }

  public addEvent(event: SocialEvent) {
    this.events.update(e => [event, ...e]);
  }

  private filterByDate(events: SocialEvent[], filter: string): SocialEvent[] {
    const now = new Date();
    return events.filter(e => {
      const ed = new Date(e.date);
      if (ed < now) return false;
      switch(filter) {
        case 'today': return ed.toDateString() === now.toDateString();
        case 'week': {
          const w = new Date(now);
          w.setDate(w.getDate() + 7);
          return ed >= now && ed <= w;
        }
        case 'month': {
          const m = new Date(now);
          m.setMonth(m.getMonth() + 1);
          return ed >= now && ed <= m;
        }
        default: return true;
      }
    });
  }

  public searchEvents(loc: string, date: string, type: string) {
    let filtered = [...this.EVENT_DATA];
    if (loc) {
      const search = loc.toLowerCase();
      filtered = filtered.filter(e => e.location.toLowerCase().includes(search) || e.title.toLowerCase().includes(search));
    }
    if (date) filtered = filtered.filter(e => e.date.startsWith(date));
    if (type) filtered = filtered.filter(e => e.type === type);
    
    this.events.set(filtered);
  }
}
