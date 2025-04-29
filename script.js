/**
 * Main JavaScript file for My Portfolio website
 * @author: Marsellinus A.K
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize components based on current page
    initCommonComponents();
    
    // Initialize specific page functionality
    if (isCurrentPage('blog.html')) {
        initBlogPage();
    } else if (isCurrentPage('article.html')) {
        initArticlePage();
    } else if (isCurrentPage('index.html') || isHomePage()) {
        initHomePage();
    }
    
    // Handle URL parameters for responses (replaces iframe_response_handler.html)
    handleResponseMessages();
});

/**
 * Check if current page is home page
 */
function isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path.endsWith('/index.html') || path.endsWith('/');
}

/**
 * Initialize components common to all pages
 */
function initCommonComponents() {
    // Initialize mobile navigation toggle
    initMobileNav();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize tooltips
    initTooltips();

    // Initialize back to top button
    initBackToTop();

    // Highlight active nav item based on current page or scroll position
    highlightActiveNavItem();
    
    // Add animation to elements when they come into view
    initScrollAnimations();
    
    // Initialize lazy loading for images
    initLazyLoading();
}

/**
 * Mobile navigation toggle
 */
function initMobileNav() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            document.body.classList.toggle('nav-open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navbarToggler.contains(event.target) || 
                                  (navbarCollapse && navbarCollapse.contains(event.target));
            
            if (!isClickInside && navbarCollapse && navbarCollapse.classList.contains('show')) {
                // Using Bootstrap's collapse API
                if (typeof bootstrap !== 'undefined') {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                } else {
                    // Fallback
                    navbarCollapse.classList.remove('show');
                }
                document.body.classList.remove('nav-open');
            }
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    // Using Bootstrap's collapse API
                    if (typeof bootstrap !== 'undefined') {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    } else {
                        // Fallback
                        navbarCollapse.classList.remove('show');
                    }
                    document.body.classList.remove('nav-open');
                }
            });
        });
    }
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80; // Adjust based on your fixed header height
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without jumping
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    });
}

/**
 * Initialize tooltips
 */
function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    if (tooltipTriggerList.length && typeof bootstrap !== 'undefined') {
        [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
    }
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    // Create back to top button if it doesn't exist
    let backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.classList.add('back-to-top', 'btn', 'btn-danger');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
        
        // Add styles
        backToTopBtn.style.position = 'fixed';
        backToTopBtn.style.bottom = '20px';
        backToTopBtn.style.right = '20px';
        backToTopBtn.style.display = 'none';
        backToTopBtn.style.zIndex = '999';
        backToTopBtn.style.width = '40px';
        backToTopBtn.style.height = '40px';
        backToTopBtn.style.borderRadius = '50%';
        backToTopBtn.style.padding = '0';
        backToTopBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        backToTopBtn.style.transition = 'all 0.3s ease';
        
        // Add hover effect
        backToTopBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
        });
        
        backToTopBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        });
        
        // Add event listener
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Show/hide back to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
            // Animate in
            setTimeout(() => {
                backToTopBtn.style.opacity = '1';
            }, 50);
        } else {
            backToTopBtn.style.opacity = '0';
            // Wait for fade out transition before hiding
            setTimeout(() => {
                if (window.scrollY <= 300) {
                    backToTopBtn.style.display = 'none';
                }
            }, 300);
        }
    });
}

/**
 * Highlight active nav item based on current page or scroll position
 */
function highlightActiveNavItem() {
    const currentLocation = window.location.href;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        // Remove active class from all links first
        link.classList.remove('active');
        
        const linkHref = link.getAttribute('href');
        
        // Check if the link href is in the current URL for non-anchor links
        if (!linkHref.startsWith('#') && currentLocation.includes(linkHref)) {
            link.classList.add('active');
        }
    });
    
    // For homepage, handle section highlighting on scroll
    if (isHomePage()) {
        // Debounce scroll handler for better performance
        let scrollTimeout;
        
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(function() {
                const scrollPosition = window.scrollY + 150; // Adjust offset as needed
                
                // Get all sections with IDs
                const sections = document.querySelectorAll('section[id]');
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        // Clear all active classes first
                        navLinks.forEach(navLink => {
                            navLink.classList.remove('active');
                            if (navLink.getAttribute('href') === `#${sectionId}`) {
                                navLink.classList.add('active');
                            }
                        });
                    }
                });
            }, 100);
        });
    }
}

/**
 * Initialize scroll animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animated, .fade-in, .fade-up, .fade-down, .fade-left, .fade-right');
    
    if (animatedElements.length > 0) {
        // Create the Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: stop observing the element after it's animated
                    observer.unobserve(entry.target);
                }
            });
        }, {
            root: null, // viewport
            threshold: 0.15, // trigger when 15% of element is visible
            rootMargin: '-50px' // offset from viewport
        });
        
        // Observe each animated element
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}

/**
 * Initialize lazy loading for images
 */
function initLazyLoading() {
    // Use native lazy loading if supported
    if ('loading' in HTMLImageElement.prototype) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    } else {
        // Fallback to Intersection Observer for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length > 0) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

/**
 * Check if current page matches the given filename
 */
function isCurrentPage(filename) {
    const path = window.location.pathname;
    return path.endsWith(filename) || path.includes(`/${filename}`);
}

/**
 * Handle form response messages from URL parameters
 * This replaces the functionality in iframe_response_handler.html
 */
function handleResponseMessages() {
    // Function to parse parameters from URL
    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    
    // Get status and message from URL parameters
    var status = getParameterByName('status');
    var message = getParameterByName('message');
    
    // Process the response if parameters exist
    if (status && message) {
        // Create response object
        var response = {
            status: status,
            message: message
        };
        
        // Handle message display
        if (status === 'success') {
            showSuccess(message);
        } else {
            showError(message);
        }
        
        // Clean up URL without reloading the page
        if (window.history && window.history.replaceState) {
            var cleanUrl = window.location.protocol + "//" + 
                          window.location.host + 
                          window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }
}

/**
 * Helper function to show success messages using SweetAlert or fallback to alert
 */
function showSuccess(title, message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: title,
            text: message || '',
            confirmButtonColor: '#dc3545'
        });
    } else {
        alert(title + (message ? '\n' + message : ''));
    }
}

/**
 * Helper function to show error messages using SweetAlert or fallback to alert
 */
function showError(message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            confirmButtonColor: '#dc3545'
        });
    } else {
        alert('Error: ' + message);
    }
}

/**
 * Initialize Blog Page functionality
 */
function initBlogPage() {
    // Filter functionality for blog posts
    initBlogFilters();
    
    // Search functionality for blog posts
    initBlogSearch();
    
    // Initialize the blog pagination
    initBlogPagination();
    
    // Initialize newsletter subscription form
    initSubscriptionForm();
}

/**
 * Initialize Blog Filters
 */
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogItems = document.querySelectorAll('.blog-item');
    const noResults = document.getElementById('no-results');
    const resetBtn = document.getElementById('reset-filters');
    
    if (!filterBtns.length || !blogItems.length) return;
    
    // Filter function
    function filterItems() {
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        if (!activeFilterBtn) return;
        
        const activeFilter = activeFilterBtn.getAttribute('data-filter');
        const searchInput = document.getElementById('blog-search');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        let visibleCount = 0;
        
        blogItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const content = item.textContent.toLowerCase();
            
            const matchesFilter = activeFilter === 'all' || category === activeFilter;
            const matchesSearch = !searchTerm || content.includes(searchTerm);
            
            if (matchesFilter && matchesSearch) {
                item.style.display = 'block';
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        if (noResults) {
            if (visibleCount === 0) {
                noResults.classList.remove('d-none');
            } else {
                noResults.classList.add('d-none');
            }
        }
        
        // Update the showing count text
        const countElement = document.querySelector('.col-md-6 p.text-muted.mb-0');
        if (countElement) {
            countElement.textContent = `Showing ${visibleCount} of ${blogItems.length} articles`;
        }
    }
    
    // Event listeners for filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterItems();
        });
    });
    
    // Reset filters
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const searchInput = document.getElementById('blog-search');
            if (searchInput) searchInput.value = '';
            
            filterBtns.forEach(b => b.classList.remove('active'));
            document.querySelector('[data-filter="all"]').classList.add('active');
            filterItems();
        });
    }
    
    // Initialize sorting dropdown
    const sortDropdown = document.getElementById('sortDropdown');
    if (sortDropdown) {
        const sortOptions = document.querySelectorAll('.dropdown-menu .dropdown-item');
        sortOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all options
                sortOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
                
                // Update dropdown button text
                const sortText = this.textContent;
                sortDropdown.querySelector('.dropdown-toggle').innerHTML = 
                    `<i class="fas fa-sort me-1"></i> ${sortText}`;
                
                // Sort blog items
                sortBlogItems(this.getAttribute('data-sort') || 'newest');
            });
        });
    }
}

/**
 * Sort blog items
 */
function sortBlogItems(sortOption) {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;
    
    const blogItems = Array.from(blogGrid.querySelectorAll('.blog-item'));
    
    blogItems.sort((a, b) => {
        const dateA = new Date(a.querySelector('.blog-date').textContent.trim());
        const dateB = new Date(b.querySelector('.blog-date').textContent.trim());
        
        if (sortOption === 'oldest') {
            return dateA - dateB;
        } else if (sortOption === 'newest') {
            return dateB - dateA;
        } else if (sortOption === 'popular') {
            // This would require view count data, for now use random
            return Math.random() - 0.5;
        }
        
        return 0;
    });
    
    // Re-append items in new order
    blogItems.forEach(item => {
        blogGrid.appendChild(item);
    });
}

/**
 * Initialize Blog Search
 */
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    
    if (!searchInput) return;
    
    const searchForm = searchInput.closest('form');
    const searchButton = searchInput.nextElementSibling;
    
    // Focus input when clicking on search button
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            searchInput.focus();
        });
    }
    
    // Add debounce to search input
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            // Trigger filter function
            const filterEvent = new Event('click');
            const activeFilter = document.querySelector('.filter-btn.active') || document.querySelector('[data-filter="all"]');
            if (activeFilter) {
                activeFilter.dispatchEvent(filterEvent);
            }
        }, 300); // 300ms delay for performance
    });
    
    // Prevent form submission
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
}

/**
 * Initialize Blog Pagination
 */
function initBlogPagination() {
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    
    if (paginationLinks.length) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all pagination items
                document.querySelectorAll('.pagination .page-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to the parent li of the clicked link
                this.closest('.page-item').classList.add('active');
                
                // In a real implementation, this would load different page content
                // For now, just scroll to top of blog section
                const blogSection = document.querySelector('.blog-header');
                if (blogSection) {
                    blogSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }
}

/**
 * Initialize Article Page functionality
 */
function initArticlePage() {
    // Create reading progress bar
    initReadingProgressBar();
    
    // Smooth scrolling for table of contents
    initTableOfContents();
    
    // Handle comments
    initCommentSystem();
    
    // Load article content based on URL parameter
    loadArticleContent();
    
    // Initialize subscription form
    initSubscriptionForm();
    
    // Initialize share buttons
    initShareButtons();
    
    // Initialize related articles
    initRelatedArticles();
}

/**
 * Initialize Reading Progress Bar
 */
function initReadingProgressBar() {
    // Create reading progress bar if it doesn't exist
    let progressBar = document.querySelector('.reading-progress-bar');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        document.body.appendChild(progressBar);
        
        // Add styles if not in CSS
        if (!document.querySelector('style#progress-bar-styles')) {
            const style = document.createElement('style');
            style.id = 'progress-bar-styles';
            style.innerHTML = `
                .reading-progress-bar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 4px;
                    background: #dc3545;
                    width: 0%;
                    z-index: 9999;
                    transition: width 0.1s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Update progress bar width on scroll using requestAnimationFrame for better performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = (winScroll / height) * 100;
                progressBar.style.width = scrolled + "%";
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Initialize Table of Contents
 */
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    if (!tocLinks.length) return;
    
    // Set active class for current section in TOC
    const tocSections = Array.from(tocLinks).map(link => {
        return document.querySelector(link.getAttribute('href'));
    }).filter(Boolean);
    
    // Add intersection observer for each section to update TOC active state
    const observerOptions = {
        rootMargin: '-100px 0px -70% 0px',
        threshold: 0
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active class from all TOC links
                tocLinks.forEach(link => link.classList.remove('active'));
                // Add active class to the TOC link matching current section
                const activeLink = document.querySelector(`.toc-list a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    tocSections.forEach(section => observer.observe(section));
    
    // Add smooth scrolling to TOC links
    tocLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize Comment System
 */
function initCommentSystem() {
    const commentForm = document.querySelector('.comment-form form');
    
    if (!commentForm) return;
    
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = this.querySelector('#name');
        const emailInput = this.querySelector('#email');
        const commentInput = this.querySelector('#comment');
        const submitBtn = this.querySelector('button[type="submit"]');
        
        if (!nameInput || !emailInput || !commentInput) return;
        
        // Validate inputs
        if (!nameInput.value.trim() || !emailInput.value.trim() || !commentInput.value.trim()) {
            showError('Please fill in all required fields.');
            return;
        }
        
        // Disable submit button and show loading state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Posting...';
        
        // Simulate server request with timeout
        setTimeout(() => {
            // Create new comment element
            const commentSection = document.querySelector('.comment-section');
            const commentsHeading = commentSection.querySelector('h3');
            const commentsCount = document.querySelectorAll('.comment').length;
            
            // Create new comment DOM element
            const newComment = document.createElement('div');
            newComment.className = 'comment';
            newComment.innerHTML = `
                <div class="d-flex">
                    <div class="comment-avatar me-3">
                        <img src="https://via.placeholder.com/60" alt="${nameInput.value}">
                    </div>
                    <div class="comment-body">
                        <h5 class="comment-author">${nameInput.value}</h5>
                        <p class="comment-date">Just now</p>
                        <p>${commentInput.value}</p>
                        <button class="btn btn-sm btn-outline-secondary">Reply</button>
                    </div>
                </div>
            `;
            
            // Add a fade-in effect
            newComment.style.opacity = '0';
            newComment.style.transition = 'opacity 0.5s ease';
            
            // Insert new comment before the comment form
            commentSection.insertBefore(newComment, commentForm.parentNode);
            
            // Trigger reflow to apply transition
            void newComment.offsetWidth;
            newComment.style.opacity = '1';
            
            // Update comment count in heading
            if (commentsHeading) {
                commentsHeading.textContent = `Comments (${commentsCount + 1})`;
            }
            
            // Update comment count in article meta
            const commentCountElement = document.querySelector('.article-meta .far.fa-comment').parentNode;
            if (commentCountElement) {
                commentCountElement.innerHTML = `<i class="far fa-comment me-2"></i> ${commentsCount + 1} Comments`;
            }
            
            // Reset form
            commentForm.reset();
            
            // Clear validation styling
            commentForm.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Scroll to the new comment
            newComment.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1500);
    });
    
    // Add click events to reply buttons
    document.querySelectorAll('.comment .btn-outline-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const commentAuthor = this.closest('.comment').querySelector('.comment-author').textContent;
            const commentForm = document.querySelector('.comment-form textarea');
            if (commentForm) {
                commentForm.value = `@${commentAuthor}: `;
                commentForm.focus();
                commentForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

/**
 * Load Article Content based on URL parameter
 */
function loadArticleContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) return;
    
    // For demonstration, we'll just update the page title, breadcrumb, and meta
    // In a real application, you would fetch the article content from a server
    const title = document.querySelector('.article-title');
    const articleCategory = document.querySelector('.article-category');
    const breadcrumbCategory = document.querySelector('.breadcrumb-item.active');
    
    if (title && articleId) {
        const articleTitles = {
            '1': 'Creating Responsive Dashboards with Bootstrap 5',
            '2': 'Building a Secure IoT Network with Intrusion Detection',
            '3': 'Data Visualization Techniques for Business Intelligence',
            '4': 'Implementing Laravel for an Enterprise Reporting System',
            '5': 'Optimizing Network Performance for Remote Teams',
            '6': 'Predictive Analytics for E-commerce: A Case Study'
        };
        
        const articleCategories = {
            '1': 'Web Dev',
            '2': 'Network',
            '3': 'Data Science',
            '4': 'Web Dev',
            '5': 'Network',
            '6': 'Data Science'
        };
        
        if (articleTitles[articleId]) {
            title.textContent = articleTitles[articleId];
            document.title = articleTitles[articleId] + ' - Marsellinus A.K Portfolio';
        }
        
        if (articleCategory && articleCategories[articleId]) {
            articleCategory.textContent = articleCategories[articleId];
        }
        
        if (breadcrumbCategory && articleCategories[articleId]) {
            breadcrumbCategory.textContent = articleCategories[articleId];
        }
    }
}

/**
 * Initialize Home Page functionality
 */
function initHomePage() {
    // Initialize portfolio filters
    initPortfolioFilters();
    
    // Initialize testimonial carousel
    initTestimonialCarousel();
    
    // Initialize skill section animations
    initSkillAnimations();
    
    // Initialize portfolio modal
    initPortfolioModal();
}

/**
 * Initialize Portfolio Filters
 */
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.portfolio-filter button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length && portfolioItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                // Filter portfolio items
                portfolioItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Initialize Testimonial Carousel
 */
function initTestimonialCarousel() {
    const carousel = document.getElementById('testimonialCarousel');
    
    if (carousel && typeof bootstrap !== 'undefined') {
        // Initialize with Bootstrap's Carousel API
        const testimonialCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            touch: true
        });
        
        // Optional: Pause carousel on hover
        carousel.addEventListener('mouseenter', () => {
            testimonialCarousel.pause();
        });
        
        carousel.addEventListener('mouseleave', () => {
            testimonialCarousel.cycle();
        });
    }
}

/**
 * Initialize Skill Animations
 */
function initSkillAnimations() {
    const skillItems = document.querySelectorAll('#skills .card');
    
    if (skillItems.length) {
        // Add animation classes if not already present
        skillItems.forEach(item => {
            if (!item.classList.contains('fade-up')) {
                item.classList.add('fade-up');
            }
        });
    }
    
    // Create progress bar animations for skills
    const ratingElements = document.querySelectorAll('.ratings');
    
    if (ratingElements.length) {
        // Create an observer for the ratings
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate the stars one by one
                    const stars = entry.target.querySelectorAll('i');
                    
                    stars.forEach((star, index) => {
                        setTimeout(() => {
                            star.style.transform = 'scale(1.2)';
                            setTimeout(() => {
                                star.style.transform = 'scale(1)';
                            }, 200);
                        }, index * 150);
                    });
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        // Observe each rating element
        ratingElements.forEach(rating => {
            // Add transition for animation if not in CSS
            rating.querySelectorAll('i').forEach(star => {
                star.style.transition = 'transform 0.2s ease';
            });
            
            observer.observe(rating);
        });
    }
}

/**
 * Initialize Portfolio Modal
 */
function initPortfolioModal() {
    const portfolioItems = document.querySelectorAll('.portfolio-card');
    
    if (portfolioItems.length) {
        portfolioItems.forEach(item => {
            item.addEventListener('click', function() {
                // Get data from the portfolio item
                const title = this.querySelector('.card-title').textContent;
                const category = this.querySelector('.tech-badge').textContent;
                const description = this.querySelector('.card-text').textContent;
                const imageSrc = this.querySelector('img').src;
                
                // Check if modal exists, create if it doesn't
                let portfolioModal = document.getElementById('portfolioModal');
                
                if (!portfolioModal) {
                    // Create modal element
                    portfolioModal = document.createElement('div');
                    portfolioModal.className = 'modal fade';
                    portfolioModal.id = 'portfolioModal';
                    portfolioModal.tabIndex = '-1';
                    portfolioModal.setAttribute('aria-hidden', 'true');
                    
                    // Create modal HTML
                    portfolioModal.innerHTML = `
                        <div class="modal-dialog modal-dialog-centered modal-lg">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title"></h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    <img class="img-fluid mb-3 w-100" alt="Project Image">
                                    <div class="badge bg-primary mb-2"></div>
                                    <p class="modal-description"></p>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    <a href="#" class="btn btn-primary" target="_blank">View Project</a>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    // Add to document
                    document.body.appendChild(portfolioModal);
                }
                
                // Update modal content
                portfolioModal.querySelector('.modal-title').textContent = title;
                portfolioModal.querySelector('.badge').textContent = category;
                portfolioModal.querySelector('.modal-description').textContent = description;
                portfolioModal.querySelector('img').src = imageSrc;
                
                // Show modal using Bootstrap's Modal API
                if (typeof bootstrap !== 'undefined') {
                    const modal = new bootstrap.Modal(portfolioModal);
                    modal.show();
                }
            });
        });
    }
}

/**
 * Initialize Share Buttons
 */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-buttons a');
    
    if (shareButtons.length) {
        // Get article details for sharing
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        
        shareButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                let shareUrl;
                const classes = this.classList;
                
                // Determine which social network to share to
                if (classes.contains('btn-primary')) { // Facebook
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
                } else if (classes.contains('btn-info')) { // Twitter
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
                } else if (classes.contains('btn-danger') && this.querySelector('.fa-pinterest')) { // Pinterest
                    // Try to get the first image in the article
                    const firstImage = document.querySelector('.article-image img');
                    const imageUrl = firstImage ? firstImage.src : '';
                    shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(pageTitle)}`;
                } else if (classes.contains('btn-success')) { // WhatsApp
                    shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(pageTitle + ' ' + pageUrl)}`;
                } else if (classes.contains('btn-secondary')) { // Email
                    shareUrl = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent('Check out this article: ' + pageUrl)}`;
                }
                
                // Open share dialog
                if (shareUrl) {
                    window.open(shareUrl, 'share-window', 'width=600,height=400');
                }
            });
        });
    }
}

/**
 * Initialize Related Articles
 */
function initRelatedArticles() {
    const recommendationCards = document.querySelectorAll('.recommendation-card');
    
    if (recommendationCards.length) {
        recommendationCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }
}

/**
 * Initialize Subscription Form
 */
function initSubscriptionForm() {
    const subscriptionForms = document.querySelectorAll('.subscription-form, form:has(input[type="email"])');
    
    if (subscriptionForms.length) {
        subscriptionForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                if (!emailInput || !emailInput.value.trim()) {
                    showError('Please enter a valid email address.');
                    return;
                }
                
                // Get submit button and save original text
                const submitButton = this.querySelector('button[type="submit"]');
                const originalButtonText = submitButton ? submitButton.innerHTML : '';
                
                // Show loading state
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Subscribing...';
                }
                
                // Simulate subscription (in production, this would be an AJAX call to your server)
                setTimeout(() => {
                    // Show success message
                    showSuccess('Thank you for subscribing!', 'You will now receive our latest updates.');
                    
                    // Reset form
                    form.reset();
                    
                    // Restore button
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.innerHTML = originalButtonText;
                    }
                }, 1500);
            });
        });
    }
}