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
        chatbotBtn.disabled = !postcode || postcodeNum < 2000 || postcodeNum > 2999;
        chatbotBtn.style.opacity = chatbotBtn.disabled ? '0.5' : '1';
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