// Hide content immediately
document.body.style.display = 'none';

const DEMO_PASSWORD = 'serviceseeking2024';

function checkAuthentication() {
    if (localStorage.getItem('authenticated') === 'true') {
        document.body.style.display = 'block';
        return true;
    }
    return false;
}

function promptPassword() {
    const password = prompt('Please enter the password to access this demo:');
    if (password === DEMO_PASSWORD) {
        localStorage.setItem('authenticated', 'true');
        document.body.style.display = 'block';
        return true;
    }
    alert('Incorrect password');
    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuthentication()) {
        promptPassword();
    }
    
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