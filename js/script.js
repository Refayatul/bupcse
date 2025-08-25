let allBatchesData = [];
let currentBatchId = '1';
let currentFilter = 'all';

const batchSelector = document.getElementById('batchSelector');
const currentBatchIndicator = document.getElementById('currentBatch');
const heroBatchText = document.getElementById('heroBatchText');
const resourceGrid = document.getElementById('resourceGrid');
const semesterAccordion = document.getElementById('semesterAccordion');
const resourceSearch = document.getElementById('resourceSearch');
const searchResults = document.getElementById('searchResults');
const clearSearch = document.getElementById('clearSearch');

const courseListModal = document.getElementById('courseListModal');
const courseListBtn = document.getElementById('courseListBtn');
const closeCourseListModalBtn = document.getElementById('closeCourseListModal');
const courseListContent = document.getElementById('courseListContent');

const feedbackModal = document.getElementById('feedbackModal');
const feedbackBtn = document.getElementById('feedbackBtn');
const closeFeedbackModalBtn = document.getElementById('closeFeedbackModal');
const feedbackForm = document.getElementById('feedbackForm');

const bookmarksModal = document.getElementById('bookmarksModal');
const showBookmarksBtn = document.getElementById('showBookmarks');
const closeBookmarksModalBtn = document.getElementById('closeBookmarksModal');
const bookmarksList = document.getElementById('bookmarksList');

const darkModeToggle = document.getElementById('darkModeToggle');
const filterButtons = document.querySelectorAll('.filter-btn');

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
    batchSelector.addEventListener('click', (event) => {
        if (event.target.classList.contains('batch-select-btn')) {
            const selectedBatch = event.target.dataset.batch;
            updateUIForBatch(selectedBatch);
        }
    });

    // Search functionality
    resourceSearch.addEventListener('input', handleSearch);
    clearSearch.addEventListener('click', clearSearchInput);

    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            updateQuickResources(currentBatchId);
        });
    });

    // Feedback modal
    if (feedbackBtn) {
        feedbackBtn.addEventListener('click', () => {
            feedbackModal.style.display = "block";
        });
    }

    if (closeFeedbackModalBtn) {
        closeFeedbackModalBtn.addEventListener('click', () => {
            feedbackModal.style.display = "none";
        });
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }

    // Bookmarks modal
    if (showBookmarksBtn) {
        showBookmarksBtn.addEventListener('click', showBookmarks);
    }

    if (closeBookmarksModalBtn) {
        closeBookmarksModalBtn.addEventListener('click', () => {
            bookmarksModal.style.display = "none";
        });
    }

    // Modal close on outside click
    window.addEventListener('click', (event) => {
        if (event.target == courseListModal) {
            courseListModal.style.display = "none";
        }
        if (event.target == feedbackModal) {
            feedbackModal.style.display = "none";
        }
        if (event.target == bookmarksModal) {
            bookmarksModal.style.display = "none";
        }
    });

    // Print overview
    const printOverviewBtn = document.getElementById('printOverview');
    if (printOverviewBtn) {
        printOverviewBtn.addEventListener('click', printSemesterOverview);
    }
}

async function populateCourseListModal() {
    try {
        const response = await fetch('./data/courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const courseDataText = data.courseListText;

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
        courseListContent.innerHTML = '<p>Error loading course list. Please try again later.</p>';
    }
}

if (courseListBtn) {
    courseListBtn.onclick = async function(event) {
        event.preventDefault();
        await populateCourseListModal();
        courseListModal.style.display = "block";
    }
}

if (closeCourseListModalBtn) {
    closeCourseListModalBtn.onclick = function() {
        courseListModal.style.display = "none";
    }
}

function handleFeedbackSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('feedbackName').value;
    const email = document.getElementById('feedbackEmail').value;
    const message = document.getElementById('feedbackMessage').value;

    // In a real app, you would send this to a server
    console.log('Feedback submitted:', { name, email, message });

    // Show success message
    alert('Thank you for your feedback! We appreciate your input.');

    // Reset form and close modal
    feedbackForm.reset();
    feedbackModal.style.display = "none";
}

function showBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
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
    bookmarksModal.style.display = "block";
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
        const link = icon.closest('a').href;
        if (bookmarks.some(b => b.link === link)) {
            icon.classList.add('bookmarked');
            icon.textContent = '🔖';
        } else {
            icon.classList.remove('bookmarked');
            icon.textContent = '📑';
        }
    });
}

function handleSearch() {
    const searchTerm = resourceSearch.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        searchResults.style.display = 'none';
        clearSearch.style.display = 'none';
        return;
    }

    clearSearch.style.display = 'block';
    
    const batchConfig = allBatchesData.find(b => b.id === currentBatchId);
    if (!batchConfig) return;

    // Search in resources
    const allResources = [
        ...batchConfig.resources,
        ...batchConfig.semesters.flatMap(s => s.subjects || [])
    ];

    const filteredResources = allResources.filter(resource =>
        resource.name.toLowerCase().includes(searchTerm) ||
        (resource.description && resource.description.toLowerCase().includes(searchTerm))
    );

    if (filteredResources.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No resources found</div>';
    } else {
        let html = '';
        filteredResources.slice(0, 10).forEach(resource => {
            html += `
                <div class="search-result-item" onclick="window.open('${resource.link}', '_blank')">
                    <strong>${resource.name}</strong>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 4px;">
                        ${resource.link.includes('drive.google.com') ? 'Google Drive' : 'Resource'}
                    </div>
                </div>
            `;
        });
        searchResults.innerHTML = html;
    }

    searchResults.style.display = 'block';
}

function clearSearchInput() {
    resourceSearch.value = '';
    searchResults.style.display = 'none';
    clearSearch.style.display = 'none';
    resourceSearch.focus();
}

function initDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (darkModeToggle) {
            darkModeToggle.textContent = '☀️';
        }
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            darkModeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            resourceSearch.focus();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.style.display = "none";
            });
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

function printSemesterOverview() {
    const batchConfig = allBatchesData.find(b => b.id === currentBatchId);
    if (!batchConfig) return;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Semester Overview - ${batchConfig.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #0D47A1; }
                h2 { color: #008080; margin-top: 20px; }
                ul { list-style-type: none; padding-left: 0; }
                li { padding: 5px 0; border-bottom: 1px solid #eee; }
                .semester { margin-bottom: 30px; }
            </style>
        </head>
        <body>
            <h1>${batchConfig.heroText}</h1>
            <h2>Current Semester: ${batchConfig.currentSemesterName}</h2>
            ${batchConfig.semesters.map(semester => `
                <div class="semester">
                    <h2>${semester.name}</h2>
                    ${semester.subjects ? `
                        <ul>
                            ${semester.subjects.map(subject => `
                                <li>${subject.name}</li>
                            `).join('')}
                        </ul>
                    ` : '<p>No detailed subjects available</p>'}
                </div>
            `).join('')}
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function updateQuickResources(batchId) {
    currentBatchId = batchId;
    const batchConfig = allBatchesData.find(b => b.id === batchId);
    if (!batchConfig) {
        console.error(`updateQuickResources: Batch config not found for ID ${batchId}`);
        resourceGrid.innerHTML = '<p>Error: Batch data not found.</p>';
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
                    return resource.link.toLowerCase().endsWith('.pdf');
                case 'drive':
                    return resource.link.includes('drive.google.com');
                case 'routine':
                    return resource.name.toLowerCase().includes('routine');
                case 'full':
                    return resource.name.toLowerCase().includes('full');
                default:
                    return true;
            }
        });
    }
    
    // Separate PDFs from other links for correct ordering
    const pdfLinks = baseResources.filter(r => r.link.toLowerCase().endsWith('.pdf'));
    const otherBaseLinks = baseResources.filter(r => !r.link.toLowerCase().endsWith('.pdf') && !r.name.includes('Routine'));
    
    // Only show routine links for the current semester
    const currentSemester = batchConfig.semesters.find(s => s.name === batchConfig.currentSemesterName);
    let routineLinks = [];
    
    // Look for routine links in the main resources first
    const mainRoutineLinks = baseResources.filter(r => 
        r.name.includes('Routine') || r.name.includes('routine')
    );
    routineLinks = routineLinks.concat(mainRoutineLinks);

    // Combine resources in proper order: PDFs first, then other links
    let orderedResourcesToShow = pdfLinks.concat(otherBaseLinks);

    resourceGrid.innerHTML = ''; 
    if (orderedResourcesToShow.length === 0) {
        resourceGrid.innerHTML = '<p>No quick resources available for this batch.</p>';
        return;
    }
    
    orderedResourcesToShow.forEach(resource => {
        const isPdf = resource.link.toLowerCase().endsWith('.pdf');
        const cardClass = isPdf ? 'resource-card resource-card-pdf' : 'resource-card';
        const resourceEl = `
            <a href="${resource.link}" target="_blank" class="${cardClass}">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5V19H13V5H15ZM11 5V19H9V5H11ZM7 5V19H5V5H7ZM19 5V19H17V5H19Z" fill="currentColor"/>
                </svg>
                ${resource.name}
                <span class="bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${resource.link}', '${resource.name}')">📑</span>
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
                ${routine.name}
                <span class="bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${routine.link}', '${routine.name}')">📑</span>
            `;
            routineContainer.appendChild(routineBtn);
        });
        
        // Insert routine buttons after the resource grid
        resourceGrid.parentNode.insertBefore(routineContainer, resourceGrid.nextSibling);
    }

    // Update bookmark icons
    setTimeout(updateBookmarkIcons, 100);
}

function updateSemesterAccordion(batchId) {
    const batchConfig = allBatchesData.find(b => b.id === batchId);
    if (!batchConfig || !batchConfig.semesters) {
        console.error(`updateSemesterAccordion: Batch config or semesters not found for ID ${batchId}`);
        semesterAccordion.innerHTML = '<p>Error: Semester data not found.</p>';
        return;
    }

    let semestersToDisplay = [...batchConfig.semesters];

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
                        ${subject.name}
                        <span class="bookmark-icon" onclick="event.preventDefault(); toggleBookmark('${subject.link}', '${subject.name}')">📑</span>
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
                    <span class="accordion-title">${semester.name}</span>
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

    // Update bookmark icons after accordion is rendered
    setTimeout(updateBookmarkIcons, 100);
}

function updateUIForBatch(batchId) {
    console.log(`updateUIForBatch called with: ${batchId}`);
    const batchConfig = allBatchesData.find(b => b.id === batchId);
    if (!batchConfig) {
        console.error("No data for batch:", batchId);
        heroBatchText.textContent = "Error: Batch data not found.";
        currentBatchIndicator.textContent = `Batch ?`;
        resourceGrid.innerHTML = "";
        semesterAccordion.innerHTML = "";
        return;
    }

    currentBatchIndicator.textContent = batchConfig.name;
    heroBatchText.textContent = batchConfig.heroText;
    
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

function toggleMenu() {
    const nav = document.getElementById('mobile-nav');
    nav.classList.toggle('active');
}

function toggleAccordion(element) {
    const content = element.nextElementSibling;
    const arrow = element.querySelector('.accordion-arrow');
    
    const currentlyOpen = content.classList.contains('open');

    document.querySelectorAll('.accordion-content.open').forEach(el => {
        el.classList.remove('open');
        el.previousElementSibling.querySelector('.accordion-arrow').classList.remove('rotate');
    });
    
    if (!currentlyOpen) {
        content.classList.toggle('open');
        arrow.classList.toggle('rotate');
    }
}

function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const arrow = element.querySelector('.faq-arrow');
    
    answer.classList.toggle('open');
    arrow.classList.toggle('rotate');
}

document.addEventListener('click', function(event) {
    const nav = document.getElementById('mobile-nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (nav && hamburger && !nav.contains(event.target) && !hamburger.contains(event.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});