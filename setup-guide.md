# Setup Guide: Making the Contact Form Work

## Understanding the Issue

The error "405 Method Not Allowed" happens because Live Server (running on port 5500) **cannot process PHP files**. PHP needs a proper PHP-enabled server like Apache (included in XAMPP).

## Solution: Setup XAMPP

1. **Install XAMPP** if you haven't already (https://www.apachefriends.org/)

2. **Start XAMPP Control Panel** and start both Apache and MySQL services

3. **Copy your website files** to the XAMPP htdocs folder:
   - Copy everything from `d:\Tugas\PWEB\Website\` 
   - Paste to `C:\xampp\htdocs\Website\` (create the Website folder)

4. **Access your website** through XAMPP:
   - Open browser and go to: `http://localhost/Website/`
   - The form will now work properly

## Using Live Server for Development

If you prefer to continue using Live Server (port 5500) during development:

1. **Make sure XAMPP is running** with both Apache and MySQL services started

2. **Copy submit_form.php** to XAMPP's htdocs folder:
   ```
   C:\xampp\htdocs\Website\submit_form.php
   ```

3. The updated code will automatically detect Live Server and send form data to XAMPP

## Troubleshooting

If you still have issues:

1. Make sure XAMPP's Apache and MySQL services are running
2. Check that your files are properly copied to XAMPP's htdocs folder
3. Try accessing the website directly through `http://localhost/Website/`
4. Check XAMPP's error logs if problems persist
