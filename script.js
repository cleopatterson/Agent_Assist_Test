document.addEventListener('DOMContentLoaded', function() {
    // Check for password protection
    if (!sessionStorage.getItem('authenticated')) {
        fetch('/.replit/secrets.json')
            .then(response => response.json())
            .then(secrets => {
                const password = prompt("Please enter the password to view this site:");
                if (password === secrets.SITE_PASSWORD) {
                    sessionStorage.setItem('authenticated', 'true');
                } else {
                    alert("Incorrect password");
                    document.body.style.display = 'none';
                    location.reload();
                    return;
                }
            })
            .catch(() => {
                console.error('Error loading secrets');
            });
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