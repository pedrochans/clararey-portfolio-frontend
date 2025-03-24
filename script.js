document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section");

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const targetSection = document.getElementById(this.dataset.section);

            sections.forEach(section => {
                section.classList.remove("active");
            });

            navLinks.forEach(link => {
                link.classList.remove("active");
            });

            targetSection.classList.add("active"); // Mostrar la sección sin animación
            this.classList.add("active");

            // Guardar la sección activa en localStorage
            localStorage.setItem("activeSection", this.dataset.section);
        });
    });

    // Restaurar la sección activa desde localStorage
    const activeSection = localStorage.getItem("activeSection");
    if (activeSection) {
        document.querySelector(`.nav-link[data-section="${activeSection}"]`).click();
    } else {
        // Set the initial active section
        document.querySelector(".nav-link").click();
    }
});
