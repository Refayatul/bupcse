const batchData = {
    "1": {
        heroText: "Batch 1 Academic Resources",
        currentSemesterName: "Semester 6 (Current)",
        resources: [
            { name: "Computer Network", link: "https://drive.google.com/drive/folders/18Z5Z-eEovSHLiwt52UvS4pyrzy-WMNtd?usp=drive_link" },
            { name: "DSD", link: "https://drive.google.com/drive/folders/1q1EA5qH7GKnuLxP_1LkpRzBm4K8WRSyB?usp=drive_link" },
            { name: "Environmental Sustainability", link: "https://drive.google.com/drive/folders/1wDYf2TPmRupzpCElgsHt5nAMkRfa3c-S?usp=drive_link" },
            { name: "Research Methodology", link: "https://drive.google.com/drive/folders/1LbqyPhcxdOazSEj8LOGkpS_m_KLzHG8U?usp=drive_link" },
            { name: "SDP", link: "https://drive.google.com/drive/folders/1hKbfUn7FRf7i2eQPYyzqHb7oFy3x8Zt1?usp=drive_link" },
            { name: "Software Engineering", link: "https://drive.google.com/drive/folders/1-WvzoF3YWRNs4UXdiYZLzLf-LsnllZ_p?usp=drive_link" }
        ],
        semesters: [
            { name: "Semester 1", content: "Resources for Batch 1, Semester 1." },
            { name: "Semester 2", content: "Resources for Batch 1, Semester 2." },
            { name: "Semester 3", content: "Resources for Batch 1, Semester 3." },
            { name: "Semester 4", content: "Resources for Batch 1, Semester 4." },
            { name: "Semester 5", content: "Resources for Batch 1, Semester 5." },
            { name: "Semester 6 (Current)", notice: { title: "Midterm Exam Date Changed (Batch 1)", text: "The midterm exam for Batch 1 has been rescheduled. Please check Google Drive." }, materials: [
                { name: "Computer Network", link: "https://drive.google.com/drive/folders/18Z5Z-eEovSHLiwt52UvS4pyrzy-WMNtd?usp=drive_link" },
                { name: "DSD", link: "https://drive.google.com/drive/folders/1q1EA5qH7GKnuLxP_1LkpRzBm4K8WRSyB?usp=drive_link" },
                { name: "Environmental Sustainability", link: "https://drive.google.com/drive/folders/1wDYf2TPmRupzpCElgsHt5nAMkRfa3c-S?usp=drive_link" },
                { name: "Research Methodology", link: "https://drive.google.com/drive/folders/1LbqyPhcxdOazSEj8LOGkpS_m_KLzHG8U?usp=drive_link" },
                { name: "SDP", link: "https://drive.google.com/drive/folders/1hKbfUn7FRf7i2eQPYyzqHb7oFy3x8Zt1?usp=drive_link" },
                { name: "Software Engineering", link: "https://drive.google.com/drive/folders/1-WvzoF3YWRNs4UXdiYZLzLf-LsnllZ_p?usp=drive_link" }
            ], isOpen: true},
            { name: "Semester 7", content: "Resources for Batch 1, Semester 7." },
            { name: "Semester 8", content: "Resources for Batch 1, Semester 8." }
        ],
        routineLink: "assets/images/3-2 Routine_a.png" // Example
    },
    "2": {
        heroText: "Batch 2 Academic Resources",
        currentSemesterName: "Semester 4 (Current)",
        resources: [
            { name: "Data Structures (B2)", link: "#" },
            { name: "Algorithms (B2)", link: "#" },
            { name: "Calculus II (B2)", link: "#" }
        ],
        semesters: [
            { name: "Semester 1", content: "Resources for Batch 2, Semester 1." },
            { name: "Semester 2", content: "Resources for Batch 2, Semester 2." },
            { name: "Semester 3", content: "Resources for Batch 2, Semester 3." },
            { name: "Semester 4 (Current)", notice: { title: "Project Submission (Batch 2)", text: "Submit your projects by next week." }, materials: [{ name: "DSA Notes B2", link: "#"}], isOpen: true },
            { name: "Semester 5", content: "Resources for Batch 2, Semester 5." }
        ],
        routineLink: "assets/images/routine_b2_placeholder.png" // Placeholder
    },
    "3": {
        heroText: "Batch 3 Academic Resources",
        currentSemesterName: "Semester 2 (Current)",
        resources: [
            { name: "Intro to Programming (B3)", link: "#" },
            { name: "Discrete Maths (B3)", link: "#" }
        ],
        semesters: [
            { name: "Semester 1", content: "Resources for Batch 3, Semester 1." },
            { name: "Semester 2 (Current)", notice: { title: "Quiz Announcement (Batch 3)", text: "Quiz next Friday on Chapter 1-3." }, materials: [{ name: "Programming Slides B3", link: "#"}], isOpen: true },
        ],
        routineLink: "assets/images/routine_b3_placeholder.png" // Placeholder
    },
    "4": {
        heroText: "Batch 4 Academic Resources",
        currentSemesterName: "Semester 1 (Current)",
        resources: [
            { name: "Fundamentals of CS (B4)", link: "#" },
            { name: "English I (B4)", link: "#" }
        ],
        semesters: [
             { name: "Semester 1 (Current)", notice: { title: "Welcome Batch 4!", text: "Orientation details are in Google Drive." }, materials: [{ name: "CS101 Syllabus B4", link: "#"}], isOpen: true },
        ],
        routineLink: "assets/images/routine_b4_placeholder.png" // Placeholder
    }
};

const batchSelector = document.getElementById('batchSelector');
const currentBatchIndicator = document.getElementById('currentBatch');
const heroBatchText = document.getElementById('heroBatchText');
const resourceGrid = document.getElementById('resourceGrid');
const semesterAccordion = document.getElementById('semesterAccordion');
const sectionARoutineBtn = document.getElementById('sectionARoutineBtn');


function updateQuickResources(batchId) {
    const data = batchData[batchId].resources;
    resourceGrid.innerHTML = ''; // Clear existing resources
    data.forEach(resource => {
        const resourceEl = `
            <a href="${resource.link}" target="_blank" class="resource-card">
                <svg class="resource-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 5V19H13V5H15ZM11 5V19H9V5H11ZM7 5V19H5V5H7ZM19 5V19H17V5H19Z" fill="currentColor"/>
                </svg>
                ${resource.name}
            </a>`;
        resourceGrid.innerHTML += resourceEl;
    });
}

function updateSemesterAccordion(batchId) {
    const data = batchData[batchId].semesters;
    semesterAccordion.innerHTML = ''; // Clear existing items
    data.forEach(semester => {
        let noticeHTML = '';
        if (semester.notice) {
            // noticeHTML = `
            //     <div class="notice-box">
            //         <h4>${semester.notice.title}</h4>
            //         <p>${semester.notice.text}</p>
            //     </div>`;
        }
        let materialsHTML = '';
        if (semester.materials) {
            materialsHTML = '<div class="material-links">';
            semester.materials.forEach(material => {
                materialsHTML += `
                    <a href="${material.link}" target="_blank" class="material-link">
                        <svg class="material-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 5V19H13V5H15ZM11 5V19H9V5H11ZM7 5V19H5V5H7ZM19 5V19H17V5H19Z" fill="currentColor"/>
                        </svg>
                        ${material.name}
                    </a>`;
            });
            materialsHTML += '</div>';
        }

        const contentHTML = semester.content ? `<p>${semester.content}</p>` : '';
        const isOpenClass = semester.isOpen ? 'open' : '';
        const arrowRotateClass = semester.isOpen ? 'rotate' : '';

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
                    ${materialsHTML}
                </div>
            </div>`;
        semesterAccordion.innerHTML += itemEl;
    });
}

function updateUIForBatch(batchId) {
    console.log(`updateUIForBatch called with: ${batchId}`); // DEBUG
    const data = batchData[batchId];
    if (!data) {
        console.error("No data for batch:", batchId);
        return;
    }

    currentBatchIndicator.textContent = `Batch ${batchId}`;
    heroBatchText.textContent = data.heroText;
    
    updateQuickResources(batchId);
    updateSemesterAccordion(batchId);

    if (sectionARoutineBtn && data.routineLink) {
        sectionARoutineBtn.href = data.routineLink;
        // Optionally change button text if needed, e.g., "Section A Routine (Batch X)"
        // sectionARoutineBtn.textContent = `Section A Routine (Batch ${batchId})`;
    }


    // Update selected button style
    document.querySelectorAll('.batch-select-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.batch === batchId) {
            btn.classList.add('selected');
        }
    });
    localStorage.setItem('selectedBatch', batchId);
}

batchSelector.addEventListener('click', (event) => {
    console.log("Batch selector clicked", event.target); // DEBUG
    if (event.target.classList.contains('batch-select-btn')) {
        const selectedBatch = event.target.dataset.batch;
        console.log(`Selected batch from click: ${selectedBatch}`); // DEBUG
        updateUIForBatch(selectedBatch);
    }
});

// Load saved batch or default to Batch 1
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event"); // DEBUG
    const savedBatch = localStorage.getItem('selectedBatch') || '1';
    console.log(`Loading saved batch: ${savedBatch}`); // DEBUG
    updateUIForBatch(savedBatch);
     // Ensure notices are commented out as per previous request
    document.querySelectorAll('.notice-banner, .notice-box').forEach(el => {
        // This is a bit of a hack for already rendered static HTML, 
        // dynamic notices are handled in updateSemesterAccordion
        if (!el.parentElement || el.parentElement.nodeName !== 'SCRIPT') {
             // el.style.display = 'none'; // Or add a class to hide
        }
    });
});


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
