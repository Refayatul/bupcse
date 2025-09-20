// Research Guide JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize research guide functionality
    initializeResearchGuide();
});

function initializeResearchGuide() {
    // Smooth scrolling for navigation links
    initializeSmoothScrolling();

    // Initialize search functionality
    initializeSearch();

    // Initialize mobile menu toggle
    initializeMobileMenu();

    // Add animation effects
    initializeAnimations();

    // Initialize progress tracking
    initializeProgressTracking();
}

function initializeSmoothScrolling() {
    // Smooth scroll to sections when clicking navigation links
    const navLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const headerOffset = 80; // Account for fixed header
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking (if open)
                const mobileMenu = document.getElementById('mobileMenu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    toggleMenu();
                }
            }
        });
    });
}

function initializeSearch() {
    const searchInput = document.getElementById('resourceSearchNav');
    const clearButton = document.getElementById('clearSearchNav');
    const searchResults = document.getElementById('searchResultsNav');

    if (!searchInput || !clearButton || !searchResults) return;

    // Search functionality
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();

        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        // Search through research guide content
        const results = searchResearchContent(query);

        if (results.length > 0) {
            displaySearchResults(results, query);
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
            searchResults.style.display = 'block';
        }
    });

    // Clear search
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        searchResults.style.display = 'none';
        searchInput.focus();
    });

    // Hide results when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
}

function searchResearchContent(query) {
    const results = [];
    const sections = document.querySelectorAll('.research-content > div[id]');

    sections.forEach(section => {
        const title = section.querySelector('h3');
        const content = section.textContent.toLowerCase();

        if (content.includes(query)) {
            results.push({
                id: section.id,
                title: title ? title.textContent : 'Research Section',
                snippet: getSnippet(content, query)
            });
        }
    });

    return results;
}

function getSnippet(text, query) {
    const index = text.indexOf(query);
    const start = Math.max(0, index - 50);
    const end = Math.min(text.length, index + query.length + 50);
    let snippet = text.substring(start, end);

    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    return snippet;
}

function displaySearchResults(results, query) {
    const searchResults = document.getElementById('searchResultsNav');
    let html = '';

    results.forEach(result => {
        const highlightedSnippet = result.snippet.replace(
            new RegExp(query, 'gi'),
            match => `<mark>${match}</mark>`
        );

        html += `
            <div class="search-result-item" onclick="scrollToSection('${result.id}')">
                <div class="result-title">${result.title}</div>
                <div class="result-snippet">${highlightedSnippet}</div>
            </div>
        `;
    });

    searchResults.innerHTML = html;
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Hide search results
    const searchResults = document.getElementById('searchResultsNav');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

function initializeMobileMenu() {
    // Mobile menu toggle functionality
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
}

function initializeAnimations() {
    // Add fade-in animation for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all research sections
    const sections = document.querySelectorAll('.research-content > div');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

function initializeProgressTracking() {
    // Track reading progress
    const progressBar = createProgressBar();

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        progressBar.style.width = scrollPercent + '%';
    });
}

function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--accent-color);
        z-index: 1000;
        transition: width 0.3s ease;
    `;

    document.body.appendChild(progressBar);
    return progressBar;
}

// Utility function for mobile menu toggle (if not already defined)
function toggleMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

// Add keyboard navigation for search
document.addEventListener('keydown', function(e) {
    const searchInput = document.getElementById('resourceSearchNav');

    if (searchInput && e.key === '/' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        searchInput.focus();
    }

    if (e.key === 'Escape') {
        const searchResults = document.getElementById('searchResultsNav');
        if (searchResults) {
            searchResults.style.display = 'none';
        }
        if (searchInput) {
            searchInput.blur();
        }
    }
});

// Add print functionality for research papers
function addPrintFunctionality() {
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Guide';
    printButton.className = 'print-button';
    printButton.onclick = () => window.print();

    // Add to header or a specific section
    const researchContent = document.querySelector('.research-content');
    if (researchContent) {
        const printContainer = document.createElement('div');
        printContainer.className = 'print-container';
        printContainer.appendChild(printButton);
        researchContent.insertBefore(printContainer, researchContent.firstChild);
    }
}

// Initialize print functionality
addPrintFunctionality();
