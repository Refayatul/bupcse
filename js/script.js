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
const printOverviewBtn = document.getElementById('printOverview');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    console.log("DOMContentLoaded event");
    
    // Initialize dark mode
    initDarkMode();
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
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
});

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

    // Bookmarks modal
    if (showBookmarksBtn) {
        showBookmarksBtn.addEventListener('click', showBookmarks);
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
        courseListBtn.addEventListener('click', async function(event) {
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
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (darkModeToggle) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            darkModeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (resourceSearchNav) {
                resourceSearchNav.focus();
            }
        }
        
        // Escape to close modals and search results
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = "none";
            });
            if (searchResultsNav) {
                searchResultsNav.style.display = "none";
            }
        }
        
        // Number keys for batch selection
        if (e.key >= '1' && e.key <= '4') {
            const batchBtn = document.querySelector(`[data-batch="${e.key}"]`);
            if (batchBtn) {
                batchBtn.click();
            }
        }
    });

    // Show keyboard shortcuts hint
    setTimeout(() => {
        const hint = document.createElement('div');
        hint.className = 'keyboard-shortcuts';
        hint.innerHTML = '⌨️ Keyboard shortcuts: Ctrl+K to search, Esc to close, 1-4 for batches';
        document.body.appendChild(hint);
        
        setTimeout(() => {
            hint.style.display = 'block';
            setTimeout(() => {
                hint.style.display = 'none';
            }, 5000);
        }, 1000);
    }, 3000);
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
            const isPdf = resource.link && resource.link.toLowerCase().endsWith('.pdf');
            const cardClass = isPdf ? 'resource-card resource-card-pdf' : 'resource-card';
            const resourceEl = `
                <a href="${resource.link}" target="_blank" class="${cardClass}">
                    <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5V19H13V5H15ZM11 5V19H9V5H11ZM7 5V19H5V5H7ZM19 5V19H17V5H19Z" fill="currentColor"/>
                    </svg>
                    ${resource.name || 'Resource'}
                    <span class="bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${resource.link}', '${resource.name || 'Resource'}')">📑</span>
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
                routineBtn.innerHTML = `
                    <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 5V19H13V5H15ZM11 5V19H9V5H11ZM7 5V19H5V5H7ZM19 5V19H17V5H19Z" fill="currentColor"/>
                    </svg>
                    ${routine.name || 'Routine'}
                    <span class="bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${routine.link}', '${routine.name || 'Routine'}')">📑</span>
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
                    subjectsHTML += `
                        <a href="${subject.link}" target="_blank" class="material-link">
                            <svg class="material-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 5V19H13V5H15ZM11 5V19H9V5H11ZM7 5V19H5V5H7ZM19 5V19H17V5H19Z" fill="currentColor"/>
                            </svg>
                            ${subject.name || 'Subject'}
                            <span class="bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${subject.link}', '${subject.name || 'Subject'}')">📑</span>
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
                        ${noticeHTML}
                        ${contentHTML}
                        ${subjectsHTML} 
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
    const nav = document.getElementById('mobile-nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (nav && hamburger) {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const arrow = element.querySelector('.accordion-arrow');
    
    const currentlyOpen = content.classList.contains('open');

    document.querySelectorAll('.accordion-content.open').forEach(el => {
        el.classList.remove('open');
        const header = el.previousElementSibling;
        if (header) {
            const arrowEl = header.querySelector('.accordion-arrow');
            if (arrowEl) {
                arrowEl.classList.remove('rotate');
            }
        }
    });
    
    if (!currentlyOpen) {
        content.classList.toggle('open');
        if (arrow) {
            arrow.classList.toggle('rotate');
        }
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

// Close mobile menu and search results when clicking outside
document.addEventListener('click', function(event) {
    const nav = document.getElementById('mobile-nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (nav && hamburger && nav.classList.contains('active')) {
        // Check if click is outside nav and hamburger
        if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
    
    // Close search results when clicking outside
    const searchResultsNav = document.getElementById('searchResultsNav');
    const resourceSearchNav = document.getElementById('resourceSearchNav');
    const clearSearchNav = document.getElementById('clearSearchNav');
    
    if (searchResultsNav && resourceSearchNav && clearSearchNav) {
        if (!searchResultsNav.contains(event.target) && 
            event.target !== resourceSearchNav && 
            event.target !== clearSearchNav) {
            searchResultsNav.style.display = "none";
        }
    }
});