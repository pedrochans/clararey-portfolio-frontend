document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section");
    let isTransitioning = false;
    
    // Duración de la transición (debe coincidir con el CSS)
    const transitionDuration = 500; // 500ms = 0.5s

    // Añadir la clase de animación inicial a la primera sección activa
    document.querySelector(".section.active").classList.add("initial-active");
    
    // Función para asegurar transiciones correctas
    function resetStyles(section) {
        // Eliminar estilos inline que puedan interferir con las transiciones
        section.style.removeProperty('opacity');
        section.style.removeProperty('transform');
        section.style.removeProperty('display');
    }
    
    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            
            // Evitar múltiples clics durante la transición
            if (isTransitioning) return;
            
            const targetSectionId = this.dataset.section;
            const targetSection = document.getElementById(targetSectionId);
            const currentSection = document.querySelector(".section.active");
            
            // Si ya estamos en esa sección, no hacer nada
            if (currentSection === targetSection) return;
            
            isTransitioning = true;
            
            // Actualizar clase activa en navegación
            navLinks.forEach(link => link.classList.remove("active"));
            this.classList.add("active");
            
            // Manejo especial para la transición desde la sección de inicio (hero)
            if (currentSection.id === 'inicio') {
                // Forzar el estilo display antes de animar
                currentSection.style.display = "flex";
                
                // Forzar un reflow para que los cambios se apliquen
                void currentSection.offsetWidth;
            }
            
            // Animar la salida de la sección actual
            currentSection.style.opacity = "0";
            currentSection.style.transform = "translateY(20px)";
            
            // Después de la animación de salida, preparar la nueva sección
            setTimeout(() => {
                currentSection.classList.remove("active");
                currentSection.style.display = "none";
                
                // Preparar la nueva sección (asegurar que no tenga estilos residuales)
                resetStyles(targetSection);
                
                // Configurar el display según el tipo de sección
                if (targetSection.id === 'inicio') {
                    targetSection.style.display = "flex";
                } else {
                    targetSection.style.display = "block";
                }
                
                targetSection.style.opacity = "0";
                targetSection.style.transform = "translateY(20px)";
                targetSection.classList.add("active");
                
                // Forzar un reflow para que la transición funcione
                void targetSection.offsetWidth;
                
                // Animar la entrada de la nueva sección
                requestAnimationFrame(() => {
                    targetSection.style.opacity = "1";
                    targetSection.style.transform = "translateY(0)";
                });
                
                // Guardar la sección activa en localStorage
                localStorage.setItem("activeSection", targetSectionId);
                
                // Permitir nuevas transiciones después de completar
                setTimeout(() => {
                    isTransitioning = false;
                }, transitionDuration);
                
            }, transitionDuration);
        });
    });

    // Restaurar la sección activa desde localStorage
    const activeSection = localStorage.getItem("activeSection");
    if (activeSection) {
        // No activar las animaciones al cargar la página desde localStorage
        const activeLink = document.querySelector(`.nav-link[data-section="${activeSection}"]`);
        if (activeLink) {
            // Simular un clic sin animaciones
            const targetSection = document.getElementById(activeSection);
            const currentActive = document.querySelector(".section.active");
            
            if (currentActive !== targetSection) {
                sections.forEach(section => {
                    section.classList.remove("active", "initial-active");
                    resetStyles(section); // Limpiar cualquier estilo inline
                });
                navLinks.forEach(link => link.classList.remove("active"));
                
                targetSection.classList.add("active");
                activeLink.classList.add("active");
            }
        }
    }
    
    // Gestionar el botón "Ver más" para navegar a la sección "Sobre mí"
    const botonVerMas = document.querySelector('.btn-ver-mas');
    if (botonVerMas) {
        botonVerMas.addEventListener('click', function() {
            document.querySelector('.nav-link[data-section="sobre-mi"]').click();
        });
    }
});
