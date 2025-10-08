// Initialize 
chrome.runtime.onInstalled.addListener(async function() {
  console.log('Extension installed/updated');
  await initializeSettings();
});

chrome.runtime.onStartup.addListener(async function() {
  console.log('Extension started');
  await initializeSettings();
});

async function initializeSettings() {
  const defaults = getDefaultSettings();
  const stored = await chrome.storage.sync.get(["enabled", "rules"]);
  console.log('Stored settings:', stored);
  
  const initial = {
    enabled: stored.enabled !== undefined ? stored.enabled : true,
    rules: (stored.rules && Object.keys(stored.rules).length > 0) ? stored.rules : defaults.rules
  };
  
  await chrome.storage.sync.set(initial);
  console.log('Settings initialized:', initial);
}


chrome.downloads.onDeterminingFilename.addListener(function (downloadItem, suggest) {
 
  chrome.storage.sync.get(["enabled", "rules"], function(result) {
    try {
      const enabled = result.enabled !== undefined ? result.enabled : true;
      
      if (!enabled) {
        console.log('Extension disabled, allowing normal download');
        suggest({ filename: downloadItem.filename });
        return;
      }

      const fileName = downloadItem.filename;
      const fileExtension = getFileExtension(fileName).toLowerCase();
      
      const customRules = result.rules && Object.keys(result.rules).length > 0 ? result.rules : getDefaultRules();
      const destinationFolder = customRules[fileExtension] || 'Other';

      console.log(`Organizing ${fileName} (${fileExtension}) → ${destinationFolder}`);
      suggest({ filename: destinationFolder + '/' + fileName });
    } catch (error) {
      console.error('Error organizing file:', error);
      suggest({ filename: downloadItem.filename });
    }
  });
});

function getFileExtension(fileName) {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

// Message handler 
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  (async () => {
    try {
      switch (message.type) {
        case 'getStatus':
          const settings = await getSettings();
          sendResponse({ 
            enabled: settings.enabled, 
            ruleCount: Object.keys(settings.rules).length 
          });
          break;
          
        case 'toggleEnabled':
          const currentSettings = await getSettings();
          const nextEnabled = !currentSettings.enabled;
          await chrome.storage.sync.set({ enabled: nextEnabled });
          sendResponse({ enabled: nextEnabled });
          break;
          
        case 'getRules':
          const rulesSettings = await getSettings();
          sendResponse({ rules: rulesSettings.rules });
          break;
          
        case 'saveRules':
          const rules = message.rules || {};
          await chrome.storage.sync.set({ rules });
          sendResponse({ ok: true });
          break;
          
        case 'resetDefaults':
          const defaults = getDefaultSettings();
          await chrome.storage.sync.set(defaults);
          sendResponse({ ok: true });
          break;
          
        default:
          sendResponse({ error: 'Unknown message type' });
      }
    } catch (e) {
      console.error('Message handling error:', e);
      sendResponse({ error: String(e) });
    }
  })();
  return true; 
});

// Helper functions
async function getSettings() {
  const stored = await chrome.storage.sync.get(["enabled", "rules"]);
  const defaults = getDefaultSettings();
  return {
    enabled: stored.enabled !== undefined ? stored.enabled : true,
    rules: (stored.rules && Object.keys(stored.rules).length > 0) ? stored.rules : defaults.rules
  };
}

function getDefaultSettings() {
  return {
    enabled: true,
    rules: getDefaultRules()
  };
}

function getDefaultRules() {
  return {
    // Images
    png: 'Images',
    jpeg: 'Images',
    jpg: 'Images',
    gif: 'Images',
    webp: 'Images',
    svg: 'Images',
    bmp: 'Images',
    
    // Documents
    pdf: 'PDFs',
    doc: 'Documents',
    docx: 'Documents',
    txt: 'Documents',
    rtf: 'Documents',
    
    // Presentations
    ppt: 'PPTs',
    pptx: 'PPTs',
    
    // Spreadsheets
    xls: 'Spreadsheets',
    xlsx: 'Spreadsheets',
    csv: 'Spreadsheets',
    
    // Videos
    mp4: 'Videos',
    mov: 'Videos',
    avi: 'Videos',
    mkv: 'Videos',
    webm: 'Videos',
    
    // Audio
    mp3: 'Audio',
    wav: 'Audio',
    ogg: 'Audio',
    m4a: 'Audio',
    
    // Archives
    zip: 'Archives',
    rar: 'Archives',
    '7z': 'Archives',
    tar: 'Archives',
    gz: 'Archives',
    
    // Executables
    exe: 'Executables',
    msi: 'Executables',
    
    // Code
    js: 'Code',
    py: 'Code',
    java: 'Code',
    cpp: 'Code',
    html: 'Code',
    css: 'Code',
    json: 'Code',
    xml: 'Code',
    
    // Fonts
    ttf: 'Fonts',
    otf: 'Fonts',
    woff: 'Fonts',
    woff2: 'Fonts'
  };
}