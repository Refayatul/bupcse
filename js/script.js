let allBatchesData = [];
let currentBatchId = '1';
let currentFilter = 'all';

// DOM Elements
const batchSelector = document.getElementById('batchSelector');
const currentBatchIndicator = document.getElementById('currentBatch');
const heroBatchText = document.getElementById('heroBatchText');
const resourceGrid = document.getElementById('resourceGrid');
const semesterAccordion = document.getElementById('semesterAccordion');
const resourceSearchNav = document.getElementById('resourceSearchNav');
const searchResultsNav = document.getElementById('searchResultsNav');
const clearSearchNav = document.getElementById('clearSearchNav');
const searchContainerNav = document.querySelector('.search-container-nav');
const searchIconNav = document.querySelector('.search-icon-nav');

// Modals
const courseListModal = document.getElementById('courseListModal');
const courseListBtn = document.getElementById('courseListBtn');
const closeCourseListModalBtn = document.getElementById('closeCourseListModal');
const courseListContent = document.getElementById('courseListContent');

const bookmarksModal = document.getElementById('bookmarksModal');
const showBookmarksBtn = document.getElementById('showBookmarks');
const closeBookmarksModalBtn = document.getElementById('closeBookmarksModal');
const bookmarksList = document.getElementById('bookmarksList');

const darkModeToggle = document.getElementById('darkModeToggle');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Spotlight Search
const spotlightSearchModal = document.getElementById('spotlightSearchModal');
const spotlightSearchInput = document.getElementById('spotlightSearchInput');
const spotlightSearchResults = document.getElementById('spotlightSearchResults');
const closeSpotlight = document.getElementById('closeSpotlight');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOMContentLoaded event");

    // Initialize dark mode (set to dark by default)
    initDarkMode();

    // Load data
    await loadExternalSubjectData();
    const savedBatch = localStorage.getItem('selectedBatch') || (allBatchesData.length > 0 ? allBatchesData[0].id : '1');
    console.log(`Loading saved batch: ${savedBatch}`);
    updateUIForBatch(savedBatch);

    // Set up event listeners
    setupEventListeners();

    // Hide notices
    document.querySelectorAll('.notice-banner, .notice-box').forEach(el => {
        if (!el.parentElement || el.parentElement.nodeName !== 'SCRIPT') {
            el.style.display = 'none';
        }
    });

    // Handle window resize for dynamic navbar
    handleDynamicNavbar();
    window.addEventListener('resize', handleDynamicNavbar);
});

function handleDynamicNavbar() {
    const navContainer = document.querySelector('.nav-container');
    const logo = document.querySelector('.logo');
    const mobileNavLinks = document.querySelector('.mobile-nav-links');
    const navbarControls = document.querySelector('.navbar-controls');
    const hamburger = document.querySelector('.hamburger');

    if (!navContainer || !logo || !mobileNavLinks || !navbarControls || !hamburger) return;

    // Reset display
    mobileNavLinks.style.display = 'flex';
    hamburger.style.display = 'flex';

    // Check available space
    const containerWidth = navContainer.offsetWidth;
    const logoWidth = logo.offsetWidth;
    const controlsWidth = navbarControls.offsetWidth;
    const navLinksWidth = mobileNavLinks.offsetWidth;
    const hamburgerWidth = hamburger.offsetWidth;

    const totalWidth = logoWidth + navLinksWidth + controlsWidth + hamburgerWidth + 40; // 40px buffer

    // If content doesn't fit, hide nav links and show hamburger
    if (totalWidth > containerWidth) {
        mobileNavLinks.style.display = 'none';
        hamburger.style.display = 'flex';
    } else {
        mobileNavLinks.style.display = 'flex';
        hamburger.style.display = 'none';
    }
}

function setupEventListeners() {
    // Batch selection
    if (batchSelector) {
        batchSelector.addEventListener('click', (event) => {
            let button = event.target;

            // Find the button element (could be the icon or the button itself)
            while (button && !button.classList.contains('batch-select-btn')) {
                button = button.parentElement;
                if (!button) break;
            }

            if (button && button.classList.contains('batch-select-btn')) {
                const selectedBatch = button.dataset.batch;
                updateUIForBatch(selectedBatch);
            }
        });
    }

    // Search functionality in navbar
    if (resourceSearchNav) {
        resourceSearchNav.addEventListener('input', handleSearchNav);
    }
    if (clearSearchNav) {
        clearSearchNav.addEventListener('click', clearSearchNavInput);
    }

    // Search icon click to expand search
    if (searchIconNav) {
        searchIconNav.addEventListener('click', function () {
            if (searchContainerNav) {
                searchContainerNav.classList.add('active');
                if (resourceSearchNav) {
                    setTimeout(() => {
                        resourceSearchNav.focus();
                    }, 100);
                }
            }
        });
    }

    // Close search when clicking outside
    document.addEventListener('click', function (event) {
        if (searchContainerNav && !searchContainerNav.contains(event.target) &&
            searchIconNav !== event.target) {
            searchContainerNav.classList.remove('active');
            if (searchResultsNav) {
                searchResultsNav.style.display = 'none';
            }
        }
    });

    // Bookmarks modal
    if (showBookmarksBtn) {
        showBookmarksBtn.addEventListener('click', showBookmarks);
    }

    // Mobile bookmarks button
    const mobileBookmarksBtn = document.getElementById('showBookmarksMobile');
    if (mobileBookmarksBtn) {
        mobileBookmarksBtn.addEventListener('click', showBookmarks);
    }

    if (closeBookmarksModalBtn) {
        closeBookmarksModalBtn.addEventListener('click', () => {
            if (bookmarksModal) {
                bookmarksModal.style.display = "none";
            }
        });
    }

    // Course list modal
    if (courseListBtn) {
        courseListBtn.addEventListener('click', async function (event) {
            event.preventDefault();
            await populateCourseListModal();
            if (courseListModal) {
                courseListModal.style.display = "block";
            }
        });
    }

    if (closeCourseListModalBtn) {
        closeCourseListModalBtn.addEventListener('click', () => {
            if (courseListModal) {
                courseListModal.style.display = "none";
            }
        });
    }

    // Modal close on outside click
    window.addEventListener('click', (event) => {
        if (event.target == courseListModal) {
            courseListModal.style.display = "none";
        }
        if (event.target == bookmarksModal) {
            bookmarksModal.style.display = "none";
        }
        if (event.target == searchResultsNav) {
            searchResultsNav.style.display = "none";
        }
        if (event.target == spotlightSearchModal) {
            closeSpotlightSearch();
        }
    });

    // Spotlight search input handling
    if (spotlightSearchInput) {
        spotlightSearchInput.addEventListener('input', (e) => {
            performSpotlightSearch(e.target.value);
        });

        spotlightSearchInput.addEventListener('keydown', (e) => {
            handleSpotlightNavigation(e);
        });
    }

    if (closeSpotlight) {
        closeSpotlight.addEventListener('click', closeSpotlightSearch);
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            toggleSpotlightSearch();
        }
        if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            toggleSpotlightSearch();
        }
    });
}

async function populateCourseListModal() {
    try {
        const response = await fetch('./data/courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const courseDataText = data.courseListText;

        if (!courseListContent) return;

        if (!courseDataText) {
            courseListContent.innerHTML = '<p>Error: Course list data not found in JSON.</p>';
            return;
        }

        let htmlContent = '';
        const headerInfo = courseDataText.substring(0, courseDataText.indexOf('--')).trim();
        const programInfoLines = headerInfo.split('\n');
        programInfoLines.forEach(line => {
            htmlContent += `<p>${line}</p>`;
        });
        htmlContent += '<hr style="margin: 15px 0;">';

        const semesterCourseText = courseDataText.substring(courseDataText.indexOf('--') + 2).trim();
        const semesterBlocks = semesterCourseText.split(/\n\n(?=\S+ Semester)/);

        semesterBlocks.forEach(block => {
            const lines = block.trim().split('\n');
            if (lines.length > 0) {
                const semesterName = lines.pop();
                htmlContent += `<h3>${semesterName}</h3><ul>`;
                lines.forEach(course => {
                    htmlContent += `<li>${course.trim()}</li>`;
                });
                htmlContent += `</ul>`;
            }
        });
        courseListContent.innerHTML = htmlContent;

    } catch (error) {
        console.error("Could not fetch or parse course data:", error);
        if (courseListContent) {
            courseListContent.innerHTML = '<p>Error loading course list. Please try again later.</p>';
        }
    }
}

function showBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

    if (!bookmarksList) return;

    if (bookmarks.length === 0) {
        bookmarksList.innerHTML = '<p>No bookmarks yet. Click the bookmark icon on any resource to save it here.</p>';
    } else {
        let html = '';
        bookmarks.forEach(bookmark => {
            html += `
                <div class="bookmark-item">
                    <a href="${bookmark.link}" target="_blank" class="bookmark-link">${bookmark.name}</a>
                    <button class="remove-bookmark" onclick="removeBookmark('${bookmark.link}')">Remove</button>
                </div>
            `;
        });
        bookmarksList.innerHTML = html;
    }

    if (bookmarksModal) {
        bookmarksModal.style.display = "block";
    }
}

function toggleBookmark(resourceLink, resourceName) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const existingIndex = bookmarks.findIndex(b => b.link === resourceLink);

    if (existingIndex >= 0) {
        // Remove bookmark
        bookmarks.splice(existingIndex, 1);
    } else {
        // Add bookmark
        bookmarks.push({ link: resourceLink, name: resourceName });
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkIcons();
}

function removeBookmark(resourceLink) {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    bookmarks = bookmarks.filter(b => b.link !== resourceLink);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    showBookmarks(); // Refresh the bookmarks list
    updateBookmarkIcons();
}

function updateBookmarkIcons() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    document.querySelectorAll('.bookmark-icon').forEach(icon => {
        const linkElement = icon.closest('a');
        if (linkElement && linkElement.href) {
            const link = linkElement.href;
            if (bookmarks.some(b => b.link === link)) {
                icon.classList.add('bookmarked');
                icon.textContent = '🔖';
            } else {
                icon.classList.remove('bookmarked');
                icon.textContent = '📑';
            }
        }
    });
}

function handleSearchNav() {
    if (!resourceSearchNav || !searchResultsNav || !clearSearchNav) return;

    const searchTerm = resourceSearchNav.value.toLowerCase().trim();

    if (searchTerm === '') {
        searchResultsNav.style.display = 'none';
        clearSearchNav.style.display = 'none';
        return;
    }

    clearSearchNav.style.display = 'block';

    const batchConfig = allBatchesData.find(b => b.id === currentBatchId);
    if (!batchConfig) return;

    // Search in resources
    const allResources = [
        ...(batchConfig.resources || []),
        ...batchConfig.semesters.flatMap(s => s.subjects || [])
    ];

    const filteredResources = allResources.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm) ||
        (resource.description && resource.description.toLowerCase().includes(searchTerm))
    );

    if (filteredResources.length === 0) {
        searchResultsNav.innerHTML = '<div class="search-result-item-nav">No resources found</div>';
    } else {
        let html = '';
        filteredResources.slice(0, 8).forEach(resource => {
            html += `
                <div class="search-result-item-nav" onclick="window.open('${resource.link}', '_blank')">
                    <i class="fas fa-file"></i>
                    <div>
                        <strong>${resource.name}</strong>
                        <div style="font-size: 0.8rem; color: #666; margin-top: 2px;">
                            ${resource.link.includes('drive.google.com') ? 'Google Drive' : 'Resource'}
                        </div>
                    </div>
                </div>
            `;
        });
        searchResultsNav.innerHTML = html;
    }

    searchResultsNav.style.display = 'block';
}

function clearSearchNavInput() {
    if (!resourceSearchNav || !searchResultsNav || !clearSearchNav) return;

    resourceSearchNav.value = '';
    searchResultsNav.style.display = 'none';
    clearSearchNav.style.display = 'none';
    resourceSearchNav.focus();
}

function initDarkMode() {
    // Check if user has a saved preference, otherwise use dark as default
    const savedTheme = localStorage.getItem('theme');

    // Set theme (dark by default, but respect user preference if saved)
    let theme = 'dark'; // Default to dark
    if (savedTheme) {
        theme = savedTheme;
    }

    // Apply the theme
    document.documentElement.setAttribute('data-theme', theme);

    if (darkModeToggle) {
        // Set initial icon based on theme
        darkModeToggle.innerHTML = theme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

        darkModeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Apply new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update button icon
            this.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

            // Force reflow to ensure styles are applied
            document.body.offsetHeight;
        });
    }
}

function getResourceBadgeHTML(link, name) {
    if (!link) return '';
    const lLink = link.toLowerCase();
    const lName = (name || '').toLowerCase();
    if (lLink.includes('drive.google.com/drive/folders/')) return '<span class="rc-badge badge-drive"><i class="fab fa-google-drive"></i> Folder</span>';
    if (lLink.includes('drive.google.com/file/d/')) return '<span class="rc-badge badge-file"><i class="fas fa-file"></i> File</span>';
    if (lLink.endsWith('.pdf')) return '<span class="rc-badge badge-pdf"><i class="fas fa-file-pdf"></i> PDF</span>';
    if (lName.includes('routine')) return '<span class="rc-badge badge-routine"><i class="fas fa-calendar-alt"></i> Routine</span>';
    return '<span class="rc-badge badge-link"><i class="fas fa-link"></i> Link</span>';
}

function getCopyLinkBtn(link) {
    return `<span class="rc-btn" onclick="event.preventDefault(); navigator.clipboard.writeText('${link}').then(() => alert('Copied!'))" title="Copy Link"><i class="fas fa-copy"></i></span>`;
}

function updateQuickResources(batchId) {
    currentBatchId = batchId;
    const batchConfig = allBatchesData.find(b => b.id === batchId);
    if (!batchConfig) {
        console.error(`updateQuickResources: Batch config not found for ID ${batchId}`);
        if (resourceGrid) {
            resourceGrid.innerHTML = '<p>Error: Batch data not found.</p>';
        }
        return;
    }

    let baseResources = batchConfig.resources ? [...batchConfig.resources] : [];

    // Remove any existing routine buttons container
    const existingRoutineContainer = document.getElementById('routineButtons');
    if (existingRoutineContainer) {
        existingRoutineContainer.remove();
    }

    // Apply filter
    if (currentFilter !== 'all') {
        baseResources = baseResources.filter(resource => {
            switch (currentFilter) {
                case 'pdf':
                    return resource.link && resource.link.toLowerCase().endsWith('.pdf');
                case 'drive':
                    return resource.link && resource.link.includes('drive.google.com');
                case 'routine':
                    return resource.name && resource.name.toLowerCase().includes('routine');
                case 'full':
                    return resource.name && resource.name.toLowerCase().includes('full');
                default:
                    return true;
            }
        });
    }

    // Separate PDFs from other links for correct ordering
    const pdfLinks = baseResources.filter(r => r.link && r.link.toLowerCase().endsWith('.pdf'));
    const otherBaseLinks = baseResources.filter(r => r.link && !r.link.toLowerCase().endsWith('.pdf') && (!r.name || !r.name.includes('Routine')));

    // Only show routine links for the current semester
    const currentSemester = batchConfig.semesters.find(s => s.name === batchConfig.currentSemesterName);
    let routineLinks = [];

    // Look for routine links in the main resources first
    const mainRoutineLinks = baseResources.filter(r =>
        r.name && (r.name.includes('Routine') || r.name.includes('routine'))
    );
    routineLinks = routineLinks.concat(mainRoutineLinks);

    // Combine resources in proper order: PDFs first, then other links
    let orderedResourcesToShow = pdfLinks.concat(otherBaseLinks);

    if (resourceGrid) {
        resourceGrid.innerHTML = '';
        if (orderedResourcesToShow.length === 0) {
            resourceGrid.innerHTML = '<p>No quick resources available for this batch.</p>';
            return;
        }

        orderedResourcesToShow.forEach(resource => {
            const badgeHTML = getResourceBadgeHTML(resource.link, resource.name);
            const copyBtnHTML = getCopyLinkBtn(resource.link);
            const resourceEl = `
                <a href="${resource.link}" target="_blank" class="resource-card">
                    <div class="rc-info">
                        <span class="rc-title" title="${resource.name || 'Resource'}">${resource.name || 'Resource'}</span>
                        ${badgeHTML}
                    </div>
                    <div class="rc-actions">
                        ${copyBtnHTML}
                        <span class="rc-btn bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${resource.link}', '${resource.name || 'Resource'}')">📑</span>
                    </div>
                </a>`;
            resourceGrid.innerHTML += resourceEl;
        });

        // Add routine buttons only if there are routine links
        if (routineLinks.length > 0) {
            const routineContainer = document.createElement('div');
            routineContainer.id = 'routineButtons';

            routineLinks.forEach((routine, index) => {
                const routineBtn = document.createElement('a');
                routineBtn.href = routine.link;
                routineBtn.target = '_blank';
                routineBtn.className = 'resource-card';
                const badgeHTML = getResourceBadgeHTML(routine.link, routine.name || 'Routine');
                const copyBtnHTML = getCopyLinkBtn(routine.link);
                routineBtn.innerHTML = `
                    <div class="rc-info">
                        <span class="rc-title" title="${routine.name || 'Routine'}">${routine.name || 'Routine'}</span>
                        ${badgeHTML}
                    </div>
                    <div class="rc-actions">
                        ${copyBtnHTML}
                        <span class="rc-btn bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${routine.link}', '${routine.name || 'Routine'}')">📑</span>
                    </div>
                `;
                routineContainer.appendChild(routineBtn);
            });

            // Insert routine buttons after the resource grid
            resourceGrid.parentNode.insertBefore(routineContainer, resourceGrid.nextSibling);
        }
    }

    // Update bookmark icons
    setTimeout(updateBookmarkIcons, 100);
}

function updateSemesterAccordion(batchId) {
    const batchConfig = allBatchesData.find(b => b.id === batchId);
    if (!batchConfig || !batchConfig.semesters) {
        console.error(`updateSemesterAccordion: Batch config or semesters not found for ID ${batchId}`);
        if (semesterAccordion) {
            semesterAccordion.innerHTML = '<p>Error: Semester data not found.</p>';
        }
        return;
    }

    let semestersToDisplay = [...batchConfig.semesters];

    if (semesterAccordion) {
        semesterAccordion.innerHTML = '';
        if (semestersToDisplay.length === 0) {
            semesterAccordion.innerHTML = '<p>No semester information available for this batch.</p>';
            return;
        }

        semestersToDisplay.forEach(semester => {
            let noticeHTML = '';

            let subjectsHTML = '';
            if (semester.subjects && semester.subjects.length > 0) {
                subjectsHTML = '<div class="material-links">';
                semester.subjects.forEach(subject => {
                    const badgeHTML = getResourceBadgeHTML(subject.link, subject.name || 'Subject');
                    const copyBtnHTML = getCopyLinkBtn(subject.link);
                    subjectsHTML += `
                        <a href="${subject.link}" target="_blank" class="material-link">
                            <div class="rc-info">
                                <span class="rc-title" title="${subject.name || 'Subject'}">${subject.name || 'Subject'}</span>
                                ${badgeHTML}
                            </div>
                            <div class="rc-actions">
                                ${copyBtnHTML}
                                <span class="rc-btn bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${subject.link}', '${subject.name || 'Subject'}')">📑</span>
                            </div>
                        </a>`;
                });
                subjectsHTML += '</div>';
            }

            const contentHTML = semester.content ? `<p>${semester.content}</p>` : '';

            // Default isOpen for current semester, or if explicitly set to true
            let isOpen = semester.isOpen || false;
            const isCurrentSemester = semester.name === batchConfig.currentSemesterName;
            if (isCurrentSemester) {
                isOpen = true;
            }

            const isOpenClass = isOpen ? 'open' : '';
            const arrowRotateClass = isOpen ? 'rotate' : '';

            const itemEl = `
                <div class="accordion-item">
                    <div class="accordion-header" onclick="toggleAccordion(this)">
                        <span class="accordion-title">${semester.name || 'Semester'}</span>
                        <svg class="accordion-arrow ${arrowRotateClass}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <div class="accordion-content ${isOpenClass}">
                        <div>
                            ${noticeHTML}
                            ${contentHTML}
                            ${subjectsHTML}
                        </div>
                    </div>
                </div>`;
            semesterAccordion.innerHTML += itemEl;
        });
    }

    // Update bookmark icons after accordion is rendered
    setTimeout(updateBookmarkIcons, 100);
}

function updateUIForBatch(batchId) {
    console.log(`updateUIForBatch called with: ${batchId}`);
    const batchConfig = allBatchesData.find(b => b.id === batchId);
    if (!batchConfig) {
        console.error("No data for batch:", batchId);
        if (heroBatchText) {
            heroBatchText.textContent = "Error: Batch data not found.";
        }
        if (currentBatchIndicator) {
            currentBatchIndicator.textContent = `Batch ?`;
        }
        if (resourceGrid) {
            resourceGrid.innerHTML = "";
        }
        if (semesterAccordion) {
            semesterAccordion.innerHTML = "";
        }
        return;
    }

    if (currentBatchIndicator) {
        currentBatchIndicator.textContent = batchConfig.name || `Batch ${batchId}`;
    }
    if (heroBatchText) {
        heroBatchText.textContent = batchConfig.heroText || `Batch ${batchId} Academic Resources`;
    }

    updateQuickResources(batchId);
    updateSemesterAccordion(batchId);

    document.querySelectorAll('.batch-select-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.batch === batchId) {
            btn.classList.add('selected');
        }
    });
    localStorage.setItem('selectedBatch', batchId);
}

async function loadExternalSubjectData() {
    try {
        const response = await fetch('./data/subjects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const externalData = await response.json();
        if (externalData && externalData.batches) {
            allBatchesData = externalData.batches;
            console.log("All batch data successfully loaded from data/subjects.json", allBatchesData);
        } else {
            throw new Error("JSON data is not in the expected format (missing 'batches' array)");
        }
    } catch (error) {
        console.error("Could not fetch or parse all batch data from JSON:", error);
        allBatchesData = [];
    }
}

// Improved mobile menu toggle
function toggleMenu() {
    if (mobileMenu && hamburger) {
        mobileMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

function toggleAccordion(element) {
    const item = element.parentElement;
    const content = element.nextElementSibling;
    const arrow = element.querySelector('.accordion-arrow');

    const currentlyOpen = content.classList.contains('open');

    // Close all other accordions
    document.querySelectorAll('.accordion-item').forEach(el => {
        el.classList.remove('active');
        const contentEl = el.querySelector('.accordion-content');
        const arrowEl = el.querySelector('.accordion-arrow');
        if (contentEl) contentEl.classList.remove('open');
        if (arrowEl) arrowEl.classList.remove('rotate');
    });

    if (!currentlyOpen) {
        item.classList.add('active');
        content.classList.add('open');
        if (arrow) {
            arrow.classList.add('rotate');
        }
        
        // Liquid scroll into view
        setTimeout(() => {
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const arrow = element.querySelector('.faq-arrow');

    if (answer) {
        answer.classList.toggle('open');
    }
    if (arrow) {
        arrow.classList.toggle('rotate');
    }
}

// Close mobile menu when clicking outside
document.addEventListener('click', function (event) {
    if (mobileMenu && hamburger && mobileMenu.classList.contains('active')) {
        // Check if click is outside menu and hamburger
        if (!mobileMenu.contains(event.target) && !hamburger.contains(event.target)) {
            mobileMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
});

// Handle quick action button clicks to prevent icon disappearance
document.addEventListener('click', function (event) {
    // Handle mobile quick action buttons
    if (event.target.closest('.mobile-action-btn') || event.target.closest('.action-btn')) {
        // Prevent default behavior that might cause icon issues
        const button = event.target.closest('.mobile-action-btn') || event.target.closest('.action-btn');
        if (button && button.tagName === 'A') {
            // For anchor buttons, let them navigate normally
            return;
        }
        // For button elements, handle click manually
        event.preventDefault();
    }
});

/* --- SPOTLIGHT SEARCH LOGIC --- */
function toggleSpotlightSearch() {
    if (!spotlightSearchModal) return;
    if (spotlightSearchModal.classList.contains('active')) {
        closeSpotlightSearch();
    } else {
        spotlightSearchModal.style.display = 'block';
        setTimeout(() => {
            spotlightSearchModal.classList.add('active');
            spotlightSearchInput.focus();
        }, 10);
        document.body.style.overflow = 'hidden';
    }
}

function closeSpotlightSearch() {
    if (!spotlightSearchModal) return;
    spotlightSearchModal.classList.remove('active');
    setTimeout(() => {
        spotlightSearchModal.style.display = 'none';
    }, 300);
    document.body.style.overflow = 'auto';
    spotlightSearchInput.value = '';
    spotlightSearchResults.innerHTML = '';
}

function performSpotlightSearch(query) {
    if (!query || query.trim().length < 2) {
        spotlightSearchResults.innerHTML = '';
        return;
    }

    const results = [];
    const lQuery = query.toLowerCase().trim();

    allBatchesData.forEach(batch => {
        // Search in Batch Resources (Quick Actions)
        const batchRes = batch.resources || [];
        batchRes.forEach(res => {
            if ((res.name && res.name.toLowerCase().includes(lQuery))) {
                results.push({ name: res.name, link: res.link, type: 'Resource', context: batch.name });
            }
        });

        // Search in Semesters/Subjects
        const semesters = batch.semesters || [];
        semesters.forEach(sem => {
            const subjects = sem.subjects || [];
            subjects.forEach(sub => {
                if ((sub.name && sub.name.toLowerCase().includes(lQuery))) {
                    results.push({ name: sub.name, link: sub.link, type: 'Subject', context: `${batch.name} - ${sem.name}` });
                }
            });
        });
    });

    renderSpotlightResults(results);
}

function renderSpotlightResults(results) {
    if (!spotlightSearchResults) return;
    if (results.length === 0) {
        spotlightSearchResults.innerHTML = '<div style="padding: 2.5rem; text-align: center; opacity: 0.5;">No matching results found for this query...</div>';
        return;
    }

    let html = '';
    // Limit to top 10 results
    results.slice(0, 10).forEach((item, index) => {
        const isPdf = item.link.toLowerCase().endsWith('.pdf');
        const isDrive = item.link.toLowerCase().includes('drive.google.com');
        const iconClass = isPdf ? 'fa-file-pdf' : (isDrive ? 'fa-google-drive' : 'fa-link');
        const iconBrandClass = isDrive ? 'fab' : 'fas';

        html += `
            <a href="${item.link}" target="_blank" class="spotlight-result-item ${index === 0 ? 'selected' : ''}" onclick="closeSpotlightSearch()">
                <i class="${iconBrandClass} ${iconClass}"></i>
                <div class="spotlight-result-info">
                    <span class="spotlight-result-title">${item.name}</span>
                    <span class="spotlight-result-meta">${item.context} | ${item.type}</span>
                </div>
            </a>`;
    });
    spotlightSearchResults.innerHTML = html;
}

function handleSpotlightNavigation(e) {
    const results = spotlightSearchResults.querySelectorAll('.spotlight-result-item');
    if (results.length === 0) return;

    let selectedIndex = -1;
    results.forEach((el, i) => { if (el.classList.contains('selected')) selectedIndex = i; });

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (selectedIndex < results.length - 1) {
            results[selectedIndex]?.classList.remove('selected');
            results[selectedIndex + 1].classList.add('selected');
            results[selectedIndex + 1].scrollIntoView({ block: 'nearest' });
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (selectedIndex > 0) {
            results[selectedIndex]?.classList.remove('selected');
            results[selectedIndex - 1].classList.add('selected');
            results[selectedIndex - 1].scrollIntoView({ block: 'nearest' });
        }
    } else if (e.key === 'Enter') {
        if (selectedIndex !== -1) {
            e.preventDefault();
            results[selectedIndex].click();
            closeSpotlightSearch();
        }
    } else if (e.key === 'Escape') {
        closeSpotlightSearch();
    }
}
