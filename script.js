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
    
    // Configurar el selector de ilustraciones
    setupIlustracionesSelector();
    
    // Configurar el scroll horizontal de proyectos
    setupProyectosScroll();
    
    // Llamar explícitamente a setupCielitoBotones
    setupCielitoBotones();
    
    // Wait for image loader to be available and integrate
    if (window.imageLoader) {
        integrateImageLoader();
    } else {
        // Wait for image loader to be initialized
        document.addEventListener('imageLoaderReady', integrateImageLoader);
    }
    
    /**
     * Función para integrar el cargador de imágenes
     */
    function integrateImageLoader() {
        // Override section transitions to load images on demand
        const originalShowSection = showSection;
        showSection = function(targetSectionId) {
            // Call original function
            const result = originalShowSection.call(this, targetSectionId);
            
            // Load images for the target section
            if (window.imageLoader) {
                if (targetSectionId.startsWith('proyecto')) {
                    window.imageLoader.loadProjectImagesOnDemand(targetSectionId);
                } else if (['ilustraciones', 'moodboards', 'diseno-grafico'].includes(targetSectionId)) {
                    window.imageLoader.loadGalleryImagesOnDemand(targetSectionId);
                }
            }
            
            return result;
        };
    }
    
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
        
        // Mostrar el contenedor de scroll de proyectos (en lugar de la grid)
        const proyectosScrollContainer = document.querySelector('.proyectos-scroll-container');
        if (proyectosScrollContainer) {
            proyectosScrollContainer.classList.remove('oculta');
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
        let isTransitioning = false;
        let intervalId;
        
        // Verificar que hay imágenes que cargar
        if (!carouselImages.length) {
            console.warn("No se encontraron imágenes para el carrusel");
            return;
        }
        
        // Inicializar: primera imagen activa, resto fuera de la vista
        carouselImages.forEach((img, index) => {
            if (index === 0) {
                img.classList.add('active');
            } else {
                img.classList.add('enter-left'); // Las demás imágenes esperan a la izquierda
            }
        });
        
        // Iniciar el carrusel automáticamente
        startCarousel();
        
        // Añadir eventos a los indicadores
        indicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                if (isTransitioning) return;
                
                const targetIndex = parseInt(indicator.dataset.index);
                if (targetIndex !== currentImageIndex) {
                    transitToImage(targetIndex);
                    resetCarouselTimer();
                }
            });
        });
        
        /**
         * Función que realiza la transición de una imagen a otra
         * @param {number} nextIndex - Índice de la imagen a mostrar
         */
        function transitToImage(nextIndex) {
            if (isTransitioning || nextIndex === currentImageIndex) return;
            isTransitioning = true;
            
            // Referencias a las imágenes involucradas
            const currentImage = carouselImages[currentImageIndex];
            const nextImage = carouselImages[nextIndex];
            
            // Actualizar indicadores
            indicators[currentImageIndex].classList.remove('active');
            indicators[nextIndex].classList.add('active');
            
            // Preparar la nueva imagen para entrar desde la izquierda
            nextImage.classList.remove('exit-right');
            nextImage.classList.add('enter-left');
            
            // Forzar un reflow para asegurar que los cambios se aplican
            void nextImage.offsetWidth;
            
            // Hacer la transición: 
            // - Imagen actual sale por la derecha
            // - Nueva imagen entra desde la izquierda
            currentImage.classList.remove('active');
            currentImage.classList.add('exit-right');
            nextImage.classList.remove('enter-left');
            nextImage.classList.add('active');
            
            // Después de completar la transición
            setTimeout(() => {
                // Actualizar el índice actual
                currentImageIndex = nextIndex;
                
                // Preparar las demás imágenes para futuras transiciones
                carouselImages.forEach((img, index) => {
                    if (index !== currentImageIndex) {
                        img.classList.remove('active', 'exit-right');
                        img.classList.add('enter-left');
                    }
                });
                
                isTransitioning = false;
            }, 800); // Este tiempo debe coincidir con la duración de la transición CSS
        }
        
        /**
         * Avanza el carrusel a la siguiente imagen
         */
        function nextImage() {
            // Calcular el índice de la siguiente imagen
            const nextIndex = (currentImageIndex + 1) % carouselImages.length;
            transitToImage(nextIndex);
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
        const proyectosScrollContainer = document.querySelector('.proyectos-scroll-container');
        
        // Añadir eventos de clic a cada proyecto
        proyectoItems.forEach(item => {
            item.addEventListener('click', function() {
                const proyectoId = this.getAttribute('data-proyecto');
                
                // Efecto de "pulsación" al hacer clic
                this.classList.add('pulsado');
                
                // Añadir clase de animación de salida al contenedor de proyectos
                proyectosScrollContainer.classList.add('saliendo');
                
                // Retraso para permitir que la animación de salida comience
                setTimeout(() => {
                    mostrarDetalleProyecto(proyectoId);
                    
                    // Eliminar clases de animación después de la transición
                    setTimeout(() => {
                        this.classList.remove('pulsado');
                        proyectosScrollContainer.classList.remove('saliendo');
                    }, 600);
                }, 400);
            });
        });
        
        // Añadir eventos de clic a los botones de volver
        botonesVolver.forEach(boton => {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Añadir clase de pulsación al botón
                this.classList.add('pulsado');
                
                // Obtener el contenedor de detalle actual
                const detalleActual = this.closest('.proyecto-detalle');
                
                // Añadir clase de animación de salida
                detalleActual.classList.add('saliendo');
                
                // Retraso para permitir que la animación de salida comience
                setTimeout(() => {
                    ocultarDetallesProyecto();
                    
                    // Preparar el contenedor de proyectos para la animación de entrada
                    proyectosScrollContainer.classList.add('entrando');
                    
                    // Eliminar clases de animación después de la transición
                    setTimeout(() => {
                        this.classList.remove('pulsado');
                        detalleActual.classList.remove('saliendo');
                        proyectosScrollContainer.classList.remove('entrando');
                    }, 600);
                }, 400);
            });
        });
        
        // Configurar botones adicionales para Cielito Lindo
        setupCielitoBotones();
        
        /**
         * Muestra los detalles de un proyecto específico
         * @param {string} proyectoId - ID del proyecto a mostrar
         */
        function mostrarDetalleProyecto(proyectoId) {
            // Ocultar el contenedor de scroll de proyectos
            document.querySelector('.proyectos-scroll-container').classList.add('oculta');
            
            // Mostrar el detalle del proyecto seleccionado
            const detalleProyecto = document.getElementById(proyectoId);
            if (detalleProyecto) {
                // Añadir clase para la animación de entrada
                detalleProyecto.classList.add('entrando');
                detalleProyecto.classList.add('visible');
                
                // Scroll suave hasta el detalle
                detalleProyecto.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Si es el proyecto Oasis, inicializar el efecto de scroll para las imágenes y el selector
                if (proyectoId === 'proyecto1') {
                    setupProyectoImagenesScroll();
                    setupOasisImageSelector();
                }
                // Si es el proyecto Cielito Lindo, inicializar el efecto de scroll para las imágenes
                // y configurar los botones adicionales
                else if (proyectoId === 'proyecto2') {
                    setupProyectoImagenesScroll();
                    setupCielitoBotones();
                }
                // Si es el proyecto Árboles y Flores, inicializar el carousel 3D
                else if (proyectoId === 'proyecto3') {
                    setupProyectoImagenesScroll();
                    setup3DCarouselArbolesFlores();
                }
                // Si es el proyecto Teloclaro, inicializar el efecto de scroll para las imágenes
                else if (proyectoId === 'proyecto4') {
                    setupProyectoImagenesScroll();
                    
                    // Inicializar Teloclaro - CORREGIDO: Asegurar que se llama y funciona
                    console.log("Inicializando Teloclaro Scroll");
                    
                    // Dar tiempo a que el DOM se actualice antes de buscar los elementos
                    setTimeout(() => {
                        setupTeloclaroScroll();
                        
                        // Activar manualmente la visibilidad inicial de todos los items para asegurar que se muestran
                        document.querySelectorAll('.teloclaro-item').forEach(item => {
                            item.classList.add('visible');
                        });
                    }, 300);
                }
                // Si es el proyecto Marea, inicializar el efecto de scroll para las imágenes
                else if (proyectoId === 'proyecto5') {
                    setupProyectoImagenesScroll();
                    console.log("Inicializando Marea Scroll");
                    
                    // Configurar efecto de aparición para los bloques de diseño de Marea
                    setupMareaScrollAnimation();
                    
                    // Force scroll event after a delay to trigger initial animations
                    setTimeout(() => {
                        console.log("Forzando evento de scroll para activar animaciones iniciales");
                        window.dispatchEvent(new Event('scroll'));
                    }, 500);
                }
                
                // Eliminar clase de animación después de completar
                setTimeout(() => {
                    detalleProyecto.classList.remove('entrando');
                }, 600);
            }
        }
        
        /**
         * Oculta los detalles de proyecto y muestra el scroll horizontal de proyectos
         */
        function ocultarDetallesProyecto() {
            // Ocultar todos los detalles de proyectos
            document.querySelectorAll('.proyecto-detalle').forEach(detalle => {
                detalle.classList.remove('visible');
            });
            
            // Mostrar el contenedor de scroll de proyectos
            setTimeout(() => {
                document.querySelector('.proyectos-scroll-container').classList.remove('oculta');
            }, 300); // Esperar a que termine la animación de desvanecimiento
        }

        /**
         * Configura el efecto de scroll para las imágenes de proyectos
         */
        function setupProyectoImagenesScroll() {
            const proyectoImagenes = document.querySelectorAll('.proyecto-imagen-item');
            
            // Función para comprobar si un elemento está visible en el viewport
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight * 0.75) &&
                    rect.bottom >= (window.innerHeight * 0.25)
                );
            }
            
            // Función para revisar todas las imágenes y activar las visibles
            function checkImagenesVisibility() {
                proyectoImagenes.forEach(imagen => {
                    if (isElementInViewport(imagen)) {
                        imagen.classList.add('visible');
                    }
                });
            }
            
            // Revisar visibilidad inicial
            checkImagenesVisibility();
            
            // Añadir escucha para el evento scroll
            window.addEventListener('scroll', checkImagenesVisibility, { passive: true });
        }
    }
    
    /**
     * Configura los botones adicionales para la sección Cielito Lindo
     */
    function setupCielitoBotones() {
        // Configurar botón para volver arriba
        const btnVolverArriba = document.querySelector('.btn-volver-arriba');
        if (btnVolverArriba) {
            btnVolverArriba.addEventListener('click', () => {
                // Obtener la sección del proyecto2 y hacer scroll suave hacia arriba
                const seccionCielito = document.getElementById('proyecto2');
                if (seccionCielito) {
                    seccionCielito.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        }
    }
    
    /**
     * Configura la funcionalidad del selector de imágenes de Oasis
     */
    function setupOasisImageSelector() {
        const miniaturas = document.querySelectorAll('.oasis-miniatura');
        const imagenPrincipalContainer = document.querySelector('.oasis-imagen-principal');
        const imagenPrincipal = document.getElementById('oasis-main');
        
        if (!miniaturas.length || !imagenPrincipal) return;
        
        // Asegurarse de que la imagen principal coincida con la miniatura activa al cargar
        const miniaturActiva = document.querySelector('.oasis-miniatura.active');
        if (miniaturActiva && imagenPrincipal) {
            imagenPrincipal.src = miniaturActiva.querySelector('img').src;
        }
        
        // Precargar las imágenes para transiciones más suaves
        miniaturas.forEach(miniatura => {
            const img = new Image();
            img.src = miniatura.querySelector('img').src;
        });
        
        miniaturas.forEach(miniatura => {
            miniatura.addEventListener('click', () => {
                // No hacer nada si ya está activa o si hay una transición en curso
                if (miniatura.classList.contains('active') || 
                    imagenPrincipalContainer.classList.contains('loading')) return;
                
                // Quitar la clase active de todas las miniaturas
                miniaturas.forEach(m => m.classList.remove('active'));
                
                // Añadir la clase active a la miniatura seleccionada
                miniatura.classList.add('active');
                
                // Obtener la URL de la nueva imagen
                const newImageSrc = miniatura.querySelector('img').src;
                
                // No hacer nada si es la misma imagen
                if (imagenPrincipal.src === newImageSrc) return;
                
                // Iniciar la transición
                imagenPrincipalContainer.classList.add('loading');
                imagenPrincipalContainer.classList.add('changing');
                
                // Tiempo para que inicie la animación de salida
                setTimeout(() => {
                    // Cambiar la fuente de la imagen
                    imagenPrincipal.src = newImageSrc;
                    
                    // Cuando la imagen se carga
                    imagenPrincipal.onload = () => {
                        // Quitar clase de cambio para iniciar la animación de entrada
                        imagenPrincipalContainer.classList.remove('changing');
                        
                        // Dar tiempo a la animación de entrada y luego quitar loading
                        setTimeout(() => {
                            imagenPrincipalContainer.classList.remove('loading');
                        }, 300);
                    };
                    
                    // Manejo de error en la carga
                    imagenPrincipal.onerror = () => {
                        console.error('Error al cargar la imagen:', newImageSrc);
                        imagenPrincipalContainer.classList.remove('changing');
                        imagenPrincipalContainer.classList.remove('loading');
                    };
                }, 200);
            });
        });
    }
    
    /**
     * Configura el scroll horizontal para la sección de proyectos
     */
    function setupProyectosScroll() {
        const scrollContainer = document.querySelector('.proyectos-wrapper');
        const proyectosCarousel = document.querySelector('.proyectos-horizontal');
        const leftIndicator = document.querySelector('.left-indicator');
        const rightIndicator = document.querySelector('.right-indicator');
        const progressBar = document.querySelector('.scroll-progress-bar');
        
        // Variables de control para el drag scrolling
        let isDown = false;
        let startX;
        let scrollLeft;
        
        // Si no hay container, salir
        if (!scrollContainer) return;
        
        // Inicializar estado de los indicadores
        updateIndicators();
        
        // Añadir eventos para scroll manual
        scrollContainer.addEventListener('scroll', handleScroll);
        
        // Añadir eventos para los botones de navegación
        if (leftIndicator) {
            leftIndicator.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic se propague a elementos superiores
                scrollContainer.scrollBy({ 
                    left: -scrollContainer.clientWidth * 0.8, 
                    behavior: 'smooth' 
                });
            });
        }
        
        if (rightIndicator) {
            rightIndicator.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic se propague a elementos superiores
                scrollContainer.scrollBy({ 
                    left: scrollContainer.clientWidth * 0.8, 
                    behavior: 'smooth' 
                });
            });
        }
        
        // Añadir eventos para drag scroll
        scrollContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            scrollContainer.classList.add('grabbing');
            startX = e.pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
            isDown = false;
            scrollContainer.classList.remove('grabbing');
        });
        
        scrollContainer.addEventListener('mouseup', () => {
            isDown = false;
            scrollContainer.classList.remove('grabbing');
        });
        
        scrollContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 1.5; // Efecto de multiplicador de scroll
            scrollContainer.scrollLeft = scrollLeft - walk;
        });
        
        // Añadir eventos touch para móviles
        scrollContainer.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
        }, { passive: true });
        
        scrollContainer.addEventListener('touchend', () => {
            isDown = false;
        }, { passive: true });
        
        scrollContainer.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - scrollContainer.offsetLeft;
            const walk = (x - startX) * 1.5;
            scrollContainer.scrollLeft = scrollLeft - walk;
        }, { passive: true });
        
        /**
         * Maneja el evento de scroll para actualizar indicadores y barra de progreso
         */
        function handleScroll() {
            updateIndicators();
            updateProgressBar();
        }
        
        /**
         * Actualiza la visibilidad de los indicadores de dirección
         */
        function updateIndicators() {
            if (!scrollContainer || !leftIndicator || !rightIndicator) return;
            
            const isAtStart = scrollContainer.scrollLeft < 10;
            const isAtEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10;
            
            // Mostrar/ocultar indicador izquierdo
            if (isAtStart) {
                leftIndicator.classList.remove('active');
            } else {
                leftIndicator.classList.add('active');
            }
            
            // Mostrar/ocultar indicador derecho
            if (isAtEnd) {
                rightIndicator.classList.remove('active');
            } else {
                rightIndicator.classList.add('active');
            }
        }
        
        /**
         * Actualiza la barra de progreso del scroll
         */
        function updateProgressBar() {
            if (!scrollContainer || !progressBar) return;
            
            const scrollPercentage = (scrollContainer.scrollLeft / (scrollContainer.scrollWidth - scrollContainer.clientWidth)) * 100;
            progressBar.style.width = `${scrollPercentage}%`;
        }
    }
    
    /**
     * Configura los eventos para la navegación entre elementos de la galería y sus detalles
     */
    function setupGaleriaEventos() {
        // Obtener elementos
        const galeriaItems = document.querySelectorAll('.galeria-item[data-galeria]');
        const botonesVolver = document.querySelectorAll('.galeria-detalle .btn-volver');
        const galeriaGrid = document.querySelector('.galeria-grid');
        
        // Añadir eventos de clic a cada elemento de galería
        galeriaItems.forEach(item => {
            item.addEventListener('click', function() {
                const galeriaId = this.getAttribute('data-galeria');
                
                // Efecto de "pulsación" al hacer clic
                this.classList.add('pulsado');
                
                // Añadir clase de animación de salida a la grid
                galeriaGrid.classList.add('saliendo');
                
                // Retraso para permitir que la animación de salida comience
                setTimeout(() => {
                    mostrarDetalleGaleria(galeriaId);
                    
                    // Eliminar clases de animación después de la transición
                    setTimeout(() => {
                        this.classList.remove('pulsado');
                        galeriaGrid.classList.remove('saliendo');
                    }, 600);
                }, 400);
            });
        });
        
        // Añadir eventos de clic a los botones de volver
        botonesVolver.forEach(boton => {
            boton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Añadir clase de pulsación al botón
                this.classList.add('pulsado');
                
                // Obtener el contenedor de detalle
                const detalleActual = this.closest('.galeria-detalle');
                
                // Añadir clase de animación de salida
                detalleActual.classList.add('saliendo');
                
                // Retraso para permitir que la animación de salida comience
                setTimeout(() => {
                    ocultarDetallesGaleria();
                    
                    // Preparar la grid para la animación de entrada
                    galeriaGrid.classList.add('entrando');
                    
                    // Eliminar clases de animación después de la transición
                    setTimeout(() => {
                        this.classList.remove('pulsado');
                        detalleActual.classList.remove('saliendo');
                        galeriaGrid.classList.remove('entrando');
                    }, 600);
                }, 400);
            });
        });
        
        /**
         * Muestra los detalles de un elemento de la galería específico
         * @param {string} galeriaId - ID del elemento de galería a mostrar
         */
        function mostrarDetalleGaleria(galeriaId) {
            // Ocultar la grid de galería
            galeriaGrid.classList.add('oculta');
            
            // Mostrar el detalle del elemento seleccionado
            const detalleGaleria = document.getElementById(galeriaId);
            if (detalleGaleria) {
                // Añadir clase para la animación de entrada
                detalleGaleria.classList.add('entrando');
                detalleGaleria.classList.add('visible');
                
                // Scroll suave hasta el detalle
                detalleGaleria.scrollIntoView({ behavior: 'smooth', block: 'start' });
                
                // Si son los moodboards, inicializar el scroll effect
                if (galeriaId === 'moodboards') {
                    setupMoodboardsScroll();
                }
                // Si es la sección de diseño gráfico, inicializar el scroll effect
                else if (galeriaId === 'diseno-grafico') {
                    setupDisenoGraficoScroll();
                }
                
                // Eliminar clase de animación después de completar
                setTimeout(() => {
                    detalleGaleria.classList.remove('entrando');
                }, 600);
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
         * Configura el efecto de scroll para la sección de Diseño Gráfico
         */
        function setupDisenoGraficoScroll() {
            const disenoItems = document.querySelectorAll('.diseno-item');
            
            // Función para comprobar si un elemento está visible en el viewport
            function isElementInViewport(el) {
                const rect = el.getBoundingClientRect();
                return (
                    rect.top <= (window.innerHeight * 0.75) &&
                    rect.bottom >= (window.innerHeight * 0.25)
                );
            }
            
            // Función para revisar todos los elementos y activar los visibles
            function checkDisenoItemsVisibility() {
                disenoItems.forEach(item => {
                    if (isElementInViewport(item)) {
                        item.classList.add('visible');
                    }
                });
            }
            
            // Revisar visibilidad inicial
            checkDisenoItemsVisibility();
            
            // Añadir escucha para el evento scroll
            window.addEventListener('scroll', checkDisenoItemsVisibility, { passive: true });
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
            galeriaGrid.classList.remove('oculta');
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
                
                // Get form data
                const formData = {
                    nombre: document.getElementById('nombre').value.trim(),
                    apellido: document.getElementById('apellido').value.trim(),
                    email: document.getElementById('email').value.trim(),
                    mensaje: document.getElementById('mensaje').value.trim()
                };
                
                // Validar campos básicos en el frontend
                if (!formData.nombre || !formData.apellido || !formData.email || !formData.mensaje) {
                    alert('Por favor, completa todos los campos.');
                    return;
                }
                
                if (!isValidEmail(formData.email)) {
                    alert('Por favor, introduce un email válido.');
                    return;
                }
                
                // Show loading state
                const submitButton = formulario.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Enviando...';
                submitButton.disabled = true;
                
                // URL del backend en Render (actualiza con tu URL real)
                const backendURL = 'https://clara-portfolio-backend.onrender.com/contact';
                
                // Send data to backend API
                fetch(backendURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        alert('¡Gracias por tu mensaje! Te responderé lo antes posible.');
                        formulario.reset();
                        // Ocultar el hint de preview
                        const hint = document.querySelector('.form-hint');
                        if (hint) {
                            hint.style.display = 'none';
                        }
                    } else {
                        alert('Error al enviar el mensaje: ' + (data.message || 'Error desconocido'));
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde o escribe directamente a clarareigle5@gmail.com');
                })
                .finally(() => {
                    // Restore button state
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
            });
        }
    }
    
    /**
     * Validar formato de email
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Configura la funcionalidad del selector de ilustraciones
     */
    function setupIlustracionesSelector() {
        const miniaturas = document.querySelectorAll('.ilustracion-miniatura');
        const imagenPrincipal = document.getElementById('ilustracion-main');
        
        // Asegurarse de que la imagen principal coincida con la miniatura activa al cargar
        const miniaturActiva = document.querySelector('.ilustracion-miniatura.active');
        if (miniaturActiva && imagenPrincipal) {
            imagenPrincipal.src = miniaturActiva.querySelector('img').src;
        }
        
        miniaturas.forEach(miniatura => {
            miniatura.addEventListener('click', () => {
                // Quitar la clase active de todas las miniaturas
                miniaturas.forEach(m => m.classList.remove('active'));
                
                // Añadir la clase active a la miniatura seleccionada
                miniatura.classList.add('active');
                
                // Añadir clase para la animación
                imagenPrincipal.classList.add('changing');
                
                // Actualizar la imagen principal
                setTimeout(() => {
                    imagenPrincipal.src = miniatura.querySelector('img').src;
                    
                    // Quitar la clase de animación después de que la imagen se cargue
                    imagenPrincipal.onload = () => {
                        setTimeout(() => {
                            imagenPrincipal.classList.remove('changing');
                        }, 300);
                    };
                }, 100);
            });
        });
        
        // Precargar las imágenes para una transición más suave
        miniaturas.forEach(miniatura => {
            const img = new Image();
            img.src = miniatura.querySelector('img').src;
        });
    }
    
    /**
     * Configura el carousel 3D para el proyecto Árboles y Flores
     */
    function setup3DCarouselArbolesFlores() {
        const items = document.querySelectorAll('.carousel-3d-item');
        
        if (!items.length) return;
        
        // Posiciones posibles en el círculo (siempre mirando al frente)
        const positions = ['front', 'right', 'back', 'left'];
        
        // Estado inicial del carrusel
        let currentIndex = 0;
        
        // Inicializar posiciones
        updatePositions();
        
        // Añadir eventos a los items del carousel
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                // Si hacemos clic en un elemento que no está al frente, lo rotamos al frente
                const itemPosition = getItemPosition(index);
                if (itemPosition !== 'front') {
                    rotateToPosition(index);
                }
            });
        });
        
        /**
         * Actualiza las posiciones de los elementos según el índice actual
         */
        function updatePositions() {
            items.forEach((item, index) => {
                // Calcular la posición relativa respecto al elemento frontal
                const position = getItemPosition(index);
                
                // Eliminar todas las clases de posición existentes
                item.classList.remove('carousel-position-front', 'carousel-position-right', 
                                      'carousel-position-back', 'carousel-position-left');
                
                // Añadir la clase de posición correspondiente
                item.classList.add(`carousel-position-${position}`);
                
                // Actualizar atributo data-position
                item.setAttribute('data-position', position);
            });
        }
        
        /**
         * Obtiene la posición de un elemento según su índice
         * @param {number} index - El índice del elemento
         * @returns {string} - La posición: 'front', 'right', 'back', 'left'
         */
        function getItemPosition(index) {
            // Calcular la posición relativa
            const positionIndex = (index - currentIndex + items.length) % items.length;
            return positions[positionIndex];
        }
        
        /**
         * Rota a un índice específico
         * @param {number} index - Índice del elemento a rotar al frente
         */
        function rotateToPosition(index) {
            // Calcular cuántos pasos debemos rotar para llevar ese elemento al frente
            const steps = (index - currentIndex + items.length) % items.length;
            
            // Determinar la dirección más corta para girar
            if (steps <= items.length / 2) {
                // Girar hacia adelante (sentido antihorario)
                for (let i = 0; i < steps; i++) {
                    currentIndex = (currentIndex + 1) % items.length;
                    updatePositions();
                }
            } else {
                // Girar hacia atrás (sentido horario)
                for (let i = 0; i < items.length - steps; i++) {
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                    updatePositions();
                }
            }
        }
    }
    
    /**
     * Configura el efecto de aparición al hacer scroll para la galería Teloclaro
     * CORREGIDO: Mejorado para asegurar que funciona correctamente
     */
    function setupTeloclaroScroll() {
        const teloclaroItems = document.querySelectorAll('.teloclaro-item');
        console.log(`Encontrados ${teloclaroItems.length} items de Teloclaro`);
        
        if (!teloclaroItems.length) {
            console.warn("No se encontraron elementos .teloclaro-item");
            return;
        }
        
        // Función para comprobar si un elemento está visible en el viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            const isVisible = (
                rect.top <= (window.innerHeight * 0.8) &&
                rect.bottom >= (window.innerHeight * 0.2)
            );
            return isVisible;
        }
        
        // Función para revisar todos los items y activar los visibles
        function checkTeloclaroVisibility() {
            teloclaroItems.forEach((item, index) => {
                if (isElementInViewport(item)) {
                    // Solo log if el elemento cambia de estado
                    if (!item.classList.contains('visible')) {
                        console.log(`Elemento ${index + 1} ahora visible`);
                    }
                    item.classList.add('visible');
                }
            });
        }
        
        // Revisar visibilidad inicial
        console.log("Comprobando visibilidad inicial");
        checkTeloclaroVisibility();
        
        // Añadir escucha para el evento scroll
        window.addEventListener('scroll', checkTeloclaroVisibility, { passive: true });
        
        // También verificar al redimensionar la ventana
        window.addEventListener('resize', checkTeloclaroVisibility, { passive: true });
        
        // Para asegurar que los elementos se muestran incluso sin scroll
        setTimeout(checkTeloclaroVisibility, 300);
        setTimeout(checkTeloclaroVisibility, 1000);
    }
    
    /**
     * Configura la animación de aparición al hacer scroll para los bloques de Marea
     * Reimplementación completa para asegurar que funciona correctamente
     */
    function setupMareaScrollAnimation() {
        // Seleccionamos todos los elementos que queremos animar al hacer scroll
        const animatedElements = document.querySelectorAll('#proyecto5 .marea-design-block, #proyecto5 .proyecto-imagen-item');
        
        if (!animatedElements.length) {
            console.warn("No se encontraron elementos para animar en la sección Marea");
            return;
        }
        
        console.log(`Encontrados ${animatedElements.length} elementos para animar en Marea`);
        
        // Función mejorada para determinar si un elemento está en el viewport
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            // Un elemento se considera visible cuando su parte superior está por debajo
            // del 20% superior de la pantalla y su parte inferior está por encima
            // del 20% inferior de la pantalla
            return (
                rect.top <= (window.innerHeight * 0.8) &&
                rect.bottom >= (window.innerHeight * 0.2)
            );
        }
        
        // Función para verificar y actualizar la visibilidad de los elementos
        function checkElementsVisibility() {
            animatedElements.forEach(element => {
                if (isElementInViewport(element)) {
                    if (!element.classList.contains('visible')) {
                        console.log(`Elemento ahora visible: ${element.className}`);
                        element.classList.add('visible');
                    }
                }
            });
        }
        
        // Inicializar: asegurar que todos los elementos comienzan ocultos
        animatedElements.forEach(element => {
            element.classList.remove('visible');
        });
        
        // Comprobar visibilidad inicial después de un pequeño retraso
        setTimeout(checkElementsVisibility, 300);
        
        // Añadir listener para verificar visibilidad en scroll
        window.addEventListener('scroll', checkElementsVisibility, { passive: true });
        
        // También verificar al redimensionar la ventana
        window.addEventListener('resize', checkElementsVisibility, { passive: true });
        
        // Verificación periódica para asegurar que se muestran los elementos
        // incluso si no hay eventos de scroll
        setInterval(checkElementsVisibility, 1000);
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

// Función para manejar los botones de ficha técnica
document.addEventListener('DOMContentLoaded', function() {
    // Referencias al modal y sus elementos
    const modal = document.getElementById('modal-ficha-tecnica');
    const modalImg = document.getElementById('modal-imagen');
    const closeBtn = document.querySelector('.close-modal');
    const loader = document.querySelector('.modal-loader');
    
    // Objeto que mapea cada proyecto con la URL de su ficha técnica
    const fichasTecnicas = {
        'proyecto1': './img/proyectos/oasis_ficha.png',
        'proyecto2': './img/proyectos/cielito_ficha.png',
        'proyecto5': './img/proyectos/marea_ficha.png'
    };
    
    // Precargamos las imágenes
    const imageCache = {};
    precargarImagenes();
    
    /**
     * Precarga las imágenes de fichas técnicas
     */
    function precargarImagenes() {
        Object.values(fichasTecnicas).forEach(url => {
            const img = new Image();
            img.onload = () => {
                console.log(`Imagen precargada: ${url}`);
                imageCache[url] = true;
            };
            img.src = url;
        });
    }
    
    // Añadir listener a todos los botones de ficha técnica
    document.querySelectorAll('.btn-ficha-tecnica').forEach(button => {
        button.addEventListener('click', function() {
            // Determinar qué proyecto es basado en el ancestro más cercano con id
            const proyectoEl = this.closest('.proyecto-detalle');
            const proyectoId = proyectoEl.id;
            
            // Obtener la URL de la ficha técnica correspondiente
            const fichaUrl = fichasTecnicas[proyectoId];
            if (fichaUrl) {
                // Mostrar el indicador de carga
                loader.classList.remove('hidden');
                modalImg.classList.remove('loaded');
                
                // Crear una nueva imagen para verificar el estado de carga
                const img = new Image();
                
                img.onload = function() {
                    // La imagen está cargada, ahora establecer la imagen en el modal
                    modalImg.src = fichaUrl;
                    
                    // Después de un breve retraso para asegurar que la imagen se renderice correctamente
                    setTimeout(() => {
                        // Mostrar la imagen y ocultar el loader
                        modalImg.classList.add('loaded');
                        loader.classList.add('hidden');
                    }, 100);
                    
                    // Mostrar el modal (solo después de que la imagen esté lista)
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Evitar scroll en el fondo
                };
                
                // Iniciar la carga de la imagen o usar la caché
                if (imageCache[fichaUrl]) {
                    // Si la imagen ya está en caché, simular un evento onload
                    img.onload();
                } else {
                    // Si no está en caché, cargar la imagen
                    img.src = fichaUrl;
                }
            }
        });
    });
    
    // Cerrar el modal al hacer clic en el botón de cerrar
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            cerrarModal();
        });
    }
    
    // Cerrar el modal también al hacer clic fuera de la imagen
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    });
    
    // Cerrar el modal con la tecla escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('active')) {
            cerrarModal();
        }
    });
    
    /**
     * Cierra el modal y restaura el scroll
     */
    function cerrarModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restaurar scroll
        
        // Esperar a que termine la animación de cierre antes de resetear la imagen
        setTimeout(() => {
            modalImg.classList.remove('loaded');
            modalImg.src = '';
        }, 300);
    }
});

// Función para actualizar la visibilidad de los indicadores de scroll
function updateScrollIndicators() {
    const wrapper = document.querySelector('.proyectos-wrapper');
    if (!wrapper) return;
    
    const leftIndicator = document.querySelector('.left-indicator');
    const rightIndicator = document.querySelector('.right-indicator');
    
    // Si no hay desbordamiento horizontal, ocultar indicador izquierdo pero mantener el derecho
    if (wrapper.scrollWidth <= wrapper.clientWidth) {
        leftIndicator.classList.remove('active');
        // No ocultamos rightIndicator aunque no haya scroll, para garantizar al menos un indicador visible
        return;
    }
    
    // Mostrar/ocultar indicador izquierdo basado en la posición del scroll
    if (wrapper.scrollLeft <= 10) {
        leftIndicator.classList.remove('active');
    } else {
        leftIndicator.classList.add('active');
    }
    
    // Mostrar/ocultar indicador derecho basado en la posición del scroll
    if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 10) {
        rightIndicator.classList.remove('active');
        // Si estamos al final del scroll y el izquierdo no está activo, forzar su activación
        // para garantizar que al menos un indicador esté visible
        if (!leftIndicator.classList.contains('active')) {
            leftIndicator.classList.add('active');
        }
    } else {
        rightIndicator.classList.add('active');
    }
}

// Configurar los eventos para los indicadores de scroll
document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.proyectos-wrapper');
    const leftIndicator = document.querySelector('.left-indicator');
    const rightIndicator = document.querySelector('.right-indicator');
    
    if (wrapper && leftIndicator && rightIndicator) {
        // Asegurar que el indicador derecho esté activo por defecto
        rightIndicator.classList.add('active');
        
        // Actualizar indicadores inicialmente
        setTimeout(updateScrollIndicators, 100); // Añadir un pequeño retraso para asegurar que los elementos están cargados
        
        // Actualizar al hacer scroll
        wrapper.addEventListener('scroll', updateScrollIndicators);
        
        // Actualizar al cambiar el tamaño de la ventana
        window.addEventListener('resize', updateScrollIndicators);
        
        // Configurar clicks en los botones de navegación con mayor desplazamiento
        leftIndicator.addEventListener('click', function() {
            // Aumentado de 300 a 600 píxeles (aproximadamente 1.5 proyectos)
            wrapper.scrollBy({ left: -600, behavior: 'smooth' });
        });
        
        rightIndicator.addEventListener('click', function() {
            // Aumentado de 300 a 600 píxeles (aproximadamente 1.5 proyectos)
            wrapper.scrollBy({ left: 600, behavior: 'smooth' });
        });
    }
});
