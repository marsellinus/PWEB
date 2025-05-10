# Website Development Setup

## Running the PHP Backend

This project includes PHP files that need to be served by a PHP-enabled web server. Here are your options:

### Option 1: XAMPP/WAMP/MAMP

1. Install [XAMPP](https://www.apachefriends.org/), [WAMP](https://www.wampserver.com/), or [MAMP](https://www.mamp.info/)
2. Place your project files in the `htdocs` (XAMPP/MAMP) or `www` (WAMP) directory
3. Start the Apache server
4. Access your project at `http://localhost/your-project-folder`

### Option 2: PHP's Built-in Server

If you have PHP installed on your system, you can run:

```bash
cd path/to/your/project
php -S localhost:8000
```

Then access your site at `http://localhost:8000`

## Form Submission Issues

If you're encountering issues with form submission:

1. Make sure you're accessing the site through a proper server (not just opening HTML files directly)
2. Check the browser console for errors
3. Verify that PHP is properly processing your requests