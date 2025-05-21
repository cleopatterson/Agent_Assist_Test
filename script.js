document.addEventListener('DOMContentLoaded', function() {
    const postcodeInput = document.getElementById('postcode');
    const chatbotBtn = document.getElementById('chatbot-link');

    postcodeInput.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    chatbotBtn.addEventListener('click', function(e) {
        const postcode = postcodeInput.value;
        if (!postcode) {
            alert('Please enter a postcode');
            e.preventDefault();
            return;
        }

        const postcodeNum = parseInt(postcode);
        if (postcodeNum < 2000 || postcodeNum > 2999) {
            alert('Please enter a valid Sydney postcode (2000-2999)');
            e.preventDefault();
            return;
        }
    });
});