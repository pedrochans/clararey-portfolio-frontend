/**
 * Gestión de navegación entre secciones con transiciones animadas 
 * para el portfolio de Clara Rey
 */
document.addEventListener("DOMContentLoaded", () => {
    // Elementos DOM principales 
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section");
    const logoLink = document.querySelector(".logo-link");
    const transitionDuration = 500; // ms - debe coincidir con el CSS
    
    // Control del estado de la aplicación
    let isTransitioning = false;
    let currentSection = document.querySelector(".section.active");
    
    // Aplicar la animación inicial
    initializeView();
    
    // Configurar eventos
    setupNavigationEvents();
    setupAdditionalEventListeners();
    
    // Sistema de carrusel para la sección Hero
    setupHeroCarousel();
    
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
        // Configurar navegación desde los enlaces del menú
        navLinks.forEach(link => {
            link.addEventListener("click", handleNavigation);
        });
        
        // Configurar navegación desde el logo
        if (logoLink) {
            logoLink.addEventListener("click", handleNavigation);
        }
    }
    
    /**
     * Configura eventos adicionales como el botón "Ver más"
     */
    function setupAdditionalEventListeners() {
        const botonVerMas = document.querySelector('.btn-ver-mas');
        if (botonVerMas) {
            botonVerMas.addEventListener('click', () => {
                document.querySelector('.nav-link[data-section="proyectos"]').click();
            });
        }
        
        // Configurar eventos para los proyectos y galería
        setupProyectosEventos();
        setupGaleriaEventos();
        
        // Configurar evento del formulario de contacto
        setupContactoFormulario();
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
        
        // Resetear vistas de proyectos y galería cuando se navega a estas secciones
        if (section.id === 'proyectos') {
            resetProyectosView();
        } else if (section.id === 'galeria') {
            resetGaleriaView();
        }
        
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
     * Resetea la vista de proyectos a su estado inicial con todos los proyectos visibles
     */
    function resetProyectosView() {
        // Ocultar todos los detalles de proyectos
        document.querySelectorAll('.proyecto-detalle').forEach(detalle => {
            detalle.classList.remove('visible');
        });
        
        // Mostrar la grid de proyectos
        const proyectosGrid = document.querySelector('.proyectos-grid');
        if (proyectosGrid) {
            proyectosGrid.classList.remove('oculta');
        }
    }
    
    /**
     * Resetea la vista de galería a su estado inicial con todas las categorías visibles
     */
    function resetGaleriaView() {
        // Ocultar todos los detalles de galería
        document.querySelectorAll('.galeria-detalle').forEach(detalle => {
            detalle.classList.remove('visible');
        });
        
        // Mostrar la grid de galería
        const galeriaGrid = document.querySelector('.galeria-grid');
        if (galeriaGrid) {
            galeriaGrid.classList.remove('oculta');
        }
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
    
    /**
     * Configura el carrusel de la sección hero
     */
    function setupHeroCarousel() {
        const carouselImages = document.querySelectorAll('.hero-img');
        const indicators = document.querySelectorAll('.indicator');
        let currentImageIndex = 0;
        let intervalId;
        
        // Verificar que las imágenes se han cargado correctamente
        carouselImages.forEach((img, index) => {
            img.addEventListener('load', () => {
                console.log(`Imagen ${index + 1} cargada correctamente`);
            });
            
            img.addEventListener('error', () => {
                console.error(`Error al cargar la imagen ${index + 1}: ${img.src}`);
            });
        });
        
        // Iniciar el carrusel automáticamente
        startCarousel();
        
        // Añadir eventos a los indicadores
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const targetIndex = parseInt(indicator.dataset.index);
                showImage(targetIndex);
                resetCarouselTimer();
            });
        });
        
        /**
         * Muestra la imagen en el índice especificado
         * @param {number} index - Índice de la imagen a mostrar
         */
        function showImage(index) {
            // Aplicar animación de salida a la imagen actual (hacia la derecha)
            if (carouselImages[currentImageIndex]) {
                carouselImages[currentImageIndex].classList.remove('active');
                carouselImages[currentImageIndex].classList.add('exit-right');
                indicators[currentImageIndex].classList.remove('active');
                
                // Limpieza: eliminar la clase exit-right después de la transición
                setTimeout(() => {
                    carouselImages[currentImageIndex].classList.remove('exit-right');
                }, 1000);
            }
            
            // Actualizar el índice actual
            currentImageIndex = index;
            
            // Si el índice es inválido, volver al principio
            if (currentImageIndex >= carouselImages.length) {
                currentImageIndex = 0;
            }
            
            // Mostrar la nueva imagen (entrará desde la izquierda)
            carouselImages[currentImageIndex].classList.add('active');
            indicators[currentImageIndex].classList.add('active');
        }
        
        /**
         * Avanza el carrusel a la siguiente imagen
         */
        function nextImage() {
            showImage((currentImageIndex + 1) % carouselImages.length);
        }
        
        /**
         * Inicia el carrusel automático
         */
        function startCarousel() {
            intervalId = setInterval(nextImage, 5000); // Cambiar cada 5 segundos
        }
        
        /**
         * Reinicia el temporizador del carrusel
         */
        function resetCarouselTimer() {
            clearInterval(intervalId);
            startCarousel();
        }
    }
    
    /**
     * Configura los eventos para la navegación entre proyectos y sus detalles
     */
    function setupProyectosEventos() {
        // Obtener elementos
        const proyectoItems = document.querySelectorAll('.proyecto-item[data-proyecto]');
        const botonesVolver = document.querySelectorAll('.btn-volver');
        
        // Añadir eventos de clic a cada proyecto
        proyectoItems.forEach(item => {
            item.addEventListener('click', function() {
                const proyectoId = this.getAttribute('data-proyecto');
                mostrarDetalleProyecto(proyectoId);
            });
        });
        
        // Añadir eventos de clic a los botones de volver
        botonesVolver.forEach(boton => {
            boton.addEventListener('click', function() {
                ocultarDetallesProyecto();
            });
        });
        
        /**
         * Muestra los detalles de un proyecto específico
         * @param {string} proyectoId - ID del proyecto a mostrar
         */
        function mostrarDetalleProyecto(proyectoId) {
            // Ocultar la grid de proyectos
            document.querySelector('.proyectos-grid').classList.add('oculta');
            
            // Mostrar el detalle del proyecto seleccionado
            const detalleProyecto = document.getElementById(proyectoId);
            if (detalleProyecto) {
                // Pequeño retraso para que la animación sea más fluida
                setTimeout(() => {
                    detalleProyecto.classList.add('visible');
                    
                    // Scroll suave hasta el detalle
                    detalleProyecto.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 50);
            }
        }
        
        /**
         * Oculta los detalles de proyecto y muestra la grid
         */
        function ocultarDetallesProyecto() {
            // Ocultar todos los detalles de proyectos
            document.querySelectorAll('.proyecto-detalle').forEach(detalle => {
                detalle.classList.remove('visible');
            });
            
            // Mostrar la grid de proyectos
            setTimeout(() => {
                document.querySelector('.proyectos-grid').classList.remove('oculta');
            }, 300); // Esperar a que termine la animación de desvanecimiento
        }
    }
    
    /**
     * Configura los eventos para la navegación entre elementos de la galería y sus detalles
     */
    function setupGaleriaEventos() {
        // Obtener elementos
        const galeriaItems = document.querySelectorAll('.galeria-item[data-galeria]');
        const botonesVolver = document.querySelectorAll('.galeria-detalle .btn-volver');
        
        // Añadir eventos de clic a cada elemento de galería
        galeriaItems.forEach(item => {
            item.addEventListener('click', function() {
                const galeriaId = this.getAttribute('data-galeria');
                mostrarDetalleGaleria(galeriaId);
            });
        });
        
        // Añadir eventos de clic a los botones de volver
        botonesVolver.forEach(boton => {
            boton.addEventListener('click', function() {
                ocultarDetallesGaleria();
            });
        });
        
        /**
         * Muestra los detalles de un elemento de la galería específico
         * @param {string} galeriaId - ID del elemento de galería a mostrar
         */
        function mostrarDetalleGaleria(galeriaId) {
            // Ocultar la grid de galería
            document.querySelector('.galeria-grid').classList.add('oculta');
            
            // Mostrar el detalle del elemento seleccionado
            const detalleGaleria = document.getElementById(galeriaId);
            if (detalleGaleria) {
                // Pequeño retraso para que la animación sea más fluida
                setTimeout(() => {
                    detalleGaleria.classList.add('visible');
                    
                    // Scroll suave hasta el detalle
                    detalleGaleria.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Si son los moodboards, inicializar el scroll effect
                    if (galeriaId === 'moodboards') {
                        setupMoodboardsScroll();
                    }
                }, 50);
            }
        }
        
        /**
         * Configura el efecto de scroll para los moodboards
         */
        function setupMoodboardsScroll() {
            const moodboards = document.querySelectorAll('.moodboard-item');
            
            // Función para comprobar si un elemento está visible en el viewport
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight * 0.75) &&
                    rect.bottom >= (window.innerHeight * 0.25)
                );
            }
            
            // Función para revisar todos los moodboards y activar los visibles
            function checkMoodboardsVisibility() {
                moodboards.forEach(moodboard => {
                    if (isElementInViewport(moodboard)) {
                        moodboard.classList.add('visible');
                    }
                });
            }
            
            // Revisar visibilidad inicial
            checkMoodboardsVisibility();
            
            // Añadir escucha para el evento scroll
            window.addEventListener('scroll', checkMoodboardsVisibility, { passive: true });
        }
        
        /**
         * Oculta los detalles de galería y muestra la grid
         */
        function ocultarDetallesGaleria() {
            // Ocultar todos los detalles de galería
            document.querySelectorAll('.galeria-detalle').forEach(detalle => {
                detalle.classList.remove('visible');
            });
            
            // Mostrar la grid de galería
            setTimeout(() => {
                document.querySelector('.galeria-grid').classList.remove('oculta');
            }, 300); // Esperar a que termine la animación de desvanecimiento
        }
    }
    
    /**
     * Configura la funcionalidad del formulario de contacto
     */
    function setupContactoFormulario() {
        const formulario = document.getElementById('formulario-contacto');
        if (formulario) {
            formulario.addEventListener('submit', function(event) {
                event.preventDefault();
                
                // Aquí se puede agregar la lógica para enviar el formulario
                // Por ejemplo, usando fetch() para enviar a un backend
                
                // Por ahora, solo mostramos un mensaje de confirmación
                alert('¡Gracias por tu mensaje! Te responderemos lo antes posible.');
                formulario.reset();
            });
        }
    }
    
    /**
     * Al cargar contenido dinámicamente, asegúrate de añadir loading="lazy"
     * @param {HTMLElement} contenedor - Contenedor con imágenes dinámicas
     */
    function cargarImagenesDinamicas(contenedor) {
        const imagenes = contenedor.querySelectorAll('img');
        imagenes.forEach(img => {
            img.setAttribute('loading', 'lazy');
            // Opcionalmente, si es posible, añade también width y height
        });
    }
});
