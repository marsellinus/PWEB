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
    
    // Handle response messages (replaces iframe_response_handler.html)
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

// ... other functions from your script.js ...

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

// ... rest of your script.js functions for blog, article, home pages ...
