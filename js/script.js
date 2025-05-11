let batchData = { // Changed const to let to allow modification
    "1": {
        heroText: "Batch 1 Academic Resources",
        currentSemesterName: "Semester 6 (Current)",
        resources: [ // These are quick resources, not semester specific, keeping as is unless specified
            { name: "Computer Network", link: "https://drive.google.com/drive/folders/18Z5Z-eEovSHLiwt52UvS4pyrzy-WMNtd?usp=drive_link" },
            { name: "DSD", link: "https://drive.google.com/drive/folders/1q1EA5qH7GKnuLxP_1LkpRzBm4K8WRSyB?usp=drive_link" },
            { name: "Environmental Sustainability", link: "https://drive.google.com/drive/folders/1wDYf2TPmRupzpCElgsHt5nAMkRfa3c-S?usp=drive_link" },
            { name: "Research Methodology", link: "https://drive.google.com/drive/folders/1LbqyPhcxdOazSEj8LOGkpS_m_KLzHG8U?usp=drive_link" },
            { name: "SDP", link: "https://drive.google.com/drive/folders/1hKbfUn7FRf7i2eQPYyzqHb7oFy3x8Zt1?usp=drive_link" },
            { name: "Software Engineering", link: "https://drive.google.com/drive/folders/1-WvzoF3YWRNs4UXdiYZLzLf-LsnllZ_p?usp=drive_link" }
        ],
        semesters: [
            { 
                name: "Semester 6 (Current)", 
                notice: { title: "Midterm Exam Date Changed (Batch 1)", text: "The midterm exam for Batch 1 has been rescheduled. Please check Google Drive." }, 
                materials: [
                    { name: "Computer Network", link: "https://drive.google.com/drive/folders/18Z5Z-eEovSHLiwt52UvS4pyrzy-WMNtd?usp=drive_link" },
                    { name: "DSD", link: "https://drive.google.com/drive/folders/1q1EA5qH7GKnuLxP_1LkpRzBm4K8WRSyB?usp=drive_link" },
                    { name: "Environmental Sustainability", link: "https://drive.google.com/drive/folders/1wDYf2TPmRupzpCElgsHt5nAMkRfa3c-S?usp=drive_link" },
                    { name: "Research Methodology", link: "https://drive.google.com/drive/folders/1LbqyPhcxdOazSEj8LOGkpS_m_KLzHG8U?usp=drive_link" },
                    { name: "SDP", link: "https://drive.google.com/drive/folders/1hKbfUn7FRf7i2eQPYyzqHb7oFy3x8Zt1?usp=drive_link" },
                    { name: "Software Engineering", link: "https://drive.google.com/drive/folders/1-WvzoF3YWRNs4UXdiYZLzLf-LsnllZ_p?usp=drive_link" }
                ], 
                isOpen: true
            },
            { 
                name: "Semester 5", 
                materials: [
                    { name: "Compiler", link: "https://drive.google.com/drive/folders/1jZSLwQhKPZrdIByNEkmgw3NK7EOnrxRf?usp=drive_link" },
                    { name: "Data Communication", link: "https://drive.google.com/drive/folders/11YQa3n_hGFMfjrsn1c5YtPWxB9Pa8JEP?usp=drive_link" },
                    { name: "DBMS", link: "https://drive.google.com/drive/folders/14_DHUqZNCludaFY14qQSmcakoyFz_t7t?usp=drive_link" },
                    { name: "MMAL", link: "https://drive.google.com/drive/folders/1XMop-MkMX1-E1k2Q5oY5jAdb_iffoPys?usp=drive_link" },
                    { name: "OS", link: "https://drive.google.com/drive/folders/1PNqyk9DRJI8JDj1HmSRzFoTTrCtpzVmY?usp=drive_link" },
                    { name: "Required Softwares", link: "https://drive.google.com/drive/folders/12MFNYIN0g9nyrgRnQu7EtKYT66JUvfom?usp=drive_link" }
                ]
            },
            { 
                name: "Semester 4", 
                materials: [
                    { name: "Computer Architecture", link: "https://drive.google.com/drive/folders/1PL7JctaxqaGfZuGDgpvwO81LxTVJnngO?usp=drive_link" },
                    { name: "DEPT", link: "https://drive.google.com/drive/folders/1VQomr5ZNGpAF380sz42VK0BJFl2Oh1Lt?usp=drive_link" },
                    { name: "DSA - 2", link: "https://drive.google.com/drive/folders/1lTH-vB-b0bd5bHA7YMT6a7gRDGIwdOHW?usp=drive_link" },
                    { name: "GEEM", link: "https://drive.google.com/drive/folders/1CeUB_SXwHTLkC3ZjOyyfLZCBzRdBS5q6?usp=drive_link" },
                    { name: "OOP-2", link: "https://drive.google.com/drive/folders/1zhTRSVyMyDqYRNOZ3pfopcwsK0lp9_fp?usp=drive_link" },
                    { name: "Statistics", link: "https://drive.google.com/drive/folders/1Tz4J1mYEHaIHEgni_g2S85rnMsildTJ0?usp=drive_link" },
                    { name: "ED & CAD", link: "https://drive.google.com/drive/folders/1u3qzdaipCdeEwdJXl-20LybxzHsQ2o6Q?usp=drive_link" }
                ]
            },
            { 
                name: "Semester 3", 
                materials: [
                    { name: "DSA", link: "https://drive.google.com/drive/folders/1_Md1V1-a5Vsdh6lO2lrHVkvkcY6A7lSf?usp=drive_link" },
                    { name: "OOP", link: "https://drive.google.com/drive/folders/196nnQbBhEyooxbLTtPh8mmwXa53Ccos3?usp=drive_link" },
                    { name: "TOC", link: "https://drive.google.com/drive/folders/13pmOFgrRtdg58iaeDKfcxM9VVQSmMfyG?usp=drive_link" },
                    { name: "PSD", link: "https://drive.google.com/drive/folders/1moes0z7lqeK57pHby8kP99TvsF0-JBae?usp=drive_link" },
                    { name: "EDI", link: "https://drive.google.com/drive/folders/1FKlFxG0yvCq0rGxeuLeI7-OUSNInzBvr?usp=drive_link" },
                    { name: "Differential Equations, Laplace Transform and Fourier Transform", link: "https://drive.google.com/drive/folders/1v7HMhRMkn7UqWj82i7ipQyni4z9O1PFv?usp=drive_link" }
                ]
            },
            { 
                name: "Semester 2", 
                materials: [
                    { name: "Digital Logic Design", link: "https://drive.google.com/drive/folders/1lxVaSLqu67KUIAj8QDyYZwByNeOxERVH?usp=drive_link" },
                    { name: "Structured Programming Language", link: "https://drive.google.com/drive/folders/1dCi6NTXPlF18j9NgPSn6t99z-jtagAdr?usp=drive_link" },
                    { name: "Electronics Devices and Circuits", link: "https://drive.google.com/drive/folders/1KzksD44RURQKBMBL-agPh-hblnlMfr3J?usp=drive_link" },
                    { name: "French", link: "https://drive.google.com/drive/folders/1EYrO6x8jG0RuMD5Vw6v64eiuhDBBXEg_?usp=drive_link" },
                    { name: "Discrete Math", link: "https://drive.google.com/drive/folders/14rcLnVr4N9s3sJE5goL8gY_10fRaA2z1?usp=drive_link" },
                    { name: "Linear Algebra", link: "https://drive.google.com/drive/folders/1JV5UQwB2d0YGNapr1jsInLix6nZ62ASP?usp=drive_link" }
                ]
            },
            { 
                name: "Semester 1", 
                materials: [
                    { name: "Chemistry", link: "https://drive.google.com/drive/folders/144bT5YPyGAUEKgnx_h9DfUrqaqmdxhQT?usp=drive_link" },
                    { name: "English", link: "https://drive.google.com/drive/folders/1LH97VOVXg5Xcvpzk4n9CFReAEewzTRLj?usp=drive_link" },
                    { name: "GEBS", link: "https://drive.google.com/drive/folders/1RFg6lO-lCLc5nMz6V5MtNtnZKSpwO5tj?usp=drive_link" },
                    { name: "ICE", link: "https://drive.google.com/drive/folders/1ARuK4LKjWKyxlJmlDmAS0gMW13-pSKMT?usp=drive_link" },
                    { name: "Math", link: "https://drive.google.com/drive/folders/1llRCHE1EQX8LpiCUsIqrb8oYMo45OSvN?usp=drive_link" },
                    { name: "Physics", link: "https://drive.google.com/drive/folders/1fWflEPeUWjjjY-oKgD9VPDQ6JbculIVi?usp=drive_link" }
                ]
            },
            { name: "Semester 7", content: "Resources for Batch 1, Semester 7." }, // Will be filtered for Batch 1
            { name: "Semester 8", content: "Resources for Batch 1, Semester 8." }  // Will be filtered for Batch 1
        ],
        routineLink: "assets/images/3-2 Routine_a.png" // Example
    },
    "2": {
        heroText: "Batch 2 Academic Resources",
        currentSemesterName: "Semester 4 (Current)",
        // resources will be populated by current semester's materials
        resources: [], 
        semesters: [ // Order: 5, 4(Current), 3, 2, 1
            { name: "Semester 5", materials: [] }, 
            { 
                name: "Semester 4 (Current)", 
                notice: { title: "Project Submission (Batch 2)", text: "Submit your projects by next week." }, 
                materials: [], // Will be populated from subjects.json
                isOpen: true 
            },
            { name: "Semester 3", materials: [] }, 
            { name: "Semester 2", materials: [] }, 
            { name: "Semester 1", materials: [] }
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
        semesters: [ // Order: 2(Current), 1
            { 
                name: "Semester 2 (Current)", 
                notice: { title: "Quiz Announcement (Batch 3)", text: "Quiz next Friday on Chapter 1-3." }, 
                materials: [{ name: "Programming Slides B3", link: "#"}], 
                isOpen: true 
            },
            { name: "Semester 1", content: "Resources for Batch 3, Semester 1." }
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
        semesters: [ // Order: 1(Current)
             { 
                name: "Semester 1 (Current)", 
                notice: { title: "Welcome Batch 4!", text: "Orientation details are in Google Drive." }, 
                materials: [{ name: "CS101 Syllabus B4", link: "#"}], 
                isOpen: true 
            }
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

// Course List Modal Elements
const courseListModal = document.getElementById('courseListModal');
const courseListBtn = document.getElementById('courseListBtn');
const closeCourseListModalBtn = document.getElementById('closeCourseListModal');
const courseListContent = document.getElementById('courseListContent');

// const courseDataText = `...`; // Removed, will fetch from JSON

async function populateCourseListModal() {
    try {
        const response = await fetch('./data/courses.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const courseDataText = data.courseListText; // Assuming the key in JSON is courseListText

        if (!courseDataText) {
            courseListContent.innerHTML = '<p>Error: Course list data not found in JSON.</p>';
            return;
        }

        let htmlContent = '';
        // const sections = courseDataText.split(/\n\n(?=\S+ Semester)/); // This split might not be needed if parsing logic is robust

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
                const semesterName = lines.pop(); // The last line is the semester name
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


// Event Listeners for Course List Modal
if (courseListBtn) {
    courseListBtn.onclick = async function(event) { // Make onclick async
        event.preventDefault(); // Prevent default anchor behavior
        await populateCourseListModal(); // Await the async function
        courseListModal.style.display = "block";
    }
}

if (closeCourseListModalBtn) {
    closeCourseListModalBtn.onclick = function() {
        courseListModal.style.display = "none";
    }
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    if (event.target == courseListModal) {
        courseListModal.style.display = "none";
    }
}


function updateQuickResources(batchId) {
    let resourcesToShow = batchData[batchId].resources;

    // For Batch 2, show current semester's materials as quick resources
    if (batchId === "2") {
        const currentSemester = batchData[batchId].semesters.find(s => s.name === batchData[batchId].currentSemesterName);
        if (currentSemester && currentSemester.materials) {
            resourcesToShow = currentSemester.materials;
        }
    }

    resourceGrid.innerHTML = ''; // Clear existing resources
    resourcesToShow.forEach(resource => {
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
    let semestersToDisplay = batchData[batchId].semesters;
    
    // If Batch 1 is selected, filter out Semester 7 and Semester 8
    if (batchId === "1") {
        semestersToDisplay = semestersToDisplay.filter(semester => 
            semester.name !== "Semester 7" && semester.name !== "Semester 8"
        );
    }
    // For Batch 2, only filter out Semester 5
    if (batchId === "2") {
        semestersToDisplay = semestersToDisplay.filter(semester => semester.name !== "Semester 5");
    }


    semesterAccordion.innerHTML = ''; // Clear existing items
    semestersToDisplay.forEach(semester => {
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
        // For Batch 2, ensure other semesters are not open by default
        const isOpenClass = (batchId === "2" && semester.name !== batchData[batchId].currentSemesterName) ? '' : (semester.isOpen ? 'open' : '');
        const arrowRotateClass = (batchId === "2" && semester.name !== batchData[batchId].currentSemesterName) ? '' : (semester.isOpen ? 'rotate' : '');


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
async function loadExternalSubjectData() {
    try {
        const response = await fetch('./data/subjects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const externalData = await response.json();

        // Integrate externalData into batchData
        externalData.batches.forEach(batch => {
            const batchIdStr = batch.name.replace('Batch ', ''); // Assuming "Batch X" format
            if (batchData[batchIdStr]) {
                batch.semesters.forEach(semester => {
                    const semesterIndex = batchData[batchIdStr].semesters.findIndex(s => s.name === semester.name);
                    if (semesterIndex !== -1) {
                        // Replace/update materials for the specific semester
                        batchData[batchIdStr].semesters[semesterIndex].materials = semester.subjects.map(subject => ({
                            name: subject.name,
                            link: subject.link
                        }));
                        console.log(`Updated Batch ${batchIdStr}, ${semester.name} with external subjects.`);
                    } else {
                        // Optionally add the semester if it doesn't exist, or log a warning
                        console.warn(`Semester ${semester.name} not found in batchData for Batch ${batchIdStr}.`);
                    }
                });
            } else {
                console.warn(`Batch ${batchIdStr} not found in batchData.`);
            }
        });
    } catch (error) {
        console.error("Could not fetch or parse external subject data:", error);
    }
}

document.addEventListener('DOMContentLoaded', async () => { // Make async
    console.log("DOMContentLoaded event"); // DEBUG
    await loadExternalSubjectData(); // Load external data first
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
