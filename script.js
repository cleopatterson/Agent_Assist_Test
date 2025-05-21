document.addEventListener('DOMContentLoaded', function() {
    const postcodeInput = document.getElementById('postcode');
    const chatbotBtn = document.getElementById('chatbot-link');

    postcodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        validatePostcode();
    });

    function validatePostcode() {
        const postcode = postcodeInput.value;
        const postcodeNum = parseInt(postcode);
        const messageDiv = document.getElementById('postcode-message') || createMessageDiv();
        
        if (!postcode) {
            messageDiv.textContent = 'Please enter your postcode';
            messageDiv.style.display = 'block';
            chatbotBtn.disabled = true;
        } else if (postcodeNum < 2000 || postcodeNum > 2999) {
            messageDiv.textContent = 'Please enter a valid Sydney postcode (2000-2999)';
            messageDiv.style.display = 'block';
            chatbotBtn.disabled = true;
        } else {
            messageDiv.style.display = 'none';
            chatbotBtn.disabled = false;
        }
        chatbotBtn.style.opacity = chatbotBtn.disabled ? '0.5' : '1';
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