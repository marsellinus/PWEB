document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navbarCollapse = document.getElementById('navbarNav');

    hamburgerMenu.addEventListener('click', function() {
        // Toggle active class on hamburger icon
        this.classList.toggle('active');
        
        // Toggle show class on navbar collapse
        navbarCollapse.classList.toggle('show');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNavbar = navbarCollapse.contains(event.target);
        const isClickOnHamburger = hamburgerMenu.contains(event.target);

        if (!isClickInsideNavbar && !isClickOnHamburger) {
            navbarCollapse.classList.remove('show');
            hamburgerMenu.classList.remove('active');
        }
    });
});