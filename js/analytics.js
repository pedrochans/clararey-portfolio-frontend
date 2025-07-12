// Vercel Analytics initialization
(function() {
    // Initialize Vercel Analytics
    if (typeof window !== 'undefined') {
        // Ensure the analytics script loads properly
        window.va = window.va || function () { 
            (window.vaq = window.vaq || []).push(arguments); 
        };
        
        // Track page views
        window.va('pageview');
        
        // Track custom events (optional)
        function trackEvent(name, data) {
            if (window.va) {
                window.va('event', name, data);
            }
        }
        
        // Example: Track button clicks
        document.addEventListener('DOMContentLoaded', function() {
            // Track "Ver más" button clicks
            const verMasButtons = document.querySelectorAll('.btn-ver-mas');
            verMasButtons.forEach(button => {
                button.addEventListener('click', () => {
                    trackEvent('button_click', { button: 'ver_mas' });
                });
            });
            
            // Track project views
            const projectItems = document.querySelectorAll('.proyecto-item');
            projectItems.forEach(item => {
                item.addEventListener('click', () => {
                    const projectName = item.getAttribute('data-proyecto');
                    trackEvent('project_view', { project: projectName });
                });
            });
            
            // Track contact form submissions
            const contactForm = document.getElementById('formulario-contacto');
            if (contactForm) {
                contactForm.addEventListener('submit', () => {
                    trackEvent('form_submit', { form: 'contact' });
                });
            }
        });
    }
})();
