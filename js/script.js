 // Mobile menu toggle
 function toggleMenu() {
    const nav = document.getElementById('mobile-nav');
    nav.classList.toggle('active');
}

// Accordion toggle
function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const arrow = element.querySelector('.accordion-arrow');
    
    // Close all accordion items
    document.querySelectorAll('.accordion-content').forEach(el => {
        if (el !== content) {
            el.classList.remove('open');
            el.previousElementSibling.querySelector('.accordion-arrow').classList.remove('rotate');
        }
    });
    
    // Toggle the clicked item
    content.classList.toggle('open');
    arrow.classList.toggle('rotate');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mobile-nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (!nav.contains(event.target) && !hamburger.contains(event.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});

// Initialize semester 6 as open
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.accordion-content.open')?.classList.add('open');
});