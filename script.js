
document.addEventListener('DOMContentLoaded', function() {
    // Check if already authenticated
    if (!sessionStorage.getItem('authenticated')) {
        // Hide main content
        document.body.style.display = 'none';
        
        // Show password prompt
        const password = prompt('Please enter password to access the site:');
        
        if (password === 'serviceseeking') {
            sessionStorage.setItem('authenticated', 'true');
            document.body.style.display = 'block';
        } else {
            alert('Incorrect password');
            window.location.reload();
        }
    }

    const postcodeInput = document.getElementById('postcode');
    const chatbotBtn = document.getElementById('chatbot-link');
    
    // Initially disable the button
    chatbotBtn.disabled = true;
    chatbotBtn.style.opacity = '0.5';

    postcodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        validatePostcode();
    });

    function validatePostcode() {
        const postcode = postcodeInput.value;
        const postcodeNum = parseInt(postcode);
        const messageDiv = document.getElementById('postcode-message') || createMessageDiv();
        
        if (postcode.length === 4) {
            chatbotBtn.disabled = false;
            chatbotBtn.style.opacity = '1';
            
            if (postcodeNum < 2000 || postcodeNum > 2999) {
                messageDiv.textContent = 'Please enter a valid Sydney postcode (2000-2999)';
                messageDiv.style.display = 'block';
            } else {
                messageDiv.style.display = 'none';
            }
        } else {
            chatbotBtn.disabled = true;
            chatbotBtn.style.opacity = '0.5';
            messageDiv.style.display = 'none';
        }
    }

    function createMessageDiv() {
        const messageDiv = document.createElement('div');
        messageDiv.id = 'postcode-message';
        messageDiv.style.color = '#ff4444';
        messageDiv.style.fontSize = '0.9em';
        messageDiv.style.marginTop = '5px';
        postcodeInput.parentNode.appendChild(messageDiv);
        return messageDiv;
    }

    chatbotBtn.addEventListener('click', function(e) {
        const postcode = postcodeInput.value;
        const postcodeNum = parseInt(postcode);
        
        if (!postcode) {
            alert('Please enter a postcode');
            e.preventDefault();
            return;
        }

        if (postcodeNum < 2000 || postcodeNum > 2999) {
            alert('Please enter a valid Sydney postcode (2000-2999)');
            e.preventDefault();
            return;
        }
    });

    validatePostcode();
});
