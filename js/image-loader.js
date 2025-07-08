/**
 * Image Loading Optimization Manager
 * Handles intelligent loading of images based on user interactions and priorities
 */

class ImageLoader {
    constructor() {
        this.loadedImages = new Set();
        this.isLoading = new Map();
        this.intersectionObserver = null;
        this.init();
    }

    init() {
        // Set up intersection observer for lazy loading
        this.setupIntersectionObserver();
        
        // Preload critical images immediately
        this.preloadCriticalImages();
        
        // Set up event listeners for project navigation
        this.setupProjectListeners();
        
        // Set up event listeners for gallery navigation
        this.setupGalleryListeners();
    }

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.intersectionObserver.unobserve(entry.target);
                    }
                });
            }, {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            });
        }
    }

    preloadCriticalImages() {
        // These images are already preloaded via <link> tags in HTML head
        // Just mark them as loaded to avoid duplicate requests
        const criticalImages = [
            './img/01_ini_ofelia.jpg',
            './img/01_ini_cielito.jpg',
            './img/01_ini_yerma.jpeg',
            './img/01_ini_oasis.JPG',
            './img/03_pr_oasis.png',
            './img/03_pr_cielito_lindo.png',
            './img/03_pr_arboles_flores.jpg',
            './img/03_pr_teloclaro_2.png',
            './img/03_pr_marea.png',
            './img/04_gal_ilustraciones.png',
            './img/04_gal_moodboards.png',
            './img/d_grafico/d_grafico_1.jpg'
        ];

        criticalImages.forEach(src => this.loadedImages.add(src));
    }

    setupProjectListeners() {
        // Listen for project item clicks to preload project images
        document.addEventListener('click', (e) => {
            const projectItem = e.target.closest('.proyecto-item');
            if (projectItem) {
                const projectId = projectItem.dataset.proyecto;
                this.preloadProjectImages(projectId);
            }
        });

        // Listen for project hover to start preloading
        document.addEventListener('mouseenter', (e) => {
            const projectItem = e.target.closest('.proyecto-item');
            if (projectItem) {
                const projectId = projectItem.dataset.proyecto;
                setTimeout(() => this.preloadProjectImages(projectId), 300);
            }
        }, true);
    }

    setupGalleryListeners() {
        // Listen for gallery item clicks
        document.addEventListener('click', (e) => {
            const galeriaItem = e.target.closest('.galeria-item');
            if (galeriaItem) {
                const galeriaId = galeriaItem.dataset.galeria;
                this.preloadGalleryImages(galeriaId);
            }
        });

        // Listen for gallery hover
        document.addEventListener('mouseenter', (e) => {
            const galeriaItem = e.target.closest('.galeria-item');
            if (galeriaItem) {
                const galeriaId = galeriaItem.dataset.galeria;
                setTimeout(() => this.preloadGalleryImages(galeriaId), 500);
            }
        }, true);
    }

    preloadProjectImages(projectId) {
        const imageGroups = {
            'proyecto1': [
                './img/proyectos/oasis_panel.jpg',
                './img/proyectos/oasis_sel_1.jpeg',
                './img/proyectos/oasis_sel_2.jpg',
                './img/proyectos/oasis_sel_3.jpg',
                './img/proyectos/oasis_sel_4.jpg',
                './img/proyectos/oasis_ficha.png'
            ],
            'proyecto2': [
                './img/proyectos/cielito_1.jpg',
                './img/proyectos/cielito_2.jpg',
                './img/proyectos/cielito_3.jpg',
                './img/proyectos/cielito_4.jpg',
                './img/proyectos/cielito_ficha.png'
            ],
            'proyecto3': [
                './img/proyectos/arb_flor_1.png',
                './img/proyectos/arb_flor_2.jpg',
                './img/proyectos/arb_flor_3.jpg',
                './img/proyectos/arb_flor_4.jpg',
                './img/proyectos/arb_flor_5.jpg'
            ],
            'proyecto4': [
                './img/proyectos/teloclaro_1.jpg',
                './img/proyectos/teloclaro_2.jpg',
                './img/proyectos/teloclaro_3.jpg',
                './img/proyectos/teloclaro_4.jpg'
            ],
            'proyecto5': [
                './img/proyectos/marea_1.png',
                './img/proyectos/marea_2.png',
                './img/proyectos/marea_3.png',
                './img/proyectos/marea_4.png',
                './img/proyectos/marea_ficha.png'
            ]
        };

        const images = imageGroups[projectId];
        if (images) {
            this.batchPreload(images, 2); // Load 2 images at a time
        }
    }

    preloadGalleryImages(galeriaId) {
        const imageGroups = {
            'ilustraciones': [
                './img/ilustraciones/bus_riders_1.jpg',
                './img/ilustraciones/bus_riders_2.jpg',
                './img/ilustraciones/bus_riders_3.jpg',
                './img/ilustraciones/bus_riders_4.jpg'
            ],
            'moodboards': [
                './img/moodboards/moodboard_cielito.jpg',
                './img/moodboards/moodboard_lea.jpg',
                './img/moodboards/moodboard_hand_me_down.jpg',
                './img/moodboards/moodboard_telar.jpg',
                './img/moodboards/moodboard_urbano.jpg'
            ],
            'diseno-grafico': [
                './img/d_grafico/d_grafico_2.jpg',
                './img/d_grafico/d_grafico_3.jpg',
                './img/d_grafico/d_grafico_4.jpg'
            ]
        };

        const images = imageGroups[galeriaId];
        if (images) {
            this.batchPreload(images, 3); // Load 3 images at a time for galleries
        }
    }

    batchPreload(imageSrcs, batchSize = 2) {
        const unloadedImages = imageSrcs.filter(src => !this.loadedImages.has(src));
        
        for (let i = 0; i < unloadedImages.length; i += batchSize) {
            const batch = unloadedImages.slice(i, i + batchSize);
            setTimeout(() => {
                batch.forEach(src => this.preloadImage(src));
            }, i * 100); // Stagger batch loading
        }
    }

    preloadImage(src) {
        if (this.loadedImages.has(src) || this.isLoading.get(src)) {
            return Promise.resolve();
        }

        this.isLoading.set(src, true);

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.loadedImages.add(src);
                this.isLoading.set(src, false);
                resolve(img);
            };
            img.onerror = () => {
                this.isLoading.set(src, false);
                reject(new Error(`Failed to load image: ${src}`));
            };
            img.src = src;
        });
    }

    loadImage(imgElement) {
        const src = imgElement.dataset.src || imgElement.src;
        if (!src || this.loadedImages.has(src)) return;

        // Add placeholder effect while loading
        imgElement.classList.add('image-placeholder');

        if (imgElement.dataset.src) {
            imgElement.onload = () => {
                imgElement.classList.remove('image-placeholder');
                imgElement.classList.add('loaded');
                this.loadedImages.add(src);
            };
            imgElement.onerror = () => {
                imgElement.classList.remove('image-placeholder');
                console.warn(`Failed to load image: ${src}`);
            };
            imgElement.src = imgElement.dataset.src;
            imgElement.removeAttribute('data-src');
        } else {
            // Image already has src, just mark as loaded
            imgElement.classList.remove('image-placeholder');
            imgElement.classList.add('loaded');
            this.loadedImages.add(src);
        }
    }

    // Method to lazy load images in current viewport
    enableLazyLoading() {
        if (!this.intersectionObserver) return;

        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            this.intersectionObserver.observe(img);
        });
    }

    // Method to load remaining images in a project when it becomes active
    loadProjectImagesOnDemand(projectId) {
        const projectSection = document.getElementById(projectId);
        if (!projectSection) return;

        const images = projectSection.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            // Remove lazy loading and load immediately
            img.removeAttribute('loading');
            this.loadImage(img);
        });
    }

    // Method to load gallery images when gallery section becomes active
    loadGalleryImagesOnDemand(galeriaId) {
        const galeriaSection = document.getElementById(galeriaId);
        if (!galeriaSection) return;

        const images = galeriaSection.querySelectorAll('img[loading="lazy"]');
        images.forEach((img, index) => {
            // Stagger loading to avoid overwhelming the browser
            setTimeout(() => {
                img.removeAttribute('loading');
                this.loadImage(img);
            }, index * 50);
        });
    }
}

// Initialize the image loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.imageLoader = new ImageLoader();
    
    // Enable lazy loading for images still marked as lazy
    window.imageLoader.enableLazyLoading();
    
    // Dispatch event to notify other scripts that image loader is ready
    document.dispatchEvent(new CustomEvent('imageLoaderReady'));
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageLoader;
}
