const EVENT_DATA = [
    {
        id: 1,
        title: "Sunset Party en Terraza Premium",
        location: "Chalet en La Moraleja",
        date: "2024-06-15T20:00",
        capacity: 25,
        available: 25,
        price: 15,
        type: "Fiesta en Casa",
        category: "fiesta",
        description: "DJ en directo, cócteles premium y vistas espectaculares en una terraza privada con ambiente exclusivo.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
        coordinates: [40.4730, -3.6852]
    },
    {
        id: 2,
        title: "Cena Gourmet con Chef Profesional",
        location: "Loft en Chamberí",
        date: "2024-06-21T21:00",
        capacity: 12,
        available: 12,
        price: 45,
        type: "Cena Privada",
        category: "gastronomia",
        description: "Menú degustación de 5 platos con maridaje de vinos seleccionados. Experiencia culinaria única.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        coordinates: [40.4340, -3.7030]
    },
    {
        id: 3,
        title: "Noche de Juegos de Mesa Premium",
        location: "Casa en Malasaña",
        date: "2024-06-20T19:30",
        capacity: 8,
        available: 8,
        price: 10,
        type: "Juegos de Mesa",
        category: "juegos",
        description: "Colección de juegos modernos, snacks y bebidas incluidas. Perfecto para amantes de los juegos de mesa.",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        coordinates: [40.4250, -3.7020]
    },
    {
        id: 4,
        title: "Concierto Acústico en Salón Privado",
        location: "Estudio en Lavapiés",
        date: "2024-06-22T22:00",
        capacity: 30,
        available: 30,
        price: 20,
        type: "Concierto Íntimo",
        category: "musica",
        description: "Artistas emergentes en formato íntimo. Ambiente acogedor con sonido de alta calidad.",
        image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        coordinates: [40.4080, -3.7020]
    },
    {
        id: 5,
        title: "Barbacoa Premium en Jardín Privado",
        location: "Jardín en El Viso",
        date: "2024-06-23T14:00",
        capacity: 15,
        available: 15,
        price: 25,
        type: "Barbacoa",
        category: "barbacoa",
        description: "Carne a la parrilla de primera calidad, ensaladas frescas y bebidas. Ambiente familiar y relajado.",
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
        coordinates: [40.4400, -3.6880]
    },
    {
        id: 6,
        title: "Afterwork Tech & Networking",
        location: "Oficina en Salamanca",
        date: "2024-06-19T19:00",
        capacity: 40,
        available: 40,
        price: 0,
        type: "Afterwork",
        category: "networking",
        description: "Conexiones profesionales en ambiente distendido. Perfecto para expandir tu red de contactos.",
        image: "https://images.unsplash.com/photo-1519452639340-7f0d3e2b55b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80",
        coordinates: [40.4300, -3.6850]
    }
];

const CATEGORY_CONFIG = {
    fiesta: { name: "Fiestas", color: "#ef4444", icon: "fa-glass-cheers" },
    gastronomia: { name: "Gastronomía", color: "#10b981", icon: "fa-utensils" },
    juegos: { name: "Juegos", color: "#3b82f6", icon: "fa-dice" },
    musica: { name: "Música", color: "#8b5cf6", icon: "fa-music" },
    barbacoa: { name: "Barbacoas", color: "#f59e0b", icon: "fa-fire" },
    networking: { name: "Networking", color: "#6366f1", icon: "fa-briefcase" }
};

const DEFAULT_MAP_CENTER = [40.4168, -3.7038];
const DEFAULT_ZOOM = 13;

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Fecha no disponible';

        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Fecha no disponible';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type}`;

    setTimeout(() => notification.classList.add('show'), 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.textContent = '', 300);
    }, duration);
}

function isValidUrl(url) {
    if (!url.trim()) return true;
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

class AppState {
    constructor() {
        this.currentEvents = [...EVENT_DATA];
        this.activeFilters = { category: [], date: 'all' };
        this.map = null;
        this.markers = [];
        this.mapInitialized = false;
    }

    updateEvents(events) {
        this.currentEvents = [...events];
        this.renderAll();
    }

    updateFilters(filters) {
        this.activeFilters = { ...this.activeFilters, ...filters };
        this.applyFilters();
    }

    renderAll() {
        this.renderEvents();
        if (this.mapInitialized) {
            this.renderMapMarkers();
        }
        this.renderLegend();
    }

    applyFilters() {
        let filtered = [...EVENT_DATA];

        if (this.activeFilters.category.length > 0) {
            filtered = filtered.filter(event =>
                this.activeFilters.category.includes(event.category)
            );
        }

        if (this.activeFilters.date !== 'all') {
            filtered = this.filterByDate(filtered, this.activeFilters.date);
        }

        this.currentEvents = filtered;
        this.renderAll();
    }

    filterByDate(events, filter) {
        const now = new Date();
        return events.filter(event => {
            const eventDate = new Date(event.date);
            if (eventDate < now) return false;

            switch (filter) {
                case 'today':
                    return eventDate.toDateString() === now.toDateString();
                case 'week':
                    const weekFromNow = new Date(now);
                    weekFromNow.setDate(weekFromNow.getDate() + 7);
                    return eventDate >= now && eventDate <= weekFromNow;
                case 'month':
                    const monthFromNow = new Date(now);
                    monthFromNow.setMonth(monthFromNow.getMonth() + 1);
                    return eventDate >= now && eventDate <= monthFromNow;
                case 'year':
                    const yearFromNow = new Date(now);
                    yearFromNow.setFullYear(yearFromNow.getFullYear() + 1);
                    return eventDate >= now && eventDate <= yearFromNow;
                default:
                    return true;
            }
        });
    }

    clearFilters() {
        this.activeFilters = { category: [], date: 'all' };
        this.currentEvents = [...EVENT_DATA];
        this.renderAll();
        this.updateFilterButtons('all');
        showNotification('Filtros limpiados', 'success');
    }

    updateFilterButtons(activeFilter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === activeFilter);
        });
    }

    renderEvents() {
        const container = document.getElementById('eventsGrid');
        if (!container) return;

        container.innerHTML = this.currentEvents.map(event => `
            <div class="col-md-6 col-lg-4 animate-fade-in-up">
                <div class="card event-card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div class="event-image position-relative">
                        <img src="${event.image}" class="card-img-top w-100 h-100" style="object-fit: cover;" alt="${event.title}" loading="lazy">
                        <span class="event-badge badge-${event.category}">${event.type}</span>
                    </div>
                    <div class="card-body p-4 d-flex flex-column">
                        <h3 class="h5 fw-bold mb-3 card-title">${event.title}</h3>
                        <div class="d-flex flex-column gap-2 mb-4">
                            <div class="small text-muted">
                                <i class="fas fa-map-marker-alt text-primary me-2"></i>
                                <span>${event.location}</span>
                            </div>
                            <div class="small text-muted">
                                <i class="fas fa-calendar-alt text-primary me-2"></i>
                                <span>${formatDate(event.date)}</span>
                            </div>
                            <div class="small text-muted">
                                <i class="fas fa-users text-primary me-2"></i>
                                <span>${event.available} plazas</span>
                            </div>
                        </div>
                        <p class="card-text text-muted mb-4 flex-grow-1" style="font-size: 0.9rem;">${event.description}</p>
                        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                            <span class="h4 fw-bold text-primary mb-0">${event.price === 0 ? 'Gratis' : event.price + '€'}</span>
                            <button class="btn btn-primary rounded-pill px-4" onclick="window.app.showEventDetails(${event.id})">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderMapMarkers() {
        if (!this.map || !this.mapInitialized) return;

        this.markers.forEach(marker => this.map.removeLayer(marker));
        this.markers = [];

        this.currentEvents.forEach(event => {
            if (event.coordinates) {
                const marker = L.marker(event.coordinates, {
                    icon: this.createMarkerIcon(event.category)
                })
                    .addTo(this.map)
                    .bindPopup(this.createPopupContent(event));

                this.markers.push(marker);
            }
        });

        if (this.markers.length > 0 && this.markers.length < EVENT_DATA.length) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    createMarkerIcon(category) {
        const config = CATEGORY_CONFIG[category];
        return L.divIcon({
            html: `<div class="custom-marker" style="border-color: ${config.color}; color: ${config.color};">
                      <i class="fas ${config.icon}"></i>
                   </div>`,
            className: 'custom-div-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });
    }

    createPopupContent(event) {
        return `
            <div class="p-2" style="min-width: 220px;">
                <h5 class="fw-bold mb-2">${event.title}</h5>
                <div class="small text-muted mb-1"><i class="fas fa-map-marker-alt text-primary me-2"></i> ${event.location}</div>
                <div class="small text-muted mb-1"><i class="fas fa-calendar-alt text-primary me-2"></i> ${formatDate(event.date)}</div>
                <div class="h5 fw-bold text-primary my-2">${event.price === 0 ? 'Gratis' : event.price + '€'}</div>
                <button onclick="window.app.showEventDetails(${event.id})" 
                        class="btn btn-primary btn-sm w-100 rounded-pill mt-2">
                    Ver Detalles
                </button>
            </div>
        `;
    }

    renderLegend() {
        const container = document.getElementById('legendItems');
        if (!container) return;

        const categories = Object.keys(CATEGORY_CONFIG);
        container.innerHTML = categories.map(category => {
            const config = CATEGORY_CONFIG[category];
            const count = this.currentEvents.filter(e => e.category === category).length;
            const isActive = this.activeFilters.category.includes(category);

            return `
                <div class="legend-item shadow-none border ${isActive ? 'active bg-light border-primary' : 'bg-white'}" 
                     data-category="${category}"
                     onclick="window.app.toggleCategoryFilter('${category}')">
                    <span class="legend-color" style="background: ${config.color}"></span>
                    <span class="flex-grow-1 small">${config.name}</span>
                    <span class="text-muted small">(${count})</span>
                </div>
            `;
        }).join('');
    }

    showEventDetails(eventId) {
        const event = EVENT_DATA.find(e => e.id === eventId);
        if (!event) return;

        const message = `
        ${event.title}
        
        📍 ${event.location}
        📅 ${formatDate(event.date)}
        👥 ${event.available} plazas disponibles
        💰 ${event.price === 0 ? 'Gratis' : event.price + '€'}
        
        ${event.description}
        
        ¿Te gustaría unirte a este evento?
        `;

        if (confirm(message)) {
            showNotification('¡Te has unido al evento!', 'success');
        }
    }

    toggleCategoryFilter(category) {
        const index = this.activeFilters.category.indexOf(category);
        if (index === -1) {
            this.activeFilters.category.push(category);
        } else {
            this.activeFilters.category.splice(index, 1);
        }
        this.applyFilters();
    }
}

class EventHandlers {
    constructor(appState) {
        this.appState = appState;
        this.debouncedSearch = debounce(this.handleSearch.bind(this), 500);
    }

    setup() {
        this.setupNavigation();
        this.setupSearch();
        this.setupMapControls();
        this.setupFormHandling();
        this.setupMiscListeners();
    }

    setupNavigation() {
        this.setupSmoothScroll();
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId.startsWith('#')) return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();

                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    this.classList.add('active');

                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navContent'));
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    }

    setupSearch() {
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSearch();
            });
        }

        ['searchLocation', 'mapSearch'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', this.debouncedSearch);
        });

        document.getElementById('searchDate')?.addEventListener('change', this.debouncedSearch);
        document.getElementById('searchType')?.addEventListener('change', this.debouncedSearch);

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.handleDateFilter(filter);
            });
        });
    }

    handleSearch() {
        const location = document.getElementById('searchLocation').value;
        const date = document.getElementById('searchDate').value;
        const type = document.getElementById('searchType').value;

        let filtered = [...EVENT_DATA];

        if (location) {
            filtered = filtered.filter(event =>
                event.location.toLowerCase().includes(location.toLowerCase()) ||
                event.title.toLowerCase().includes(location.toLowerCase())
            );
        }

        if (date) {
            filtered = filtered.filter(event =>
                event.date.startsWith(date)
            );
        }

        if (type) {
            filtered = filtered.filter(event =>
                event.type === type
            );
        }

        this.appState.updateEvents(filtered);
        showNotification('Búsqueda actualizada', 'success');
    }

    handleDateFilter(filter) {
        this.appState.updateFilterButtons(filter);
        this.appState.updateFilters({ date: filter });
    }

    setupMapControls() {
        if (!this.appState.map) return;

        document.getElementById('zoomIn')?.addEventListener('click', () => this.appState.map.zoomIn());
        document.getElementById('zoomOut')?.addEventListener('click', () => this.appState.map.zoomOut());
        document.getElementById('locationBtn')?.addEventListener('click', () => this.locateUser());
        document.getElementById('resetViewBtn')?.addEventListener('click', () => {
            this.appState.map.setView(DEFAULT_MAP_CENTER, DEFAULT_ZOOM);
            showNotification('Vista restablecida', 'info');
        });

        document.getElementById('clearFilters')?.addEventListener('click', () => this.appState.clearFilters());
        document.getElementById('showAllMarkers')?.addEventListener('click', () => {
            if (this.appState.markers.length > 0) {
                const group = L.featureGroup(this.appState.markers);
                this.appState.map.fitBounds(group.getBounds().pad(0.1));
                showNotification('Mostrando todos', 'info');
            }
        });
    }

    locateUser() {
        if (!navigator.geolocation) {
            showNotification('Geolocalización no soportada', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.appState.map.setView([latitude, longitude], 15);
                L.marker([latitude, longitude]).addTo(this.appState.map).bindPopup('¡Estás aquí!').openPopup();
                showNotification('Ubicación encontrada', 'success');
            },
            () => showNotification('No se pudo obtener la ubicación', 'error')
        );
    }

    async searchLocation(query) {
        if (!query.trim()) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
            );
            const data = await response.json();

            if (data?.length > 0) {
                const { lat, lon } = data[0];
                this.appState.map.setView([lat, lon], 15);

                L.marker([lat, lon])
                    .addTo(this.appState.map)
                    .bindPopup(`Ubicación: ${query}`)
                    .openPopup();

                showNotification('Ubicación encontrada', 'success');
            } else {
                showNotification('Ubicación no encontrada', 'error');
            }
        } catch {
            showNotification('Error en la búsqueda', 'error');
        }
    }

    setupFormHandling() {
        const form = document.getElementById('eventForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateEvent();
        });

        document.getElementById('resetForm')?.addEventListener('click', () => {
            setTimeout(() => this.updateFormPreview(), 100);
        });

        ['event-name', 'event-location', 'event-date', 'event-description',
            'event-capacity', 'event-price', 'event-image', 'event-type'].forEach(id => {
                document.getElementById(id)?.addEventListener('input', () => this.updateFormPreview());
            });
    }

    handleCreateEvent() {
        const form = document.getElementById('eventForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const newEvent = {
            id: EVENT_DATA.length + 1,
            title: document.getElementById('event-name').value,
            location: document.getElementById('event-location').value,
            date: document.getElementById('event-date').value,
            capacity: parseInt(document.getElementById('event-capacity').value),
            available: parseInt(document.getElementById('event-capacity').value),
            price: parseFloat(document.getElementById('event-price').value),
            type: document.getElementById('event-type').value,
            category: 'fiesta',
            description: document.getElementById('event-description').value,
            image: document.getElementById('event-image').value || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80',
            coordinates: [
                DEFAULT_MAP_CENTER[0] + (Math.random() * 0.05 - 0.025),
                DEFAULT_MAP_CENTER[1] + (Math.random() * 0.05 - 0.025)
            ]
        };

        EVENT_DATA.unshift(newEvent);
        this.appState.updateEvents(EVENT_DATA);
        form.reset();
        this.updateFormPreview();
        showNotification('¡Evento creado!', 'success');
        location.hash = 'eventos-seccion';
    }

    updateFormPreview() {
        const getValue = (id) => document.getElementById(id)?.value || '';

        document.getElementById('previewTitle').textContent = getValue('event-name') || 'Nombre de la fiesta';
        document.getElementById('previewLocation').textContent = getValue('event-location') || 'Ubicación';
        const date = getValue('event-date');
        document.getElementById('previewDate').textContent = date ? formatDate(date) : 'Fecha';
        document.getElementById('previewDescription').textContent = getValue('event-description') || 'Descripción del evento';
        document.getElementById('previewPlaces').textContent = `${getValue('event-capacity') || 0} plazas`;
        const price = getValue('event-price');
        document.getElementById('previewPrice').textContent = price === '0' || !price ? 'Gratis' : `${price}€`;
        document.getElementById('previewImage').src = getValue('event-image') || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80';
    }

    setupMiscListeners() {
        const modalEl = document.getElementById('loginModal');
        if (modalEl) {
            const loginModal = new bootstrap.Modal(modalEl);
            document.getElementById('loginBtn').onclick = () => loginModal.show();

            document.getElementById('loginForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                showNotification('Sesión iniciada', 'success');
                loginModal.hide();
            });
        }

        window.addEventListener('resize', debounce(() => {
            if (this.appState.map) this.appState.map.invalidateSize();
        }, 250));
    }
}

function initializeMap(appState) {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return null;

    const map = L.map('mapContainer', { zoomControl: false }).setView(DEFAULT_MAP_CENTER, DEFAULT_ZOOM);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    appState.mapInitialized = true;
    return map;
}

function initializeApp() {
    const appState = new AppState();
    window.app = appState;
    appState.map = initializeMap(appState);
    const handlers = new EventHandlers(appState);
    handlers.setup();
    appState.renderAll();
    handlers.updateFormPreview();

    setTimeout(() => showNotification('¡Bienvenido!', 'info'), 500);
}

document.addEventListener('DOMContentLoaded', initializeApp);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
