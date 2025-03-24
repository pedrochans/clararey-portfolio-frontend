/**
 * Gestión de navegación entre secciones con transiciones animadas 
 * para el portfolio de Clara Rey
 */
document.addEventListener("DOMContentLoaded", () => {
    // Elementos DOM principales 
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section");
    const transitionDuration = 500; // ms - debe coincidir con el CSS
    
    // Control del estado de la aplicación
    let isTransitioning = false;
    let currentSection = document.querySelector(".section.active");
    
    // Aplicar la animación inicial
    initializeView();
    
    // Configurar eventos
    setupNavigationEvents();
    setupAdditionalEventListeners();
    
    /**
     * Configura la vista inicial de la aplicación
     */
    function initializeView() {
        const activeSection = localStorage.getItem("activeSection");
        
        // Añadir animación inicial solo si no hay sección guardada
        if (!activeSection) {
            document.querySelector(".section.active").classList.add("initial-active");
            return;
        }
        
        // Restaurar la sección activa sin animaciones
        restoreSavedSection(activeSection);
    }
    
    /**
     * Configura los eventos de navegación principal
     */
    function setupNavigationEvents() {
        navLinks.forEach(link => {
            link.addEventListener("click", handleNavigation);
        });
    }
    
    /**
     * Configura eventos adicionales como el botón "Ver más"
     */
    function setupAdditionalEventListeners() {
        const botonVerMas = document.querySelector('.btn-ver-mas');
        if (botonVerMas) {
            botonVerMas.addEventListener('click', () => {
                document.querySelector('.nav-link[data-section="sobre-mi"]').click();
            });
        }
    }
    
    /**
     * Maneja la navegación entre secciones
     * @param {Event} event - Evento de clic
     */
    function handleNavigation(event) {
        event.preventDefault();
        
        // Evitar múltiples clics durante una transición
        if (isTransitioning) return;
        
        const targetSectionId = this.dataset.section;
        const targetSection = document.getElementById(targetSectionId);
        
        // Si ya estamos en esa sección, no hacer nada
        if (currentSection === targetSection) return;
        
        // Iniciar la transición
        isTransitioning = true;
        
        // Actualizar navegación
        updateActiveNavLink(this);
        
        // Realizar la transición
        transitionToNewSection(currentSection, targetSection);
    }
    
    /**
     * Actualiza la navegación para reflejar la sección activa
     * @param {HTMLElement} activeLink - Enlace de navegación activo
     */
    function updateActiveNavLink(activeLink) {
        navLinks.forEach(link => link.classList.remove("active"));
        activeLink.classList.add("active");
    }
    
    /**
     * Realiza la transición entre secciones
     * @param {HTMLElement} fromSection - Sección actual
     * @param {HTMLElement} toSection - Sección destino
     */
    function transitionToNewSection(fromSection, toSection) {
        // Preparar la sección actual para la salida
        prepareForExit(fromSection);
        
        // Después de la animación de salida, preparar la entrada
        setTimeout(() => {
            completeExit(fromSection);
            prepareForEntry(toSection);
            
            // Actualizar la sección actual
            currentSection = toSection;
            
            // Guardar la sección activa en localStorage
            localStorage.setItem("activeSection", toSection.id);
            
            // Permitir nuevas transiciones después de completar
            setTimeout(() => {
                isTransitioning = false;
            }, transitionDuration);
            
        }, transitionDuration);
    }
    
    /**
     * Prepara una sección para animación de salida
     * @param {HTMLElement} section - Sección a preparar
     */
    function prepareForExit(section) {
        // Manejo especial para la sección hero
        if (section.id === 'inicio') {
            section.style.display = "flex";
            void section.offsetWidth; // Forzar reflow
        }
        
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
    }
    
    /**
     * Completa la salida de una sección
     * @param {HTMLElement} section - Sección que sale
     */
    function completeExit(section) {
        section.classList.remove("active");
        section.style.display = "none";
    }
    
    /**
     * Prepara una sección para animación de entrada
     * @param {HTMLElement} section - Sección a preparar
     */
    function prepareForEntry(section) {
        // Limpiar estilos residuales
        resetStyles(section);
        
        // Configurar display según el tipo de sección
        section.style.display = section.id === 'inicio' ? "flex" : "block";
        section.style.opacity = "0";
        section.style.transform = "translateY(20px)";
        section.classList.add("active");
        
        // Ajustar el fondo del contenedor de secciones según la sección activa
        const sectionsContainer = document.querySelector('.sections-container');
        if (section.classList.contains('sobre-mi') || 
            section.classList.contains('proyectos') || 
            section.classList.contains('galeria') || 
            section.classList.contains('contacto')) {
            sectionsContainer.style.backgroundColor = 'var(--color-section-bg)';
        } else {
            sectionsContainer.style.backgroundColor = 'var(--color-white)';
        }
        
        // Forzar un reflow
        void section.offsetWidth;
        
        // Animar la entrada con requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
            section.style.opacity = "1";
            section.style.transform = "translateY(0)";
        });
    }
    
    /**
     * Restaura la sección guardada sin animaciones
     * @param {string} sectionId - ID de la sección a restaurar
     */
    function restoreSavedSection(sectionId) {
        const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
        const targetSection = document.getElementById(sectionId);
        
        if (!activeLink || !targetSection) return;
        
        // Actualizar estado solo si es diferente a la sección actual
        if (currentSection !== targetSection) {
            // Limpiar secciones
            sections.forEach(section => {
                section.classList.remove("active", "initial-active");
                resetStyles(section);
            });
            
            // Limpiar navegación
            navLinks.forEach(link => {
                link.classList.remove("active");
            });
            
            // Ajustar el fondo del contenedor según la sección restaurada
            const sectionsContainer = document.querySelector('.sections-container');
            if (targetSection.classList.contains('sobre-mi') || 
                targetSection.classList.contains('proyectos') || 
                targetSection.classList.contains('galeria') || 
                targetSection.classList.contains('contacto')) {
                sectionsContainer.style.backgroundColor = 'var(--color-section-bg)';
            } else {
                sectionsContainer.style.backgroundColor = 'var(--color-white)';
            }
            
            // Actualizar a la nueva sección
            targetSection.classList.add("active");
            activeLink.classList.add("active");
            currentSection = targetSection;
        }
    }
    
    /**
     * Elimina estilos inline que puedan interferir con las transiciones
     * @param {HTMLElement} section - Sección a limpiar
     */
    function resetStyles(section) {
        section.style.removeProperty('opacity');
        section.style.removeProperty('transform');
        section.style.removeProperty('display');
    }
});
