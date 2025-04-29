/**
 * Blog filtering and sorting functionality
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortOptions = document.querySelectorAll('.sort-option');
    const blogItems = document.querySelectorAll('.blog-item');
    const noResultsElement = document.getElementById('no-results');
    const resetButton = document.getElementById('reset-filters');
    
    // Current filter state
    let currentFilter = 'all';
    let currentSort = 'newest';
    
    // Initialize - show all items
    filterAndSortItems();
    
    // Filter button click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update current filter
            currentFilter = this.getAttribute('data-filter');
            
            // Apply filtering and sorting
            filterAndSortItems();
        });
    });
    
    // Sort option click handler
    sortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active sort option
            sortOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update sort dropdown button text
            const sortText = this.textContent;
            document.getElementById('sortDropdown').innerHTML = `<i class="fas fa-sort me-1"></i> ${sortText}`;
            
            // Update current sort
            currentSort = this.getAttribute('data-sort');
            
            // Apply filtering and sorting
            filterAndSortItems();
        });
    });
    
    // Reset filters button click handler
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset filter
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === 'all') {
                    btn.classList.add('active');
                }
            });
            currentFilter = 'all';
            
            // Reset sort
            sortOptions.forEach(opt => {
                opt.classList.remove('active');
                if (opt.getAttribute('data-sort') === 'newest') {
                    opt.classList.add('active');
                }
            });
            currentSort = 'newest';
            document.getElementById('sortDropdown').innerHTML = '<i class="fas fa-sort me-1"></i> Newest First';
            
            // Apply filtering and sorting
            filterAndSortItems();
        });
    }
    
    // Main filtering and sorting function
    function filterAndSortItems() {
        // Get all items that match the current filter
        const filteredItems = Array.from(blogItems).filter(item => {
            if (currentFilter === 'all') {
                return true;
            } else {
                return item.getAttribute('data-category') === currentFilter;
            }
        });
        
        // Show or hide no results message
        if (filteredItems.length === 0) {
            if (noResultsElement) noResultsElement.classList.remove('d-none');
        } else {
            if (noResultsElement) noResultsElement.classList.add('d-none');
        }
        
        // Sort the filtered items
        filteredItems.sort((a, b) => {
            // Get dates from data attributes or elements
            const dateA = new Date(a.querySelector('.blog-date').textContent.replace(/[^\d]/g, ' ').trim());
            const dateB = new Date(b.querySelector('.blog-date').textContent.replace(/[^\d]/g, ' ').trim());
            
            if (currentSort === 'newest') {
                return dateB - dateA;
            } else if (currentSort === 'oldest') {
                return dateA - dateB;
            } else if (currentSort === 'popular') {
                // For this demo, we'll simulate popularity with a random order
                // In a real app, you would use view counts or other metrics
                return Math.random() - 0.5;
            }
        });
        
        // Hide all items first
        blogItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // Show filtered and sorted items
        filteredItems.forEach(item => {
            item.style.display = 'block';
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            // If empty, revert to current filter
            if (searchTerm === '') {
                filterAndSortItems();
                return;
            }
            
            // Hide all items
            blogItems.forEach(item => {
                item.style.display = 'none';
            });
            
            // Show items that match search term
            let foundItems = 0;
            blogItems.forEach(item => {
                const title = item.querySelector('.blog-title').textContent.toLowerCase();
                const excerpt = item.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
                const category = item.getAttribute('data-category').toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                    item.style.display = 'block';
                    foundItems++;
                }
            });
            
            // Show/hide no results message
            if (foundItems === 0) {
                if (noResultsElement) noResultsElement.classList.remove('d-none');
            } else {
                if (noResultsElement) noResultsElement.classList.add('d-none');
            }
        });
    }
});
