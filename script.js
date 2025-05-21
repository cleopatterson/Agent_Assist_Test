
const PASSWORD = "serviceseeking";

// Hide content immediately
document.body.style.visibility = 'hidden';

function checkPassword() {
    const password = prompt("Please enter the password to view this site:");
    if (!password || password !== PASSWORD) {
        alert("Incorrect password");
        checkPassword();
        return false;
    }
    document.body.style.visibility = 'visible';
    return true;
}

// Check password before loading content
document.addEventListener('DOMContentLoaded', function() {
    checkPassword();
    
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
