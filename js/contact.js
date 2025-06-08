// Contact form handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Simulate form submission
                submitContactForm(data);
            }
        });
    }
});

function validateContactForm(data) {
    const errors = [];
    
    // Name validation
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Nama harus diisi minimal 2 karakter');
    }
    
    // Email validation
    if (!data.email || !validateEmail(data.email)) {
        errors.push('Email tidak valid');
    }
    
    // Subject validation
    if (!data.subject) {
        errors.push('Subjek harus dipilih');
    }
    
    // Message validation
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Pesan harus diisi minimal 10 karakter');
    }
    
    if (errors.length > 0) {
        showFormErrors(errors);
        return false;
    }
    
    return true;
}

function showFormErrors(errors) {
    const errorMessage = errors.join('\n');
    alert('Terjadi kesalahan:\n' + errorMessage);
}

function submitContactForm(data) {
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Mengirim...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Show success message
        showSuccessMessage();
        
        // Log form data (in real implementation, this would be sent to server)
        console.log('Form submitted:', data);
    }, 2000);
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <h3>✅ Pesan Berhasil Dikirim!</h3>
            <p>Terima kasih atas pesan Anda. Tim kami akan merespons dalam 1x24 jam.</p>
        </div>
    `;
    successMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(74, 44, 42, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;
    
    const successContent = successMessage.querySelector('.success-content');
    successContent.style.cssText = `
        background-color: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        margin: 0 20px;
        box-shadow: 0 8px 30px rgba(74, 44, 42, 0.3);
    `;
    
    document.body.appendChild(successMessage);
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        document.body.removeChild(successMessage);
    }, 3000);
    
    // Close on click
    successMessage.addEventListener('click', () => {
        document.body.removeChild(successMessage);
    });
}

