# Voiceflow Image Upload Integration

## Overview
This integration adds a photo upload button to your Voiceflow chat widget, allowing users to upload photos that are automatically analysed and sent to the conversation.

## Installation

### Step 1: Add the Script to Your Website

Add the following `<script>` tag to your website **AFTER** your existing Voiceflow widget script:

```html
<script src="voiceflow-image-upload-integration.js"></script>
```

**Example:**
```html
<!-- Existing Voiceflow Widget Script -->
<script type="text/javascript">
  (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        window.voiceflow.chat.load({
          verify: { projectID: 'YOUR_PROJECT_ID' },
          url: 'https://general-runtime.voiceflow.com',
          versionID: 'production'
        });
      }
      v.src = "https://cdn.voiceflow.com/widget/bundle.mjs";
      v.type = "module";
      s.parentNode.insertBefore(v, s);
  })(document, 'script');
</script>

<!-- NEW: Photo Upload Integration -->
<script src="voiceflow-image-upload-integration.js"></script>
```

### Step 2: Host the JavaScript File

Upload `voiceflow-image-upload-integration.js` to your web server and update the `src` path to match where you've hosted it.

**Example:**
```html
<script src="https://www.paintersnearme.net.au/js/voiceflow-image-upload-integration.js"></script>
```

## Configuration (Already Set)

The script is pre-configured with the correct MCP server URL and API key. No additional configuration is needed.

If you need to adjust settings in the future, edit these values at the top of the JavaScript file:

```javascript
const CONFIG = {
  MCP_URL: 'https://get-tools-cleopatterson.replit.app/mcp',
  API_KEY: 'ljAaCgaZ3u72asFhp6HUvmAIy/5hGKKuQtBHJLNJiCI=',
  MAX_IMAGE_SIZE: 800,        // Max pixels on longest side
  JPEG_QUALITY: 0.7           // Compression quality (0-1)
};
```

**Note:** The photo analysis prompt is configured in the MCP tool and can be updated there without modifying this JavaScript file.

## How It Works

1. **User clicks the photo button** (appears in the chat input footer)
2. **User selects a photo** from their device
3. **Photo is compressed** to reduce upload size
4. **Photo is uploaded** to ImgBB and analysed by AI
5. **URL is sent to the chat** in format: `📸 Photo uploaded: https://...`
6. **Voiceflow agent extracts the URL** and analyzes the photo
7. **Agent responds** with a description of what's in the photo

## Features

- ✅ Automatic photo compression (reduces upload size by ~70%)
- ✅ Button hides when user starts typing
- ✅ Upload progress indicator
- ✅ Error handling with user-friendly messages
- ✅ Works with Voiceflow's shadow DOM
- ✅ Mobile and desktop compatible

## Testing

After installation:

1. Open your website with the Voiceflow chat widget
2. Look for the photo upload button (camera icon) in the chat input footer
3. Click it and select a test photo
4. You should see:
   - "Compressing photo..." status
   - "Uploading photo..." status
   - "Photo uploaded!" status
   - A message in chat: `📸 Photo uploaded: [URL]`
   - The agent analysing and describing the photo

## Important Notes

**Dynamic Widget Loading**: On websites where the Voiceflow widget loads dynamically (e.g., after user interaction like entering a postcode), the script will automatically wait and detect the widget within 20 seconds. No additional configuration is needed.

## Troubleshooting

### Button doesn't appear
- Check browser console for errors
- Verify the script loaded: Check Network tab in DevTools
- Wait up to 20 seconds after the widget appears (script attempts detection 40 times at 500ms intervals)
- If using a dynamically-loaded widget, ensure it has fully rendered before expecting the button

### Upload fails
- Check browser console for error messages
- Verify you have internet connectivity
- Ensure photo file is a valid format (JPG, PNG, etc.)

### Agent doesn't respond
- Verify the agent has the `analyze_image` tool configured in Voiceflow
- Check that the agent instructions include handling of `📸 Photo uploaded:` messages

## Support

For technical issues or questions, contact: [your contact info]

---

**Last updated:** 2025-11-04
