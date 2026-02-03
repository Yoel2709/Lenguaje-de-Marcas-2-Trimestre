// ============================================
// DATOS Y CONFIGURACIÓN
// ============================================

const eventData = [
    {
        id: 1,
        title: "Sunset Party en Terraza Premium",
        location: "Chalet en La Moraleja",
        date: "2024-06-15T20:00",
        capacity: 25,
        price: 15,
        type: "Fiesta en Casa",
        category: "fiesta",
        description: "DJ en directo, cócteles premium y vistas espectaculares. Ambiente exclusivo y buen rollo garantizado.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
    },
    {
        id: 2,
        title: "Cena Gourmet con Chef Profesional",
        location: "Loft en Chamberí",
        date: "2024-06-21T21:00",
        capacity: 12,
        price: 45,
        type: "Cena Privada",
        category: "gastronomia",
        description: "Menú degustación de 5 platos con maridaje. Experiencia culinaria única en ambiente íntimo.",
        image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
        id: 3,
        title: "Noche de Juegos de Mesa Premium",
        location: "Casa en Malasaña",
        date: "2024-06-20T19:30",
        capacity: 8,
        price: 10,
        type: "Juegos de Mesa",
        category: "juegos",
        description: "Colección de juegos modernos, snacks y bebidas. Perfecto para hacer nuevas amistades.",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
        id: 4,
        title: "Concierto Acústico en Salón Privado",
        location: "Estudio en Lavapiés",
        date: "2024-06-22T22:00",
        capacity: 30,
        price: 20,
        type: "Concierto Íntimo",
        category: "musica",
        description: "Artistas emergentes en formato íntimo. Barra de cervezas artesanales incluida.",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC9G-E9w_a6v9TJPaCamhDpMJZN_TqlfGVVw&s"
    },
    {
        id: 5,
        title: "Barbacoa Premium en Jardín Privado",
        location: "Jardín en El Viso",
        date: "2024-06-23T14:00",
        capacity: 15,
        price: 25,
        type: "Barbacoa",
        category: "barbacoa",
        description: "Carne a la parrilla, ensaladas y bebidas. Piscina disponible. Ambiente familiar.",
        image: "https://thumbs.dreamstime.com/b/bebida-de-salchichas-asadas-fest%C3%ADn-barbacoa-fogata-disfrute-una-deliciosa-fiesta-con-sus-amigos-cerveza-la-parrilla-y-calurosas-350459237.jpg"
    },
    {
        id: 6,
        title: "Afterwork Tech & Networking",
        location: "Oficina en Salamanca",
        date: "2024-06-19T19:00",
        capacity: 40,
        price: 0,
        type: "Afterwork",
        category: "networking",
        description: "Conexiones profesionales en ambiente distendido. Cócteles y tapas gourmet.",
        image: "https://images.ctfassets.net/a4oylpwiu3rz/2KunVXQLydWvd8vZPpIYzs/a103feeb2b2c36fef8871330d7031a8e/Tasting_Room_-_Web_-13-08-21-_N62A5803.webp?q=60"
    }
];

const categoryIcons = {
    fiesta: "fas fa-glass-cheers",
    gastronomia: "fas fa-utensils",
    juegos: "fas fa-dice",
    musica: "fas fa-music",
    barbacoa: "fas fa-fire",
    networking: "fas fa-briefcase"
};

let currentEvents = [...eventData];
let currentZoom = 14;
let activeFilters = {
    category: [],
    date: 'all'
};

// ============================================
// INICIALIZACIÓN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    renderEvents();
    renderMapMarkers();
    renderLegend();
    setupEventListeners();
    setupFormPreview();
}

// ============================================
// RENDERIZADO
// ============================================

function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';
    currentEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

function createEventCard(event) {
    const article = document.createElement('article');
    article.className = 'event-card animate-fade-in';
    article.innerHTML = `
        <div class="event-image">
            <img src="${event.image}" alt="${event.title}" loading="lazy">
            <span class="event-badge ${event.category}">${event.type}</span>
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
                    <span>${event.capacity} plazas disponibles</span>
                </div>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-footer">
                <span class="event-price">${getPriceText(event.price)}</span>
                <button class="btn btn-small" onclick="showEventDetails(${event.id})">Ver Detalles</button>
            </div>
        </div>
    `;
    return article;
}

function renderMapMarkers() {
    const mapMarkers = document.querySelector('.map-markers');
    const positions = [
        { left: '30%', top: '20%' },
        { left: '40%', top: '40%' },
        { left: '25%', top: '60%' },
        { left: '60%', top: '30%' },
        { left: '70%', top: '50%' },
        { left: '50%', top: '70%' }
    ];

    mapMarkers.innerHTML = '';
    currentEvents.forEach((event, index) => {
        if (index < positions.length) {
            const marker = createMapMarker(event, index, positions[index]);
            mapMarkers.appendChild(marker);
        }
    });
}

function createMapMarker(event, index, position) {
    const marker = document.createElement('div');
    marker.className = `map-marker marker-${index + 1}`;
    marker.style.left = position.left;
    marker.style.top = position.top;
    marker.innerHTML = `
        <div class="marker-pin">
            <i class="${categoryIcons[event.category]}"></i>
        </div>
        <div class="marker-card">
            <h4>${event.title.split(' ').slice(0, 2).join(' ')}</h4>
            <p class="marker-location"><i class="fas fa-map-marker-alt"></i> ${event.location.split(' ').slice(-2).join(' ')}</p>
            <p class="marker-price">${getPriceText(event.price)}</p>
            <p class="marker-date">${formatDateShort(event.date)}</p>
        </div>
    `;
    marker.addEventListener('click', () => showEventDetails(event.id));
    return marker;
}

function renderLegend() {
    const legendItems = document.getElementById('legendItems');
    const categories = [...new Set(eventData.map(event => event.category))];
    
    legendItems.innerHTML = '';
    categories.forEach(category => {
        const item = createLegendItem(category);
        legendItems.appendChild(item);
    });
}

function createLegendItem(category) {
    const categoryNames = {
        fiesta: "Fiestas y Social",
        gastronomia: "Gastronomía",
        juegos: "Juegos y Ocio",
        musica: "Música y Arte",
        barbacoa: "Barbacoas",
        networking: "Networking"
    };

    const count = currentEvents.filter(e => e.category === category).length;
    const item = document.createElement('div');
    item.className = 'legend-item active';
    item.setAttribute('data-filter', category);
    item.innerHTML = `
        <span class="legend-color ${category}"></span>
        <span>${categoryNames[category]}</span>
        <span class="legend-count">(${count})</span>
    `;
    item.addEventListener('click', () => toggleCategoryFilter(category));
    return item;
}

// ============================================
// GESTIÓN DE EVENTOS
// ============================================

function setupEventListeners() {
    setupNavigation();
    setupMobileMenu();
    setupLoginButton();
    setupSearchBar();
    setupEventFilters();
    setupMapControls();
    setupSocialLinks();
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupMobileMenu() {
    document.getElementById('mobileMenuBtn').addEventListener('click', function() {
        const nav = document.querySelector('.nav');
        nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', function(e) {
        const nav = document.querySelector('.nav');
        const mobileBtn = document.getElementById('mobileMenuBtn');
        if (!nav.contains(e.target) && !mobileBtn.contains(e.target)) {
            nav.style.display = 'none';
        }
    });

    window.addEventListener('resize', function() {
        const nav = document.querySelector('.nav');
        if (window.innerWidth > 768) {
            nav.style.display = '';
        }
    });
}

function setupLoginButton() {
    document.getElementById('loginBtn').addEventListener('click', function() {
        showNotification('Función de login en desarrollo', 'info');
    });
}

function setupSearchBar() {
    document.getElementById('searchBtn').addEventListener('click', function(e) {
        e.preventDefault();
        const location = document.getElementById('searchLocation').value;
        const date = document.getElementById('searchDate').value;
        const type = document.getElementById('searchType').value;
        filterEvents({ location, date, type });
        showNotification('Búsqueda realizada', 'success');
    });
}

function setupEventFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const filter = this.getAttribute('data-filter');
            filterByDate(filter);
        });
    });
}

function setupMapControls() {
    document.getElementById('zoomIn').addEventListener('click', () => {
        if (currentZoom < 20) {
            currentZoom++;
            updateZoomLevel();
        }
    });

    document.getElementById('zoomOut').addEventListener('click', () => {
        if (currentZoom > 1) {
            currentZoom--;
            updateZoomLevel();
        }
    });

    document.getElementById('locationBtn').addEventListener('click', function() {
        showNotification('Ubicación centrada en tu posición', 'info');
    });

    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);
}

function setupSocialLinks() {
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('Red social en desarrollo', 'info');
        });
    });
}

// ============================================
// VISTA PREVIA DEL FORMULARIO
// ============================================

function setupFormPreview() {
    const formInputs = ['event-name', 'event-location', 'event-date', 'event-description', 'event-capacity', 'event-price', 'event-image'];
    formInputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('input', updateFormPreview);
    });
    document.getElementById('event-type').addEventListener('change', updateFormPreview);
    document.getElementById('eventForm').addEventListener('submit', createNewEvent);
    document.getElementById('resetForm').addEventListener('click', function() {
        setTimeout(updateFormPreview, 100);
    });
    updateFormPreview();
}

function updateFormPreview() {
    const title = document.getElementById('event-name').value || 'Nombre de la fiesta';
    const location = document.getElementById('event-location').value || 'Ubicación';
    const date = document.getElementById('event-date').value ? formatDate(document.getElementById('event-date').value) : 'Fecha';
    const description = document.getElementById('event-description').value || 'Descripción del evento aparecerá aquí';
    const capacity = document.getElementById('event-capacity').value || '0';
    const price = document.getElementById('event-price').value ? parseFloat(document.getElementById('event-price').value) : 0;
    const image = document.getElementById('event-image').value || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80';
    
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewLocation').textContent = location;
    document.getElementById('previewDate').textContent = date;
    document.getElementById('previewDescription').textContent = description;
    document.getElementById('previewPlaces').textContent = `${capacity} plazas`;
    document.getElementById('previewPrice').textContent = getPriceText(price);
    
    const img = document.getElementById('previewImage');
    img.src = image;
    img.onerror = () => {
        img.src = 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80';
    };
}

// ============================================
// FILTROS Y BÚSQUEDA
// ============================================

function filterEvents(filters) {
    let filtered = [...eventData];
    if (filters.location) {
        filtered = filtered.filter(event => event.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.date) {
        filtered = filtered.filter(event => event.date.startsWith(filters.date));
    }
    if (filters.type) {
        filtered = filtered.filter(event => event.type === filters.type);
    }
    currentEvents = filtered;
    applyFiltersUI();
}

function filterByDate(filter) {
    activeFilters.date = filter;
    applyFilters();
}

function toggleCategoryFilter(category) {
    const index = activeFilters.category.indexOf(category);
    if (index === -1) {
        activeFilters.category.push(category);
    } else {
        activeFilters.category.splice(index, 1);
    }
    applyFilters();
    updateLegendActiveState();
}

function applyFilters() {
    let filtered = [...eventData];
    
    if (activeFilters.category.length > 0) {
        filtered = filtered.filter(event => activeFilters.category.includes(event.category));
    }
    
    const now = new Date();
    filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        switch(activeFilters.date) {
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
    
    currentEvents = filtered;
    applyFiltersUI();
}

function applyFiltersUI() {
    renderEvents();
    renderMapMarkers();
    renderLegend();
}

function clearAllFilters() {
    activeFilters = { category: [], date: 'all' };
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
    document.getElementById('searchLocation').value = '';
    document.getElementById('searchDate').value = '';
    document.getElementById('searchType').value = '';
    currentEvents = [...eventData];
    applyFiltersUI();
    showNotification('Filtros limpiados', 'success');
}

function updateLegendActiveState() {
    document.querySelectorAll('.legend-item').forEach(item => {
        const category = item.getAttribute('data-filter');
        if (activeFilters.category.length === 0 || activeFilters.category.includes(category)) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// ============================================
// FUNCIONES AUXILIARES
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('es-ES', options);
}

function formatDateShort(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('es-ES', options);
}

function getPriceText(price) {
    return price === 0 || price === '0' ? 'Gratis' : `${price}€`;
}

function updateZoomLevel() {
    document.getElementById('zoomLevel').textContent = `Zoom: ${currentZoom}`;
}

function showEventDetails(eventId) {
    const event = eventData.find(e => e.id === eventId);
    if (event) {
        showNotification(`Mostrando detalles de: ${event.title}`, 'info');
    }
}

function createNewEvent(e) {
    e.preventDefault();
    const form = document.getElementById('eventForm');
    
    if (form.checkValidity()) {
        const newEvent = {
            id: eventData.length + 1,
            title: document.getElementById('event-name').value,
            location: document.getElementById('event-location').value,
            date: document.getElementById('event-date').value,
            capacity: parseInt(document.getElementById('event-capacity').value),
            price: parseFloat(document.getElementById('event-price').value),
            type: document.getElementById('event-type').value,
            category: 'fiesta',
            description: document.getElementById('event-description').value,
            image: document.getElementById('event-image').value || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1169&q=80'
        };
        
        eventData.unshift(newEvent);
        currentEvents = [...eventData];
        applyFiltersUI();
        form.reset();
        updateFormPreview();
        showNotification('¡Evento creado exitosamente!', 'success');
    } else {
        form.reportValidity();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = 'notification';
    notification.classList.add(type);
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}
