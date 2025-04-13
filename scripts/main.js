// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');

    menuToggle?.addEventListener('click', () => {
        navList?.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => span.classList.toggle('active'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInside = menuToggle?.contains(event.target) || 
                            navList?.contains(event.target);
        
        if (!isClickInside && navList?.classList.contains('active')) {
            navList.classList.remove('active');
            const spans = menuToggle?.querySelectorAll('span');
            spans?.forEach(span => span.classList.remove('active'));
        }
    });
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Dark Mode Toggle (if system preference changes)
if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const toggleDarkMode = (e) => {
        document.body.classList.toggle('dark-mode', e.matches);
    };

    darkModeQuery.addListener(toggleDarkMode);
    toggleDarkMode(darkModeQuery);
}

// Simple Page Router
const router = () => {
    const hash = window.location.hash || '#home';
    const page = hash.slice(1);

    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });

    // Show current section
    const currentSection = document.getElementById(page);
    if (currentSection) {
        currentSection.style.display = 'block';
    }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);