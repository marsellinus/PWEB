/**
 * Main JavaScript file for My Portfolio website
 * @author: Marsellinus A.K
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation highlighting and behavior
    initNavigation();
    
    // Initialize other components
    highlightActiveNavItem();
    handleResponseMessages();
    initCommonComponents();
    
    // Initialize specific page functionality
    if (isCurrentPage('blog.html')) {
        initBlogPage();
        initBlogFilters();
    } else if (isCurrentPage('article.html')) {
        initArticlePage();
    } else if (isCurrentPage('index.html') || isHomePage()) {
        initHomePage();
    }
});

/**
 * Initialize navigation highlighting and behavior
 */
function initNavigation() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // Determine current page - for non-index pages
    const currentPath = window.location.pathname;
    const isHomePage = currentPath.endsWith('index.html') || 
                       currentPath.endsWith('/') || 
                       currentPath === '';
    
    // Handle section navigation on the home page
    if (isHomePage) {
        // First set the home link as active by default
        const homeLink = document.getElementById('home-link');
        if (homeLink) homeLink.classList.add('active');
        
        // Handle click events on all navigation links on the home page
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Remove active class from all links
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                
                // Add active class to the clicked link
                this.classList.add('active');
                
                // If it's a section link (has hash), handle smooth scrolling
                const href = this.getAttribute('href');
                if (href && href.startsWith('#') && href !== '#') {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    if (targetSection) {
                        const headerOffset = 80;
                        const sectionPosition = targetSection.getBoundingClientRect().top;
                        const offsetPosition = sectionPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
        
        // Also handle scroll events to update active link based on visible section
        initScrollSpy(navLinks);
    } else {
        // For non-home pages, determine active link based on current URL
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Set active class based on URL path
            if (currentPath.includes('blog.html') || currentPath.includes('article.html')) {
                if (link.getAttribute('href') === 'blog.html') {
                    link.classList.add('active');
                }
            } else {
                // Default case for other pages
                const linkHref = link.getAttribute('href');
                if (linkHref && currentPath.includes(linkHref) && linkHref !== '#') {
                    link.classList.add('active');
                }
            }
        });
    }
}

/**
 * Initialize scroll spy functionality to highlight nav items based on scroll position
 */
function initScrollSpy(navLinks) {
    // Check which section is in view on scroll
    window.addEventListener('scroll', function() {
        // Use requestAnimationFrame for better performance
        requestAnimationFrame(function() {
            // Get current scroll position
            const scrollPosition = window.scrollY + 150; // Adjust offset as needed
            
            // If at the very top, highlight home
            if (scrollPosition < 100) {
                navLinks.forEach(link => link.classList.remove('active'));
                const homeLink = document.getElementById('home-link');
                if (homeLink) homeLink.classList.add('active');
                return;
            }
            
            // Find which section is currently in view
            let currentSection = null;
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150; // Adjust offset as needed
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Update the active navigation link
            if (currentSection) {
                navLinks.forEach(link => {
                    // Get the href attribute
                    const href = link.getAttribute('href');
                    
                    // Remove active class
                    link.classList.remove('active');
                    
                    // Add active class if href matches the current section
                    if (href === '#' + currentSection) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

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
        });
    });
}

/**
 * Highlight active nav item based on current page or scroll position
 */
function highlightActiveNavItem() {
    // Get current URL path
    const currentPath = window.location.pathname;
    
    // Determine current page based on pathname
    let currentPage = 'index.html';
    if (currentPath.includes('blog.html')) {
        currentPage = 'blog.html';
    } else if (currentPath.includes('article.html')) {
        currentPage = 'blog.html'; // Articles are part of blog section
    }
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    // First remove all active classes
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    const currentNavLink = document.querySelector(`.navbar-nav .nav-link[href="${currentPage}"]`);
    if (currentNavLink) {
        currentNavLink.classList.add('active');
    } else if (currentPage === 'index.html') {
        // If we're on the home page, activate the Home link
        const homeLink = document.querySelector('.navbar-nav .nav-link[href="index.html"]');
        if (homeLink) {
            homeLink.classList.add('active');
        }
    }
    
    // Only set up scroll-based highlighting on homepage
    if (currentPage === 'index.html') {
        setupScrollHighlighting(navLinks);
    }
}

/**
 * Set up scroll-based navigation highlighting for homepage
 */
function setupScrollHighlighting(navLinks) {
    // Track last section to prevent flickering
    let lastActiveSection = '';
    
    window.addEventListener('scroll', function() {
        // Debounce the scroll event for performance
        if (!window.scrollTimeout) {
            window.scrollTimeout = setTimeout(function() {
                // Get current scroll position
                const scrollPosition = window.scrollY + 100;
                
                // Check if we're at the very top, highlight Home
                if (scrollPosition < 100) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    const homeLink = document.querySelector('.nav-link[href="index.html"]');
                    if (homeLink) homeLink.classList.add('active');
                    lastActiveSection = 'home';
                    window.scrollTimeout = null;
                    return;
                }
                
                // Find the current visible section
                const sections = document.querySelectorAll('section[id]');
                let currentSection = lastActiveSection;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 150;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                        currentSection = sectionId;
                    }
                });
                
                // If we found a current section and it's different from the last one
                if (currentSection && currentSection !== lastActiveSection) {
                    // Remove active class from all nav links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to the current section nav link
                    const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    } else if (currentSection === 'home') {
                        // For home section, highlight the index.html link
                        const homeLink = document.querySelector('.nav-link[href="index.html"]');
                        if (homeLink) homeLink.classList.add('active');
                    }
                    
                    lastActiveSection = currentSection;
                }
                
                // Clear the timeout
                window.scrollTimeout = null;
            }, 100);
        }
    });
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
 * Helper function to show success messages using SweetAlert or fallback to alert
 */
function showSuccess(title, text) {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: text,
            confirmButtonText: 'OK'
        });
    } else {
        alert(title + "\n" + text);
        return Promise.resolve();
    }
}

/**
 * Helper function to show error messages using SweetAlert or fallback to alert
 */
function showError(title, text) {
    if (typeof Swal !== 'undefined') {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: text,
            confirmButtonText: 'OK'
        });
    } else {
        alert(title + "\n" + text);
        return Promise.resolve();
    }
}

/**
 * Blog filtering functionality
 */
function initBlogFilters() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortOptions = document.querySelectorAll('.sort-option');
    const blogItems = document.querySelectorAll('.blog-item');
    const noResultsElement = document.getElementById('no-results');
    const resetButton = document.getElementById('reset-filters');
    
    // If we're not on the blog page, exit early
    if (!filterButtons.length || !blogItems.length) {
        return;
    }
    
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
            const sortText = this.textContent.trim();
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
            const dateTextA = a.querySelector('.blog-date').textContent.trim();
            const dateTextB = b.querySelector('.blog-date').textContent.trim();
            
            // Extract dates using regex
            const dateRegex = /(\w+)\s+(\d+),\s+(\d{4})/;
            const matchA = dateTextA.match(dateRegex);
            const matchB = dateTextB.match(dateRegex);
            
            if (matchA && matchB) {
                const dateA = new Date(`${matchA[1]} ${matchA[2]}, ${matchA[3]}`);
                const dateB = new Date(`${matchB[1]} ${matchB[2]}, ${matchB[3]}`);
                
                if (currentSort === 'newest') {
                    return dateB - dateA;
                } else if (currentSort === 'oldest') {
                    return dateA - dateB;
                }
            }
            
            // Fallback for 'popular' or if date parsing fails
            if (currentSort === 'popular') {
                // Use view count if available, otherwise random for demo
                const viewsA = parseInt(a.querySelector('.far.fa-eye')?.nextSibling?.textContent || '0');
                const viewsB = parseInt(b.querySelector('.far.fa-eye')?.nextSibling?.textContent || '0');
                return viewsB - viewsA;
            }
            
            return 0;
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
}
