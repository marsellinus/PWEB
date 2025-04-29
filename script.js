/**
 * Main JavaScript file for Portfolio Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog filtering and search functionality
    initBlogFilters();
    
    // Initialize article page functionality
    initArticlePage();
    
    // Add smooth scrolling to all links
    initSmoothScrolling();
    
    // Initialize tooltips
    initTooltips();
});

/**
 * Blog filtering, searching and sorting functionality
 */
function initBlogFilters() {
    // Check if we're on the blog page
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    // Elements
    const blogItems = document.querySelectorAll('.blog-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortOptions = document.querySelectorAll('.sort-option');
    const noResultsElement = document.getElementById('no-results');
    const resetButton = document.getElementById('reset-filters');
    const searchInput = document.getElementById('blog-search');
    const searchButton = searchInput ? searchInput.nextElementSibling : null;

    // Current filter state
    let currentFilter = 'all';
    let currentSort = 'newest';
    let searchTerm = '';

    // Apply initial filtering
    filterAndSortItems();

    // Filter button click handler
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current filter
            currentFilter = this.getAttribute('data-filter');
            
            // Apply filtering and sorting
            filterAndSortItems();
            
            // Log activity for debugging
            console.log('Filter applied:', currentFilter);
        });
    });

    // Sort dropdown options click handler
    sortOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all options
            sortOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Update current sort
            currentSort = this.getAttribute('data-sort');
            
            // Update dropdown button text
            const sortText = this.textContent.trim();
            document.getElementById('sortDropdown').innerHTML = `<i class="fas fa-sort me-1"></i> ${sortText}`;
            
            // Apply filtering and sorting
            filterAndSortItems();
            
            // Log activity for debugging
            console.log('Sort applied:', currentSort);
        });
    });

    // Search functionality
    if (searchInput) {
        // Input event for real-time search
        searchInput.addEventListener('input', function() {
            searchTerm = this.value.toLowerCase().trim();
            filterAndSortItems();
            console.log('Search term:', searchTerm);
        });

        // Search button click
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                searchTerm = searchInput.value.toLowerCase().trim();
                filterAndSortItems();
            });
        }

        // Enter key in search field
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchTerm = this.value.toLowerCase().trim();
                filterAndSortItems();
            }
        });
    }

    // Reset filters button
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            // Reset filter buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-filter') === 'all') {
                    btn.classList.add('active');
                }
            });
            currentFilter = 'all';
            
            // Reset sort options
            sortOptions.forEach(opt => {
                opt.classList.remove('active');
                if (opt.getAttribute('data-sort') === 'newest') {
                    opt.classList.add('active');
                }
            });
            currentSort = 'newest';
            
            // Reset dropdown text
            document.getElementById('sortDropdown').innerHTML = '<i class="fas fa-sort me-1"></i> Newest First';
            
            // Reset search
            if (searchInput) {
                searchInput.value = '';
                searchTerm = '';
            }
            
            // Apply reset filters
            filterAndSortItems();
            
            console.log('Filters reset');
        });
    }

    // Main filtering and sorting function
    function filterAndSortItems() {
        // Filter items based on category and search term
        const filteredItems = Array.from(blogItems).filter(item => {
            // Check if item matches the category filter
            const categoryMatch = currentFilter === 'all' || item.getAttribute('data-category') === currentFilter;
            
            // If no search term, just check category
            if (!searchTerm) return categoryMatch;
            
            // Check if item matches the search term
            const title = item.querySelector('.blog-title')?.textContent.toLowerCase() || '';
            const excerpt = item.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
            const category = item.getAttribute('data-category').toLowerCase();
            const author = item.querySelector('.blog-author-name')?.textContent.toLowerCase() || '';
            
            const searchMatch = 
                title.includes(searchTerm) || 
                excerpt.includes(searchTerm) || 
                category.includes(searchTerm) || 
                author.includes(searchTerm);
                
            return categoryMatch && searchMatch;
        });
        
        // Sort filtered items
        filteredItems.sort((a, b) => {
            // Get date strings from blog items
            const dateA = a.querySelector('.blog-date')?.textContent.trim() || '';
            const dateB = b.querySelector('.blog-date')?.textContent.trim() || '';
            
            // Extract dates using regex
            const dateRegex = /(\w+)\s+(\d+),\s+(\d{4})/;
            const matchA = dateA.match(dateRegex);
            const matchB = dateB.match(dateRegex);
            
            if (matchA && matchB) {
                const monthsOrder = {
                    'January': 0, 'February': 1, 'March': 2, 'April': 3,
                    'May': 4, 'June': 5, 'July': 6, 'August': 7,
                    'September': 8, 'October': 9, 'November': 10, 'December': 11
                };
                
                // Parse dates
                const monthA = monthsOrder[matchA[1]] || 0;
                const dayA = parseInt(matchA[2]);
                const yearA = parseInt(matchA[3]);
                
                const monthB = monthsOrder[matchB[1]] || 0;
                const dayB = parseInt(matchB[2]);
                const yearB = parseInt(matchB[3]);
                
                // Create date objects
                const dateObjA = new Date(yearA, monthA, dayA);
                const dateObjB = new Date(yearB, monthB, dayB);
                
                // Sort by date
                if (currentSort === 'newest') {
                    return dateObjB - dateObjA; // Newest first
                } else if (currentSort === 'oldest') {
                    return dateObjA - dateObjB; // Oldest first
                }
            }
            
            // For popular sort, use view count if available
            if (currentSort === 'popular') {
                const viewsA = parseInt(a.querySelector('.far.fa-eye')?.closest('span')?.textContent.replace(/\D/g, '') || '0');
                const viewsB = parseInt(b.querySelector('.far.fa-eye')?.closest('span')?.textContent.replace(/\D/g, '') || '0');
                return viewsB - viewsA; // Higher views first
            }
            
            return 0;
        });
        
        // Hide all items
        blogItems.forEach(item => item.style.display = 'none');
        
        // Show filtered and sorted items
        filteredItems.forEach(item => item.style.display = 'block');
        
        // Show/hide no results message
        if (noResultsElement) {
            if (filteredItems.length === 0) {
                noResultsElement.classList.remove('d-none');
            } else {
                noResultsElement.classList.add('d-none');
            }
        }
        
        // Update count display if it exists
        const countElement = document.querySelector('.filter-count');
        if (countElement) {
            countElement.textContent = `Showing ${filteredItems.length} of ${blogItems.length} articles`;
        }
    }
}

/**
 * Article page specific functionality
 */
function initArticlePage() {
    // Check if we're on the article page
    const articleContent = document.querySelector('.article-content');
    if (!articleContent) return;

    // Handle comment form submission
    const commentForm = document.querySelector('.comment-form form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const commentInput = this.querySelector('#comment');
            const saveInfoCheckbox = this.querySelector('#saveInfo');
            
            // Validate inputs
            let isValid = true;
            
            if (!nameInput.value.trim()) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameInput.classList.remove('is-invalid');
                nameInput.classList.add('is-valid');
            }
            
            if (!emailInput.value.trim() || !isValidEmail(emailInput.value)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }
            
            if (!commentInput.value.trim()) {
                commentInput.classList.add('is-invalid');
                isValid = false;
            } else {
                commentInput.classList.remove('is-invalid');
                commentInput.classList.add('is-valid');
            }
            
            if (isValid) {
                // Disable submit button
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Posting...';
                
                // Save info to localStorage if checkbox is checked
                if (saveInfoCheckbox && saveInfoCheckbox.checked) {
                    localStorage.setItem('comment_name', nameInput.value.trim());
                    localStorage.setItem('comment_email', emailInput.value.trim());
                }
                
                // Simulate comment posting (replace with actual API call)
                setTimeout(() => {
                    // Create new comment element
                    createNewComment(nameInput.value.trim(), commentInput.value.trim());
                    
                    // Show success message
                    showSuccess('Comment Posted', 'Your comment has been successfully posted.');
                    
                    // Reset form
                    commentForm.reset();
                    commentForm.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
                    
                    // Restore button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }, 1500);
            }
        });
        
        // Pre-fill form if saved in localStorage
        const savedName = localStorage.getItem('comment_name');
        const savedEmail = localStorage.getItem('comment_email');
        
        if (savedName) {
            commentForm.querySelector('#name').value = savedName;
        }
        
        if (savedEmail) {
            commentForm.querySelector('#email').value = savedEmail;
        }
        
        if (savedName || savedEmail) {
            commentForm.querySelector('#saveInfo').checked = true;
        }
    }
    
    // Implement smooth scrolling for table of contents
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle reply buttons
    const replyButtons = document.querySelectorAll('.comment-body .btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const commentForm = document.querySelector('.comment-form');
            const authorName = this.closest('.comment').querySelector('.comment-author').textContent;
            
            // Focus on comment textarea
            const textarea = commentForm.querySelector('#comment');
            textarea.value = `@${authorName}: `;
            textarea.focus();
            
            // Scroll to form
            commentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // Helper function to create new comment element
    function createNewComment(name, comment) {
        // Format current date
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);
        const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        // Create comment HTML
        const commentSection = document.querySelector('.comment-section');
        const commentsCount = document.querySelector('.comment-section h3');
        
        // Increment comment count
        const currentCount = parseInt(commentsCount.textContent.match(/\d+/)[0]);
        commentsCount.textContent = `Comments (${currentCount + 1})`;
        
        // Create comment element
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <div class="d-flex">
                <div class="comment-avatar me-3">
                    <img src="https://via.placeholder.com/60" alt="User">
                </div>
                <div class="comment-body">
                    <h5 class="comment-author">${name}</h5>
                    <p class="comment-date">${formattedDate} at ${formattedTime}</p>
                    <p>${comment}</p>
                    <button class="btn btn-sm btn-outline-secondary">Reply</button>
                </div>
            </div>
        `;
        
        // Add before the comment form
        const commentForm = document.querySelector('.comment-form');
        commentSection.insertBefore(newComment, commentForm);
        
        // Add event listener to the new reply button
        newComment.querySelector('.btn').addEventListener('click', function() {
            const commentForm = document.querySelector('.comment-form');
            const textarea = commentForm.querySelector('#comment');
            textarea.value = `@${name}: `;
            textarea.focus();
            commentForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
}

/**
 * Utility Functions 
 */

// Email validation helper
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}

// Initialize smooth scrolling for all internal links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for fixed header
                    behavior: 'smooth'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Initialize tooltips
function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (typeof bootstrap !== 'undefined') {
        tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
    }
}

// SweetAlert2 success message helper function
function showSuccess(title, text) {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        });
    } else {
        alert(title + "\n" + text);
        return Promise.resolve();
    }
}

// SweetAlert2 error message helper function
function showError(title, text) {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc3545'
        });
    } else {
        alert(title + "\n" + text);
        return Promise.resolve();
    }
}
