const EVENT_DATA = [
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

// En diseño brutalista unificamos un poco los colores o usamos el accent para destacar.
const CATEGORY_CONFIG = {
    fiesta: { name: "Fiestas", color: "#ff3300", icon: "fa-glass-cheers" },
    gastronomia: { name: "Gastronomía", color: "#f4f4f4", icon: "fa-utensils" },
    juegos: { name: "Juegos", color: "#ff3300", icon: "fa-dice" },
    musica: { name: "Música", color: "#f4f4f4", icon: "fa-music" },
    barbacoa: { name: "Barbacoas", color: "#ff3300", icon: "fa-fire" },
    networking: { name: "Networking", color: "#f4f4f4", icon: "fa-briefcase" }
};

const DEFAULT_MAP_CENTER = [40.4168, -3.7038];
const DEFAULT_ZOOM = 13;

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + 
               date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    } catch {
        return 'N/A';
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
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
    }, duration);
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
        if (this.mapInitialized) this.renderMapMarkers();
        this.renderLegend();
    }

    applyFilters() {
        let filtered = [...EVENT_DATA];
        if (this.activeFilters.category.length > 0) {
            filtered = filtered.filter(e => this.activeFilters.category.includes(e.category));
        }
        if (this.activeFilters.date !== 'all') {
            filtered = this.filterByDate(filtered, this.activeFilters.date);
        }
        this.currentEvents = filtered;
        this.renderAll();
    }

    filterByDate(events, filter) {
        const now = new Date();
        return events.filter(e => {
            const ed = new Date(e.date);
            if (ed < now) return false;
            switch(filter) {
                case 'today': return ed.toDateString() === now.toDateString();
                case 'week': const w = new Date(now); w.setDate(w.getDate() + 7); return ed >= now && ed <= w;
                case 'month': const m = new Date(now); m.setMonth(m.getMonth() + 1); return ed >= now && ed <= m;
                default: return true;
            }
        });
    }

    clearFilters() {
        this.activeFilters = { category: [], date: 'all' };
        this.currentEvents = [...EVENT_DATA];
        this.renderAll();
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === 'all');
        });
        showNotification('Filtros limpios', 'success');
    }

    renderEvents() {
        const container = document.getElementById('eventsGrid');
        if (!container) return;

        container.innerHTML = this.currentEvents.map(event => `
            <div class="col-md-6 col-lg-4 animate-fade-in-up">
                <div class="card h-100 p-0">
                    <div class="event-image">
                        <img src="${event.image}" alt="${event.title}" loading="lazy">
                        <span class="event-badge">${event.type}</span>
                    </div>
                    <div class="p-4 d-flex flex-column h-100">
                        <h3 class="mb-4">${event.title}</h3>
                        <div class="d-flex justify-content-between text-muted mb-4 small text-uppercase" style="letter-spacing: 0.1em;">
                            <span>${event.location}</span>
                            <span>${formatDate(event.date)}</span>
                        </div>
                        <p class="text-muted mb-4 flex-grow-1 small">${event.description}</p>
                        <div class="d-flex justify-content-between align-items-center pt-3 border-top border-secondary">
                            <span class="h4 text-primary mb-0">${event.price === 0 ? 'GRATIS' : event.price + '€'}</span>
                            <button class="btn btn-primary" onclick="window.app.showEventDetails(${event.id})">VER</button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderMapMarkers() {
        if (!this.map || !this.mapInitialized) return;
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];
        this.currentEvents.forEach(event => {
            if (event.coordinates) {
                const marker = L.marker(event.coordinates, { icon: this.createMarkerIcon(event.category) })
                    .addTo(this.map).bindPopup(this.createPopupContent(event));
                this.markers.push(marker);
            }
        });
        if (this.markers.length > 0 && this.markers.length < EVENT_DATA.length) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    createMarkerIcon(category) {
        const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.fiesta;
        return L.divIcon({
            html: `<div class="custom-marker"><i class="fas ${config.icon}"></i></div>`,
            className: 'custom-div-icon', iconSize: [44, 44], iconAnchor: [22, 44], popupAnchor: [0, -44]
        });
    }

    createPopupContent(event) {
        return `
            <div class="p-2 text-uppercase" style="min-width: 200px;">
                <h5 class="mb-3">${event.title}</h5>
                <div class="small text-muted mb-2">${event.location} | ${formatDate(event.date)}</div>
                <div class="h5 text-primary my-3">${event.price === 0 ? 'GRATIS' : event.price + '€'}</div>
                <button onclick="window.app.showEventDetails(${event.id})" class="btn btn-primary w-100 p-2">VER INFO</button>
            </div>
        `;
    }

    renderLegend() {
        const container = document.getElementById('legendItems');
        if (!container) return;
        container.innerHTML = Object.keys(CATEGORY_CONFIG).map(category => {
            const config = CATEGORY_CONFIG[category];
            const count = this.currentEvents.filter(e => e.category === category).length;
            const isActive = this.activeFilters.category.includes(category);
            return `
                <div class="legend-item ${isActive ? 'active' : ''}" onclick="window.app.toggleCategoryFilter('${category}')">
                    <span class="legend-color" style="background: ${config.color}"></span>
                    <span class="flex-grow-1 small text-uppercase" style="letter-spacing: 0.1em;">${config.name}</span>
                    <span class="text-muted small">(${count})</span>
                </div>
            `;
        }).join('');
    }

    showEventDetails(eventId) {
        const event = EVENT_DATA.find(e => e.id === eventId);
        if (!event) return;
        if (confirm(`INFO DEL EVENTO:\\n\\n${event.title}\\nLugar: ${event.location}\\nPrecio: ${event.price}€\\n\\n¿Inscribirse?`)) {
            showNotification('INSCRIPCIÓN EXITOSA', 'success');
        }
    }

    toggleCategoryFilter(category) {
        const index = this.activeFilters.category.indexOf(category);
        if (index === -1) this.activeFilters.category.push(category);
        else this.activeFilters.category.splice(index, 1);
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
        this.setupMisc();
    }

    setupNavigation() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#' || !targetId.startsWith('#')) return;
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
                    const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navContent'));
                    if (bsCollapse) bsCollapse.hide();
                }
            });
        });
    }

    setupSearch() {
        document.getElementById('searchBtn')?.addEventListener('click', e => { e.preventDefault(); this.handleSearch(); });
        ['searchLocation', 'mapSearch'].forEach(id => document.getElementById(id)?.addEventListener('input', this.debouncedSearch));
        ['searchDate', 'searchType'].forEach(id => document.getElementById(id)?.addEventListener('change', this.debouncedSearch));
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                this.appState.updateFilters({ date: e.currentTarget.dataset.filter });
            });
        });
    }

    handleSearch() {
        const loc = document.getElementById('searchLocation').value.toLowerCase();
        const date = document.getElementById('searchDate').value;
        const type = document.getElementById('searchType').value;

        let filtered = [...EVENT_DATA];
        if (loc) filtered = filtered.filter(e => e.location.toLowerCase().includes(loc) || e.title.toLowerCase().includes(loc));
        if (date) filtered = filtered.filter(e => e.date.startsWith(date));
        if (type) filtered = filtered.filter(e => e.type === type);
        
        this.appState.updateEvents(filtered);
    }

    setupMapControls() {
        if (!this.appState.map) return;
        document.getElementById('zoomIn')?.addEventListener('click', () => this.appState.map.zoomIn());
        document.getElementById('zoomOut')?.addEventListener('click', () => this.appState.map.zoomOut());
        document.getElementById('resetViewBtn')?.addEventListener('click', () => this.appState.map.setView(DEFAULT_MAP_CENTER, DEFAULT_ZOOM));
        document.getElementById('clearFilters')?.addEventListener('click', () => this.appState.clearFilters());
        document.getElementById('showAllMarkers')?.addEventListener('click', () => {
            if (this.appState.markers.length > 0) this.appState.map.fitBounds(L.featureGroup(this.appState.markers).getBounds().pad(0.1));
        });
    }

    setupFormHandling() {
        const form = document.getElementById('eventForm');
        if (!form) return;
        form.addEventListener('submit', e => {
            e.preventDefault();
            if (!form.checkValidity()) { form.reportValidity(); return; }
            
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
                coordinates: [DEFAULT_MAP_CENTER[0] + (Math.random()*0.02-0.01), DEFAULT_MAP_CENTER[1] + (Math.random()*0.02-0.01)]
            };
            EVENT_DATA.unshift(newEvent);
            this.appState.updateEvents(EVENT_DATA);
            form.reset();
            this.updateFormPreview();
            showNotification('EVENTO PUBLICADO', 'success');
            location.hash = 'eventos-seccion';
        });

        ['event-name', 'event-location', 'event-date', 'event-description', 'event-capacity', 'event-price', 'event-image'].forEach(id => {
            document.getElementById(id)?.addEventListener('input', () => this.updateFormPreview());
        });
    }

    updateFormPreview() {
        const val = id => document.getElementById(id)?.value || '';
        document.getElementById('previewTitle').textContent = val('event-name') || 'TÍTULO';
        document.getElementById('previewLocation').textContent = val('event-location') || 'UBICACIÓN';
        document.getElementById('previewDate').textContent = val('event-date') ? formatDate(val('event-date')) : 'FECHA';
        document.getElementById('previewDescription').textContent = val('event-description') || 'Descripción aparecerá aquí...';
        document.getElementById('previewPlaces').textContent = `${val('event-capacity') || 0} PAX`;
        const p = val('event-price');
        document.getElementById('previewPrice').textContent = (p === '0' || !p) ? 'GRATIS' : `${p}€`;
        document.getElementById('previewImage').src = val('event-image') || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80';
    }

    setupMisc() {
        const modalEl = document.getElementById('loginModal');
        if (modalEl) {
            const loginModal = new bootstrap.Modal(modalEl);
            document.getElementById('loginBtn').onclick = () => loginModal.show();
            document.getElementById('loginForm')?.addEventListener('submit', e => {
                e.preventDefault();
                showNotification('ACCESO APROBADO', 'success');
                loginModal.hide();
            });
        }
        window.addEventListener('resize', debounce(() => { if(this.appState.map) this.appState.map.invalidateSize(); }, 250));
    }
}

function initializeApp() {
    const appState = new AppState();
    window.app = appState;
    const mapContainer = document.getElementById('mapContainer');
    if (mapContainer) {
        appState.map = L.map('mapContainer', { zoomControl: false }).setView(DEFAULT_MAP_CENTER, DEFAULT_ZOOM);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(appState.map);
        appState.mapInitialized = true;
    }
    const handlers = new EventHandlers(appState);
    handlers.setup();
    appState.renderAll();
    handlers.updateFormPreview();
}

document.addEventListener('DOMContentLoaded', initializeApp);
