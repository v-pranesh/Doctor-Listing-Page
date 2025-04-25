// Sample doctors data
const doctorsData = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialities: ["Cardiology", "Internal Medicine"],
        experience: 15,
        fees: 120,
        image: "https://picsum.photos/id/64/100/100",
        consultType: ["Video Consult", "In Clinic"],
        rating: 4.8
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialities: ["Neurology", "Pain Management"],
        experience: 20,
        fees: 150,
        image: "https://picsum.photos/id/65/100/100",
        consultType: ["In Clinic"],
        rating: 4.9
    },
    {
        id: 3,
        name: "Dr. Jennifer Smith",
        specialities: ["Pediatrics", "Allergy & Immunology"],
        experience: 12,
        fees: 100,
        image: "https://picsum.photos/id/66/100/100",
        consultType: ["Video Consult"],
        rating: 4.7
    },
    {
        id: 4,
        name: "Dr. Robert Patel",
        specialities: ["Orthopedics", "Sports Medicine"],
        experience: 18,
        fees: 140,
        image: "https://picsum.photos/id/67/100/100",
        consultType: ["Video Consult", "In Clinic"],
        rating: 4.6
    },
    {
        id: 5,
        name: "Dr. Lisa Wong",
        specialities: ["Dermatology"],
        experience: 10,
        fees: 130,
        image: "https://picsum.photos/id/68/100/100",
        consultType: ["In Clinic"],
        rating: 4.5
    },
    {
        id: 6,
        name: "Dr. David Miller",
        specialities: ["Psychiatry", "Behavioral Health"],
        experience: 16,
        fees: 160,
        image: "https://picsum.photos/id/69/100/100",
        consultType: ["Video Consult"],
        rating: 4.9
    },
    {
        id: 7,
        name: "Dr. Rachel Brown",
        specialities: ["Ophthalmology"],
        experience: 14,
        fees: 110,
        image: "https://picsum.photos/id/70/100/100",
        consultType: ["In Clinic", "Video Consult"],
        rating: 4.8
    },
    {
        id: 8,
        name: "Dr. Thomas Garcia",
        specialities: ["Gastroenterology", "Internal Medicine"],
        experience: 22,
        fees: 170,
        image: "https://picsum.photos/id/71/100/100",
        consultType: ["In Clinic"],
        rating: 4.7
    }
];

// DOM Elements
const searchBar = document.querySelector('.search-bar');
const suggestionsContainer = document.querySelector('#search-suggestions');
const doctorListContainer = document.querySelector('#doctor-list');
const specialityFiltersContainer = document.querySelector('#speciality-filters');
const consultationFilters = document.querySelectorAll('input[name="consultation"]');
const sortFilter = document.querySelector('#sort-filter');

// Track current filters
let currentFilters = {
    search: '',
    consultType: 'all',
    specialities: [],
    sort: 'default'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Extract unique specialities for filter options
    const uniqueSpecialities = [...new Set(doctorsData.flatMap(doctor => doctor.specialities))].sort();
    
    // Populate speciality filters
    uniqueSpecialities.forEach(speciality => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'checkbox-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = speciality.toLowerCase().replace(/\s+/g, '-');
        checkbox.value = speciality;
        
        const label = document.createElement('label');
        label.setAttribute('for', checkbox.id);
        label.textContent = speciality;
        
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        specialityFiltersContainer.appendChild(checkboxDiv);
        
        // Add event listener for the checkbox
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                currentFilters.specialities.push(speciality);
            } else {
                currentFilters.specialities = currentFilters.specialities.filter(s => s !== speciality);
            }
            filterDoctors();
        });
    });
    
    // Initial render of doctor list
    filterDoctors();
});

// Search functionality with autocomplete
searchBar.addEventListener('input', () => {
    const searchValue = searchBar.value.trim();
    currentFilters.search = searchValue;
    
    // Show suggestions if there's text in the search bar
    if (searchValue) {
        const matchingDoctors = doctorsData
            .filter(doctor => doctor.name.toLowerCase().includes(searchValue.toLowerCase()))
            .slice(0, 3); // Limit to top 3 matches
        
        if (matchingDoctors.length > 0) {
            // Clear and show suggestions
            suggestionsContainer.innerHTML = '';
            suggestionsContainer.style.display = 'block';
            
            matchingDoctors.forEach(doctor => {
                const suggestionItem = document.createElement('div');
                suggestionItem.className = 'suggestion-item';
                
                // Highlight the matching text
                const regex = new RegExp(`(${searchValue})`, 'gi');
                const highlightedName = doctor.name.replace(regex, '<span class="highlight">$1</span>');
                suggestionItem.innerHTML = highlightedName;
                
                // Add click event to the suggestion
                suggestionItem.addEventListener('click', () => {
                    searchBar.value = doctor.name;
                    currentFilters.search = doctor.name;
                    suggestionsContainer.style.display = 'none';
                    filterDoctors();
                });
                
                suggestionsContainer.appendChild(suggestionItem);
            });
        } else {
            // Hide suggestions if no matches
            suggestionsContainer.style.display = 'none';
        }
    } else {
        // Hide suggestions if search bar is empty
        suggestionsContainer.style.display = 'none';
    }
    
    filterDoctors();
});

// Hide suggestions when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.search-container')) {
        suggestionsContainer.style.display = 'none';
    }
});

// Enter key on search bar
searchBar.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        suggestionsContainer.style.display = 'none';
        filterDoctors();
    }
});

// Consultation type filter listeners
consultationFilters.forEach(radio => {
    radio.addEventListener('change', () => {
        currentFilters.consultType = radio.value;
        filterDoctors();
    });
});

// Sort filter listener
sortFilter.addEventListener('change', () => {
    currentFilters.sort = sortFilter.value;
    filterDoctors();
});

// Main filter function
function filterDoctors() {
    let filteredDoctors = [...doctorsData];
    
    // Filter by search term
    if (currentFilters.search) {
        filteredDoctors = filteredDoctors.filter(doctor => 
            doctor.name.toLowerCase().includes(currentFilters.search.toLowerCase())
        );
    }
    
    // Filter by consultation type
    if (currentFilters.consultType !== 'all') {
        filteredDoctors = filteredDoctors.filter(doctor => 
            doctor.consultType.includes(currentFilters.consultType)
        );
    }
    
    // Filter by specialities
    if (currentFilters.specialities.length > 0) {
        filteredDoctors = filteredDoctors.filter(doctor => 
            currentFilters.specialities.some(speciality => doctor.specialities.includes(speciality))
        );
    }
    
    // Apply sorting
    switch(currentFilters.sort) {
        case 'fees-asc':
            filteredDoctors.sort((a, b) => a.fees - b.fees);
            break;
        case 'experience-desc':
            filteredDoctors.sort((a, b) => b.experience - a.experience);
            break;
        default:
            // Default sorting (by rating)
            filteredDoctors.sort((a, b) => b.rating - a.rating);
    }
    
    // Render the filtered list
    renderDoctorList(filteredDoctors);
}

// Render doctor cards
function renderDoctorList(doctors) {
    doctorListContainer.innerHTML = '';
    
    if (doctors.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <h3>No doctors found</h3>
            <p>Try adjusting your search or filters</p>
        `;
        doctorListContainer.appendChild(noResults);
        return;
    }
    
    doctors.forEach(doctor => {
        const doctorCard = document.createElement('div');
        doctorCard.className = 'doctor-card';
        
        // Create consultation type tags
        const consultTags = doctor.consultType.map(type => {
            const className = type === 'Video Consult' ? 'video-tag' : 'clinic-tag';
            return `<span class="${className}">${type}</span>`;
        }).join(' ');
        
        doctorCard.innerHTML = `
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image">
            <h3 class="doctor-name">${doctor.name}</h3>
            <div class="doctor-specialties">${doctor.specialities.join(', ')}</div>
            <div class="doctor-details">
                <div class="doctor-detail">
                    <span>Experience:</span> ${doctor.experience} years
                </div>
                <div class="doctor-detail">
                    <span>Fees:</span> $${doctor.fees}
                </div>
                <div class="doctor-detail">
                    <span>Rating:</span> ${doctor.rating}/5
                </div>
            </div>
            ${consultTags}
            <div class="doctor-buttons">
                <button class="book-btn">Book Appointment</button>
            </div>
        `;
        
        doctorListContainer.appendChild(doctorCard);
    });
}