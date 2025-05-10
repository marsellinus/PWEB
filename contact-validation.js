jQuery(document).ready(function($) {
    // Custom validation methods
    $.validator.addMethod("phoneNumber", function(value, element) {
        return this.optional(element) || /^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(value);
    }, "Please enter a valid Indonesian phone number");

    // Add mock form detection
    const contactForm = $("#contact-form");
    if (contactForm.length > 0) {
        // Only use mock in development environments and if no backend is available
        if ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
            window.location.pathname.indexOf('file:') !== -1) {
            contactForm.attr('data-mock-submit', 'true');
            console.log('Mock form submission enabled for contact form');
        }
    }

    // Form validation
    $("#contact-form").validate({
        // Validation rules
        rules: {
            fullName: {
                required: true,
                minlength: 2,
                maxlength: 50
            },
            email: {
                required: true,
                email: true,
                maxlength: 100
            },
            phone: {
                required: true,
                phoneNumber: true,
                minlength: 10,
                maxlength: 15
            },
            message: {
                required: true,
                minlength: 10,
                maxlength: 500
            }
        },
        
        // Custom error messages
        messages: {
            fullName: {
                required: "Nama lengkap harus diisi",
                minlength: "Nama minimal 2 karakter",
                maxlength: "Nama maksimal 50 karakter"
            },
            email: {
                required: "Email harus diisi",
                email: "Format email tidak valid",
                maxlength: "Email maksimal 100 karakter"
            },
            phone: {
                required: "Nomor handphone harus diisi",
                phoneNumber: "Nomor handphone tidak valid",
                minlength: "Nomor handphone terlalu pendek",
                maxlength: "Nomor handphone terlalu panjang"
            },
            message: {
                required: "Pesan harus diisi",
                minlength: "Pesan minimal 10 karakter",
                maxlength: "Pesan maksimal 500 karakter"
            }
        },

        // Highlight function for error styling
        highlight: function(element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        
        // Unhighlight function for valid styling
        unhighlight: function(element, errorClass, validClass) {
            $(element).removeClass("is-invalid").addClass("is-valid");
        },

        // Error placement
        errorPlacement: function(error, element) {
            error.addClass("text-danger");
            error.insertAfter(element);
        },

        // Submit handler
        submitHandler: function(form) {
            // Prevent default form submission
            event.preventDefault();
            
            // Get form data
            var formData = $(form).serialize();
            
            // Store submit button reference outside of AJAX callbacks
            var submitBtn = $(form).find('button[type="submit"]');
            var originalBtnText = submitBtn.html();
            submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...');
            
            // Check if running on localhost:5500 (Live Server)
            if (window.location.port === "5500") {
                // Redirect to local XAMPP URL
                var xamppUrl = "http://localhost/Website/submit_form.php";
                
                // Use AJAX to send to XAMPP instead of Live Server
                $.ajax({
                    type: 'POST',
                    url: xamppUrl,
                    data: formData,
                    dataType: 'json',
                    success: function(response) {
                        // Show success message
                        $('#contact-form').hide();
                        $('<div class="alert alert-success mt-3">' + 
                          '<h4>Thank you for your message!</h4>' +
                          '<p>' + (response.message || 'We will get back to you soon.') + '</p>' +
                          '<button class="btn btn-secondary btn-sm mt-2" id="show-form-again">Send another message</button>' +
                          '</div>').insertAfter('#contact-form');
                          
                        // Add event handler for sending another message
                        $('#show-form-again').on('click', function() {
                            $('.alert').remove();
                            $('#contact-form').trigger('reset').show();
                        });
                        
                        // Reset button (submitBtn is now always defined)
                        submitBtn.prop('disabled', false).html(originalBtnText);
                    },
                    error: function(xhr, status, error) {
                        console.log("AJAX Error Status:", status);
                        console.log("Error:", error);
                        console.log("Response Text:", xhr.responseText);
                        
                        let errorMessage = "An error occurred while submitting the form. Please make sure XAMPP is running with Apache and MySQL services started.";
                        
                        try {
                            if (xhr.responseText) {
                                // First check if there's JSON embedded in the response
                                const jsonStartPos = xhr.responseText.indexOf('{"status"');
                                if (jsonStartPos !== -1) {
                                    const jsonStr = xhr.responseText.substring(jsonStartPos);
                                    const response = JSON.parse(jsonStr);
                                    if (response && response.message) {
                                        errorMessage = response.message;
                                    }
                                } else {
                                    // Try parsing the entire response as JSON
                                    const response = JSON.parse(xhr.responseText);
                                    if (response && response.message) {
                                        errorMessage = response.message;
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing response:", e);
                        }
                        
                        // Show error message
                        if ($('#form-message').length === 0) {
                            $('#contact-form').before('<div id="form-message"></div>');
                        }
                        $('#form-message').html('<div class="alert alert-danger">' + errorMessage + '</div>');
                        
                        // Reset button (submitBtn is now always defined)
                        submitBtn.prop('disabled', false).html(originalBtnText);
                    }
                });
            } else {
                // Normal AJAX submission
                $.ajax({
                    type: 'POST',
                    url: 'submit_form.php',
                    data: formData,
                    dataType: 'json',
                    success: function(response) {
                        // Show success message
                        $('#contact-form').hide();
                        $('<div class="alert alert-success mt-3">' + 
                          '<h4>Thank you for your message!</h4>' +
                          '<p>' + (response.message || 'We will get back to you soon.') + '</p>' +
                          '<button class="btn btn-secondary btn-sm mt-2" id="show-form-again">Send another message</button>' +
                          '</div>').insertAfter('#contact-form');
                          
                        // Add event handler for sending another message
                        $('#show-form-again').on('click', function() {
                            $('.alert').remove();
                            $('#contact-form').trigger('reset').show();
                        });
                        
                        // Reset button (submitBtn is now always defined)
                        submitBtn.prop('disabled', false).html(originalBtnText);
                    },
                    error: function(xhr, status, error) {
                        console.log("AJAX Error Status:", status);
                        console.log("Error:", error);
                        console.log("Response Text:", xhr.responseText);
                        
                        let errorMessage = "An error occurred while submitting the form. Please try again.";
                        
                        try {
                            if (xhr.responseText) {
                                // First check if there's JSON embedded in the response
                                const jsonStartPos = xhr.responseText.indexOf('{"status"');
                                if (jsonStartPos !== -1) {
                                    const jsonStr = xhr.responseText.substring(jsonStartPos);
                                    const response = JSON.parse(jsonStr);
                                    if (response && response.message) {
                                        errorMessage = response.message;
                                    }
                                } else {
                                    // Try parsing the entire response as JSON
                                    const response = JSON.parse(xhr.responseText);
                                    if (response && response.message) {
                                        errorMessage = response.message;
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("Error parsing response:", e);
                        }
                        
                        // Show error message
                        if ($('#form-message').length === 0) {
                            $('#contact-form').before('<div id="form-message"></div>');
                        }
                        $('#form-message').html('<div class="alert alert-danger">' + errorMessage + '</div>');
                        
                        // Reset button (submitBtn is now always defined)
                        submitBtn.prop('disabled', false).html(originalBtnText);
                    }
                });
            }
            
            return false;
        }
    });
    
    // Helper function to show success messages
    function showSuccessMessage(title, text) {
        return $.Deferred(function(deferred) {
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    icon: "success",
                    title: title,
                    text: text,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#dc3545"
                }).then(function() {
                    deferred.resolve();
                });
            } else {
                alert(title + "\n" + text);
                deferred.resolve();
            }
        }).promise();
    }
    
    // Helper function to show error messages
    function showErrorMessage(text) {
        return $.Deferred(function(deferred) {
            if (typeof Swal !== "undefined") {
                Swal.fire({
                    icon: "error",
                    title: "Gagal",
                    text: text,
                    confirmButtonText: "OK",
                    confirmButtonColor: "#dc3545"
                }).then(function() {
                    deferred.resolve();
                });
            } else {
                alert("Gagal: " + text);
                deferred.resolve();
            }
        }).promise();
    }
});