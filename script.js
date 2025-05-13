
document.addEventListener('DOMContentLoaded', () => {
  const quotesBtn = document.getElementById('get-quotes-button');
  const jobInput = document.getElementById('job-description');

  if (quotesBtn && jobInput) {
    quotesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const jobText = jobInput.value.trim();
      
      if (jobText) {
        if (window.voiceflow && window.voiceflow.chat) {
          window.voiceflow.chat.open();
          
          // Wait briefly to ensure the widget is ready
          setTimeout(() => {
            window.voiceflow.chat.interact({
              type: 'text',
              payload: jobText
            });
          }, 500);
        }
      } else {
        alert('Please describe the job before continuing.');
      }
    });
  }
});
