let allBatchesData = [];

const batchSelector = document.getElementById('batchSelector');
const currentBatchIndicator = document.getElementById('currentBatch');
const heroBatchText = document.getElementById('heroBatchText');
const resourceGrid = document.getElementById('resourceGrid');
const semesterAccordion = document.getElementById('semesterAccordion');

const courseListModal = document.getElementById('courseListModal');
const courseListBtn = document.getElementById('courseListBtn');
const closeCourseListModalBtn = document.getElementById('closeCourseListModal');
const courseListContent = document.getElementById('courseListContent');

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

window.onclick = function(event) {
    if (event.target == courseListModal) {
        courseListModal.style.display = "none";
    }
}

function updateQuickResources(batchId) {
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
            `;
            routineContainer.appendChild(routineBtn);
        });
        
        // Insert routine buttons after the resource grid
        resourceGrid.parentNode.insertBefore(routineContainer, resourceGrid.nextSibling);
    }
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

batchSelector.addEventListener('click', (event) => {
    if (event.target.classList.contains('batch-select-btn')) {
        const selectedBatch = event.target.dataset.batch;
        updateUIForBatch(selectedBatch);
    }
});

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

document.addEventListener('DOMContentLoaded', async () => { 
    console.log("DOMContentLoaded event"); 
    await loadExternalSubjectData(); 
    const savedBatch = localStorage.getItem('selectedBatch') || (allBatchesData.length > 0 ? allBatchesData[0].id : '1');
    console.log(`Loading saved batch: ${savedBatch}`); 
    updateUIForBatch(savedBatch);
    
    document.querySelectorAll('.notice-banner, .notice-box').forEach(el => {
        if (!el.parentElement || el.parentElement.nodeName !== 'SCRIPT') {
            el.style.display = 'none'; 
        }
    });
});

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

document.addEventListener('click', function(event) {
    const nav = document.getElementById('mobile-nav');
    const hamburger = document.querySelector('.hamburger');
    
    if (nav && hamburger && !nav.contains(event.target) && !hamburger.contains(event.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
    }
});