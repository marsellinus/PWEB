# Personal Portfolio Website

A modern, responsive portfolio website built with HTML, CSS, JavaScript, and PHP. Showcases professional experience, projects, blog articles, and includes contact form functionality with database integration.

## Features

- Responsive design that works on all devices
- Portfolio section to showcase projects
- Blog with article functionality
- Contact form with validation and database storage
- Skill ratings and testimonial sections

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Backend**: PHP
- **Database**: MySQL
- **Libraries**: jQuery, jQuery Validation, Font Awesome, SweetAlert2

## Setup Instructions

### Requirements

- XAMPP, WAMP, or similar local development environment
- Web browser
- Text editor or IDE

### Installation

1. Clone or download this repository to your XAMPP htdocs folder:
   ```
   C:\xampp\htdocs\Website\
   ```

2. Start XAMPP Control Panel and ensure Apache and MySQL services are running

3. The database and table will be automatically created when the first form is submitted, or you can manually create them using the SQL below:

   ```sql
   CREATE DATABASE IF NOT EXISTS pweb_db;
   USE pweb_db;
   CREATE TABLE IF NOT EXISTS contact_messages (
       id INT AUTO_INCREMENT PRIMARY KEY,
       full_name VARCHAR(100) NOT NULL,
       email VARCHAR(100) NOT NULL,
       phone VARCHAR(20) NOT NULL,
       message TEXT NOT NULL,
       submission_date DATETIME NOT NULL
   );
   ```

4. Access the website through your browser:
   ```
   http://localhost/Website/
   ```

### Using with VS Code Live Server

If you're using VS Code Live Server extension:

1. The contact form is configured to detect this environment (port 5500)
2. It will automatically redirect AJAX requests to the XAMPP server at http://localhost/Website/submit_form.php
3. Make sure XAMPP is running with both Apache and MySQL services active

## Project Structure

- `index.html` - Homepage with portfolio overview
- `blog.html` - Blog listing page
- `article.html` - Individual article template
- `style.css` - Main stylesheet
- `script.js` - Main JavaScript file
- `contact-validation.js` - Form validation and submission
- `submit_form.php` - Backend script for contact form processing

## Contact Form

The contact form processes data through the following steps:

1. Client-side validation with jQuery Validate
2. AJAX submission to prevent page reload
3. Server-side processing with PHP
4. MySQL database storage
5. Success/error response handling

## Customization

- Edit HTML files to update content
- Modify CSS for styling changes
- Update JavaScript for behavior changes
- Configure PHP as needed for backend functionality

## Troubleshooting

- **Form submission errors**: Ensure Apache and MySQL services are running in XAMPP
- **Database connection issues**: Verify database credentials in submit_form.php
- **PHP errors**: Check XAMPP error logs at C:\xampp\php\logs

## License

This project is licensed under the MIT License - see the LICENSE file for details.