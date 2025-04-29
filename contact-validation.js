jQuery(document).ready(function($) {
    // Custom validation methods
    $.validator.addMethod("phoneNumber", function(value, element) {
        return this.optional(element) || /^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(value);
    }, "Please enter a valid Indonesian phone number");

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
            // Disable submit button to prevent double submission
            var $submitBtn = $(form).find("button[type='submit']");
            var originalBtnText = $submitBtn.html();
            
            $submitBtn.prop("disabled", true).html("<span class='spinner-border spinner-border-sm' role='status' aria-hidden='true'></span> Mengirim...");
            
            // Collect form data
            var formData = {};
            $(form).serializeArray().forEach(function(item) {
                formData[item.name] = item.value;
            });
            
            // Log form data (for debugging)
            console.log("Form data:", formData);
            
            // Simulate server processing delay
            setTimeout(function() {
                // Show success message directly using the global function from script.js
                if (typeof showSuccess === 'function') {
                    showSuccess("Pesan Terkirim!", "Terima kasih telah menghubungi kami. Pesan Anda telah tersimpan.");
                } else {
                    // Fallback to local function
                    showSuccessMessage("Pesan Terkirim!", "Terima kasih telah menghubungi kami. Pesan Anda telah tersimpan.");
                }
                
                // Reset form
                $(form).trigger("reset");
                
                // Clear validation styling
                $(form).find(".is-valid, .is-invalid").removeClass("is-valid is-invalid");
                
                // Re-enable submit button
                $submitBtn.prop("disabled", false).html(originalBtnText);
            }, 1500);
            
            return false; // Prevent form submission
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
                    confirmButtonText: "OK"
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
                    confirmButtonText: "OK"
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