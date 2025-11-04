/**
 * VOICEFLOW IMAGE UPLOAD BUTTON INTEGRATION
 *
 * This script adds a persistent image upload button to your Voiceflow chat widget
 * that allows users to upload images for analysis.
 *
 * INSTALLATION:
 * 1. Add this entire <script> block AFTER your Voiceflow chat widget script
 * 2. Update the CONFIG object below with your MCP server URL and API key
 * 3. Ensure the Voiceflow widget is loaded on the page
 *
 * REQUIREMENTS:
 * - Voiceflow chat widget must be installed on the page
 * - MCP server with analyze_image tool endpoint
 * - ImgBB API key configured on the MCP server
 */

(function() {
  'use strict';

  // ============================================================================
  // CONFIGURATION - UPDATE THESE VALUES
  // ============================================================================
  const CONFIG = {
    MCP_URL: 'https://get-tools-cleopatterson.replit.app/mcp',
    API_KEY: 'ljAaCgaZ3u72asFhp6HUvmAIy/5hGKKuQtBHJLNJiCI=',
    MAX_IMAGE_SIZE: 800,        // Max pixels on longest side
    JPEG_QUALITY: 0.7,          // 0-1 compression quality
    MAX_ATTEMPTS: 40,           // Widget detection attempts
    ATTEMPT_INTERVAL: 500,      // ms between attempts
    ANALYSIS_PROMPT: "In 2-3 concise sentences, describe: 1) What type of surface (e.g., fence, walls, ceiling) and material (wood, brick, concrete, etc.), 2) Estimated size/scope (e.g., fence length in meters, room dimensions, number of rooms), 3) Current condition (damage, peeling, stains, weathering)."
  };

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  function updateStatus(iconUrl, text) {
    const icon = document.getElementById('status-icon');
    const status = document.getElementById('status-text');
    if (icon) icon.src = iconUrl;
    if (status) status.textContent = text;
  }

  function showStatus() {
    document.querySelector('.upload-status')?.classList.add('show');
  }

  function hideStatus(delay = 2000) {
    setTimeout(() => {
      document.querySelector('.upload-status')?.classList.remove('show');
    }, delay);
  }

  async function compressImage(file) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      img.onload = function() {
        let { width, height } = img;

        // Resize if needed
        if (width > CONFIG.MAX_IMAGE_SIZE || height > CONFIG.MAX_IMAGE_SIZE) {
          const scale = CONFIG.MAX_IMAGE_SIZE / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        // Compress to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', CONFIG.JPEG_QUALITY));
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      reader.onload = (e) => img.src = e.target.result;
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  async function analyzeImage(imageData) {
    const response = await fetch(CONFIG.MCP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: 'analyze_image',
          arguments: {
            image_data: imageData,
            question: CONFIG.ANALYSIS_PROMPT,
            create_permanent_url: true  // Get permanent URL for HubSpot
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.result.content[0].text);
    return result;  // Return full result: { description, permanent_url, ... }
  }

  // ============================================================================
  // MAIN FUNCTION
  // ============================================================================
  function addPersistentUploadButton() {

    // Add custom CSS for the upload button
    const style = document.createElement('style');
    style.textContent = `
      #custom-upload-btn {
        position: absolute;
        right: 72px;
        bottom: 42px;
        width: 40px;
        height: 40px;
        background: transparent;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        z-index: 10;
        opacity: 1;
        color: #9CA3AF;
      }

      #custom-upload-btn.visible {
        display: flex;
      }

      #custom-upload-btn:hover {
        background: rgba(0, 0, 0, 0.04);
        color: #6B7280;
      }

      #custom-upload-btn.hidden {
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease;
      }

      #custom-upload-btn svg {
        width: 24px;
        height: 24px;
      }

      /* Make input container relative so button positions correctly */
      .vfrc-footer {
        position: relative !important;
      }

      /* Upload status indicator */
      .upload-status {
        position: fixed;
        bottom: 140px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 12px 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: none;
        align-items: center;
        gap: 10px;
        z-index: 100001;
      }

      .upload-status.show {
        display: flex;
      }

      .upload-status img {
        width: 24px;
        height: 24px;
      }
    `;
    document.head.appendChild(style);

    // Wait for chat widget to be ready
    let attempts = 0;

    const findAndInjectButton = setInterval(() => {
      attempts++;

      // Find widget container - in embedded mode with declarative shadow DOM,
      // the shadow root is directly on #vf-embed
      const embedDiv = document.querySelector('#vf-embed');
      const widgetContainer = embedDiv ||
                              document.querySelector('#voiceflow-chat') ||
                              document.querySelector('[id*="voiceflow"]');
      const shadowRoot = widgetContainer?.shadowRoot;

      // Log what we're seeing
      if (attempts === 1) {
        console.log('Embed div:', embedDiv);
        console.log('Widget container:', widgetContainer);
        console.log('Has shadow root:', !!shadowRoot);
        console.log('Embed div HTML:', embedDiv?.innerHTML);
      }

      // Check if shadow DOM has content
      const shadowHasContent = shadowRoot && shadowRoot.querySelectorAll('*').length > 0;

      if (!shadowHasContent) {
        // Maybe it's not using shadow DOM at all - check regular DOM
        const inputInEmbed = embedDiv?.querySelector('input') ||
                            embedDiv?.querySelector('textarea') ||
                            embedDiv?.querySelector('[class*="input"]');

        if (inputInEmbed) {
          console.log('Attempt', attempts, '- Found input in regular DOM (no shadow)!', inputInEmbed);
          // Widget is not using shadow DOM - look for footer in regular DOM
        } else {
          if (attempts % 10 === 0) {
            console.log('Attempt', attempts, '- Still waiting for widget to render...');
          }
          return;
        }
      } else {
        console.log('Attempt', attempts, '- Shadow DOM has', shadowRoot.querySelectorAll('*').length, 'elements');
      }

      // Find footer container - try multiple selectors
      const footerContainer = shadowRoot?.querySelector('.vfrc-footer') ||
                              shadowRoot?.querySelector('[class*="footer"]') ||
                              shadowRoot?.querySelector('.vfrc-input-container') ||
                              shadowRoot?.querySelector('[class*="input"]') ||
                              embedDiv?.querySelector('.vfrc-footer') ||
                              document.querySelector('.vfrc-footer');

      if (footerContainer) {
        console.log('Found footer:', footerContainer);
      }

      // Check if button already exists
      const existingBtn = shadowRoot?.getElementById('custom-upload-btn') ||
                         document.getElementById('custom-upload-btn');

      if (footerContainer && !existingBtn) {

        // Inject CSS into shadow DOM
        if (shadowRoot && !shadowRoot.querySelector('#custom-upload-styles')) {
          const shadowStyle = document.createElement('style');
          shadowStyle.id = 'custom-upload-styles';
          shadowStyle.textContent = style.textContent;
          shadowRoot.appendChild(shadowStyle);
        }

        // Create the upload button
        const uploadBtn = document.createElement('button');
        uploadBtn.id = 'custom-upload-btn';
        uploadBtn.setAttribute('aria-label', 'Upload image');
        uploadBtn.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.6 6H18.4C19.4048 6 20.0683 6.00117 20.5766 6.0427C21.0675 6.08281 21.2803 6.15295 21.408 6.21799C21.7843 6.40973 22.0903 6.71569 22.282 7.09202C22.3471 7.21966 22.4172 7.43248 22.4573 7.92336C22.4988 8.43174 22.5 9.09522 22.5 10.1V18.9C22.5 19.9048 22.4988 20.5683 22.4573 21.0766C22.4172 21.5675 22.3471 21.7803 22.282 21.908C22.0903 22.2843 21.7843 22.5903 21.408 22.782C21.2803 22.8471 21.0675 22.9172 20.5766 22.9573C20.0683 22.9988 19.4048 23 18.4 23H5.6C4.59522 23 3.93174 22.9988 3.42336 22.9573C2.93248 22.9172 2.71966 22.8471 2.59202 22.782C2.21569 22.5903 1.90973 22.2843 1.71799 21.908C1.65295 21.7803 1.58281 21.5675 1.5427 21.0766C1.50117 20.5683 1.5 19.9048 1.5 18.9V10.1C1.5 9.09522 1.50117 8.43174 1.5427 7.92336C1.58281 7.43248 1.65295 7.21966 1.71799 7.09202C1.90973 6.71569 2.21569 6.40973 2.59202 6.21799C2.71966 6.15295 2.93248 6.08281 3.42336 6.0427C3.93174 6.00117 4.59522 6 5.6 6ZM9 10.5C9 11.3284 8.32843 12 7.5 12C6.67157 12 6 11.3284 6 10.5C6 9.67157 6.67157 9 7.5 9C8.32843 9 9 9.67157 9 10.5ZM3 16.5858L7.29289 12.2929C7.68342 11.9024 8.31658 11.9024 8.70711 12.2929L11.7929 15.3787L15.2929 11.8787C15.6834 11.4882 16.3166 11.4882 16.7071 11.8787L21 16.1716V18.9C21 19.9167 20.9983 20.4839 20.9626 20.9072C20.9281 21.3162 20.8674 21.4836 20.8107 21.5894C20.702 21.7934 20.5433 21.952 20.3393 22.0607C20.2336 22.1174 20.0662 22.1781 19.6572 22.2126C19.2339 22.2483 18.6667 22.25 17.65 22.25H6.35C5.33328 22.25 4.76608 22.2483 4.34281 22.2126C3.93383 22.1781 3.76637 22.1174 3.66065 22.0607C3.45668 21.952 3.29803 21.7934 3.18934 21.5894C3.13263 21.4836 3.07188 21.3162 3.03741 20.9072C3.00167 20.4839 3 19.9167 3 18.9V16.5858Z" fill="currentColor"/>
          </svg>
        `;
        uploadBtn.classList.add('visible'); // Start visible

        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'custom-file-input';

        // Create upload status indicator
        const statusDiv = document.createElement('div');
        statusDiv.className = 'upload-status';
        statusDiv.innerHTML = `
          <img src="" alt="Status" id="status-icon">
          <span id="status-text">Uploading...</span>
        `;

        // Add button to footer, others to body
        footerContainer.appendChild(uploadBtn);
        document.body.appendChild(fileInput);
        document.body.appendChild(statusDiv);

        console.log('Upload button added to footer');

        // Handle button click
        uploadBtn.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log('Upload button clicked!');
          fileInput.click();
        });

        // Monitor input to hide/show button
        const findInput = () => {
          return (shadowRoot?.querySelector('.vfrc-input')) ||
                 (shadowRoot?.querySelector('textarea')) ||
                 (shadowRoot?.querySelector('input[type="text"]')) ||
                 document.querySelector('.vfrc-input') ||
                 document.querySelector('textarea') ||
                 document.querySelector('input[type="text"]');
        };

        // Function to check and toggle button visibility
        const checkInputValue = () => {
          const chatInput = findInput();
          if (chatInput && chatInput.value && chatInput.value.trim().length > 0) {
            uploadBtn.classList.add('hidden');
            uploadBtn.classList.remove('visible');
          } else if (chatInput) {
            uploadBtn.classList.remove('hidden');
            uploadBtn.classList.add('visible');
          }
        };

        // Setup event listeners
        const setupListeners = setInterval(() => {
          const chatInput = findInput();
          if (chatInput && !chatInput.dataset.uploadListenerAdded) {
            chatInput.dataset.uploadListenerAdded = 'true';
            chatInput.addEventListener('input', checkInputValue);
            chatInput.addEventListener('keyup', checkInputValue);
            chatInput.addEventListener('change', checkInputValue);
            clearInterval(setupListeners);
          }
        }, 500);

        // Also continuously check (as backup)
        setInterval(checkInputValue, 200);

        // Handle file selection
        fileInput.addEventListener('change', async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          // Validate file type
          if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            fileInput.value = '';
            return;
          }

          // Show status and process image
          showStatus();
          updateStatus(
            'https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif',
            'Compressing image...'
          );

          try {
            // Compress image
            const compressedImage = await compressImage(file);

            // Analyze image and get permanent URL
            updateStatus(
              'https://s3.amazonaws.com/com.voiceflow.studio/share/upload/upload.gif',
              'Analyzing and uploading...'
            );
            const result = await analyzeImage(compressedImage);

            if (!result.permanent_url) {
              throw new Error('Failed to create permanent image URL');
            }

            // Show success
            updateStatus(
              'https://s3.amazonaws.com/com.voiceflow.studio/share/check/check.gif',
              'Image uploaded!'
            );

            // Send image URL in the message so agent can extract it and analyze
            window.voiceflow.chat.interact({
              type: 'text',
              payload: `📸 Image uploaded: ${result.permanent_url}`
            });

            // Cleanup
            fileInput.value = '';
            hideStatus();

          } catch (error) {
            console.error('Image upload error:', error);

            // Show error
            updateStatus(
              'https://s3.amazonaws.com/com.voiceflow.studio/share/error.gif',
              'Upload failed'
            );

            // Send error to chat
            window.voiceflow.chat.interact({
              type: 'text',
              payload: `❌ Image upload failed: ${error.message}`
            });

            // Cleanup
            fileInput.value = '';
            hideStatus(3000);
          }
        });

        clearInterval(findAndInjectButton);
      } else if (attempts >= CONFIG.MAX_ATTEMPTS) {
        console.warn('Upload button: Widget footer not found after', CONFIG.MAX_ATTEMPTS, 'attempts');
        clearInterval(findAndInjectButton);
      }
    }, CONFIG.ATTEMPT_INTERVAL);
  }

  // Expose function globally so it can be called after widget loads
  window.addVoiceflowImageUpload = addPersistentUploadButton;

})();
