// =============================================
// DATA & CONFIGURATION
// =============================================
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

// =============================================
// UTILITY FUNCTIONS
// =============================================
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

// =============================================
// STATE MANAGEMENT CLASS
// =============================================
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
            <div class="event-card animate-fade-in">
                <div class="event-image">
                    <img src="${event.image}" alt="${event.title}" loading="lazy">
                    <span class="event-badge badge-${event.category}">${event.type}</span>
                </div>
                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <div class="event-meta">
                        <div class="meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${formatDate(event.date)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-users"></i>
                            <span>${event.available} plazas</span>
                        </div>
                    </div>
                    <p class="event-description">${event.description}</p>
                    <div class="event-footer">
                        <span class="event-price">${event.price === 0 ? 'Gratis' : event.price + '€'}</span>
                        <button class="btn btn-primary btn-sm" onclick="window.app.showEventDetails(${event.id})">
                            Ver Detalles
                        </button>
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

        if (this.markers.length > 0) {
            const group = L.featureGroup(this.markers);
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    createMarkerIcon(category) {
        const config = CATEGORY_CONFIG[category];
        return L.divIcon({
            html: `<div class="custom-marker" style="border-color: ${config.color};">
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
            <div style="min-width: 250px; padding: 10px;">
                <h4 style="margin: 0 0 10px 0; color: var(--dark);">${event.title}</h4>
                <p style="margin: 0 0 5px 0; color: var(--gray);">
                    <i class="fas fa-map-marker-alt"></i> ${event.location}
                </p>
                <p style="margin: 0 0 5px 0; color: var(--gray);">
                    <i class="fas fa-calendar-alt"></i> ${formatDate(event.date)}
                </p>
                <p style="margin: 0 0 10px 0; color: var(--gray);">
                    <i class="fas fa-users"></i> ${event.available} plazas
                </p>
                <div style="font-size: 1.2rem; font-weight: bold; color: var(--primary); margin-bottom: 10px;">
                    ${event.price === 0 ? 'Gratis' : event.price + '€'}
                </div>
                <button onclick="window.app.showEventDetails(${event.id})" 
                        style="width: 100%; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
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
            const isActive = this.activeFilters.category.includes(category) ||
                this.activeFilters.category.length === 0;

            return `
                <div class="legend-item ${isActive ? 'active' : ''}" 
                     data-category="${category}"
                     onclick="window.app.toggleCategoryFilter('${category}')">
                    <span class="legend-color" style="background: ${config.color}"></span>
                    <span>${config.name}</span>
                    <span class="legend-count">(${count})</span>
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

// =============================================
// EVENT HANDLERS CLASS
// =============================================
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
        document.getElementById('mobileMenuBtn').addEventListener('click', this.toggleMobileMenu);
        this.setupSmoothScroll();

        document.addEventListener('click', (e) => {
            const navContainer = document.querySelector('.nav-container');
            const menuBtn = document.getElementById('mobileMenuBtn');

            if (navContainer.classList.contains('active') &&
                !e.target.closest('.nav-container') &&
                !e.target.closest('.mobile-menu-btn')) {
                navContainer.classList.remove('active');
            }
        });
    }

    toggleMobileMenu() {
        document.querySelector('.nav-container').classList.toggle('active');
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');

                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });

                    document.querySelector('.nav-container').classList.remove('active');
                }
            });
        });
    }

    setupSearch() {
        document.getElementById('searchBtn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        document.getElementById('searchLocation').addEventListener('input', this.debouncedSearch);
        document.getElementById('searchDate').addEventListener('change', this.debouncedSearch);
        document.getElementById('searchType').addEventListener('change', this.debouncedSearch);

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
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
                event.location.toLowerCase().includes(location.toLowerCase())
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
        showNotification('Búsqueda realizada', 'success');
    }

    handleDateFilter(filter) {
        this.appState.updateFilterButtons(filter);
        this.appState.updateFilters({ date: filter });
    }

    setupMapControls() {
        if (!this.appState.map) return;

        document.getElementById('zoomIn').addEventListener('click', () => {
            this.appState.map.zoomIn();
            showNotification('Zoom ampliado', 'info');
        });

        document.getElementById('zoomOut').addEventListener('click', () => {
            this.appState.map.zoomOut();
            showNotification('Zoom reducido', 'info');
        });

        document.getElementById('locationBtn').addEventListener('click', () => {
            this.locateUser();
        });

        document.getElementById('resetViewBtn').addEventListener('click', () => {
            this.appState.map.setView(DEFAULT_MAP_CENTER, DEFAULT_ZOOM);
            showNotification('Vista restablecida', 'info');
        });

        document.getElementById('mapSearch').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchLocation(e.target.value);
            }
        });

        document.getElementById('clearFilters').addEventListener('click', () => {
            this.appState.clearFilters();
        });

        document.getElementById('showAllMarkers').addEventListener('click', () => {
            if (this.appState.markers.length > 0) {
                const group = L.featureGroup(this.appState.markers);
                this.appState.map.fitBounds(group.getBounds().pad(0.1));
                showNotification('Mostrando todos los eventos', 'info');
            }
        });
    }

    locateUser() {
        if (!navigator.geolocation) {
            showNotification('Tu navegador no soporta geolocalización', 'error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                this.appState.map.setView([latitude, longitude], 15);

                L.marker([latitude, longitude], {
                    icon: L.divIcon({
                        html: '<div class="custom-marker" style="border-color: var(--primary); background: var(--primary); color: white;"><i class="fas fa-user"></i></div>',
                        className: 'custom-div-icon',
                        iconSize: [40, 40]
                    })
                })
                    .addTo(this.appState.map)
                    .bindPopup('¡Estás aquí!')
                    .openPopup();

                showNotification('Ubicación encontrada', 'success');
            },
            (error) => {
                showNotification('No se pudo obtener tu ubicación', 'error');
            }
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

        document.getElementById('resetForm').addEventListener('click', () => {
            setTimeout(this.updateFormPreview.bind(this), 100);
        });

        const formInputs = ['event-name', 'event-location', 'event-date',
            'event-description', 'event-capacity', 'event-price', 'event-image'];
        formInputs.forEach(id => {
            document.getElementById(id).addEventListener('input',
                debounce(this.updateFormPreview.bind(this), 300)
            );
        });

        document.getElementById('event-type').addEventListener('change',
            debounce(this.updateFormPreview.bind(this), 300)
        );
    }

    handleCreateEvent() {
        const form = document.getElementById('eventForm');

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const name = document.getElementById('event-name').value.trim();
        const location = document.getElementById('event-location').value.trim();
        const date = document.getElementById('event-date').value;
        const capacity = parseInt(document.getElementById('event-capacity').value);
        const price = parseFloat(document.getElementById('event-price').value);
        const type = document.getElementById('event-type').value;
        const description = document.getElementById('event-description').value.trim();
        const imageUrl = document.getElementById('event-image').value.trim();

        if (imageUrl && !isValidUrl(imageUrl)) {
            showNotification('Por favor, introduce una URL válida para la imagen', 'error');
            return;
        }

        const eventDate = new Date(date);
        if (eventDate < new Date()) {
            showNotification('La fecha del evento debe ser futura', 'error');
            return;
        }

        const newEvent = {
            id: EVENT_DATA.length + 1,
            title: name,
            location: location,
            date: date,
            capacity: capacity,
            available: capacity,
            price: price,
            type: type,
            category: 'fiesta',
            description: description,
            image: imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80',
            coordinates: [
                DEFAULT_MAP_CENTER[0] + (Math.random() * 0.05 - 0.025),
                DEFAULT_MAP_CENTER[1] + (Math.random() * 0.05 - 0.025)
            ]
        };

        EVENT_DATA.unshift(newEvent);
        this.appState.updateEvents([newEvent, ...this.appState.currentEvents]);

        form.reset();
        this.updateFormPreview();
        showNotification('¡Evento creado exitosamente!', 'success');

        this.appState.map.setView(newEvent.coordinates, 15);
    }

    updateFormPreview() {
        const getValue = (id) => document.getElementById(id)?.value || '';

        const previewData = {
            title: getValue('event-name') || 'Nombre de la fiesta',
            location: getValue('event-location') || 'Ubicación',
            date: getValue('event-date'),
            description: getValue('event-description') || 'Descripción del evento aparecerá aquí',
            capacity: getValue('event-capacity') || '0',
            price: getValue('event-price') || '0',
            image: getValue('event-image') || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80'
        };

        document.getElementById('previewTitle').textContent = previewData.title;
        document.getElementById('previewLocation').textContent = previewData.location;
        document.getElementById('previewDate').textContent = previewData.date ? formatDate(previewData.date) : 'Fecha';
        document.getElementById('previewDescription').textContent = previewData.description;
        document.getElementById('previewPlaces').textContent = `${previewData.capacity} plazas`;
        document.getElementById('previewPrice').textContent =
            previewData.price === '0' ? 'Gratis' : `${previewData.price}€`;
        document.getElementById('previewImage').src = previewData.image;
    }

    setupMiscListeners() {
        const modalEl = document.getElementById('loginModal');
        if (modalEl) {
            const loginModal = new bootstrap.Modal(modalEl);
            document.getElementById('loginBtn').onclick = () => loginModal.show();

            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.onsubmit = (e) => {
                    e.preventDefault();
                    showNotification('Sesión iniciada correctamente', 'success');
                    loginModal.hide();
                    loginForm.reset();
                };
            }
        }

        window.addEventListener('resize', debounce(() => {
            if (this.appState.map) {
                this.appState.map.invalidateSize();
            }
        }, 250));
    }
}

// =============================================
// MAP INITIALIZATION
// =============================================
function initializeMap(appState) {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return null;

    try {
        const map = L.map('mapContainer').setView(DEFAULT_MAP_CENTER, DEFAULT_ZOOM);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
            detectRetina: true
        }).addTo(map);

        appState.mapInitialized = true;
        return map;
    } catch (error) {
        console.error('Error initializing map:', error);
        showNotification('Error al cargar el mapa', 'error');
        return null;
    }
}

// =============================================
// APPLICATION INITIALIZATION
// =============================================
function initializeApp() {
    try {
        const appState = new AppState();
        window.app = appState;

        appState.map = initializeMap(appState);

        const eventHandlers = new EventHandlers(appState);
        eventHandlers.setup();

        appState.renderAll();
        eventHandlers.updateFormPreview();

        setTimeout(() => {
            showNotification('¡Bienvenido a SocialLocal!', 'info');
        }, 1000);

    } catch (error) {
        console.error('Error initializing app:', error);
        showNotification('Error al inicializar la aplicación', 'error');
    }
}

// =============================================
// START APPLICATION
// =============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

