// Simple, working version
console.log('Background script loaded');

// Global settings - simple approach
let extensionEnabled = true;
let rules = {};

// Initialize with defaults
function initializeDefaults() {
  rules = {
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
  console.log('Defaults initialized, rules count:', Object.keys(rules).length);
}

// Load settings from storage
function loadSettings() {
  chrome.storage.sync.get(['enabled', 'rules'], function(result) {
    console.log('Loading settings:', result);
    extensionEnabled = result.enabled !== undefined ? result.enabled : true;
    rules = result.rules && Object.keys(result.rules).length > 0 ? result.rules : rules;
    console.log('Settings loaded - enabled:', extensionEnabled, 'rules:', Object.keys(rules).length);
  });
}

// Save settings to storage
function saveSettings() {
  chrome.storage.sync.set({
    enabled: extensionEnabled,
    rules: rules
  }, function() {
    console.log('Settings saved - enabled:', extensionEnabled, 'rules:', Object.keys(rules).length);
  });
}

// Initialize on startup
initializeDefaults();
loadSettings();

// Download handler - simple and direct
chrome.downloads.onDeterminingFilename.addListener(function (downloadItem, suggest) {
  console.log('=== DOWNLOAD ===');
  console.log('File:', downloadItem.filename);
  console.log('Enabled:', extensionEnabled);
  
  if (!extensionEnabled) {
    console.log('Extension disabled, normal download');
    suggest({ filename: downloadItem.filename });
    return;
  }

  const fileName = downloadItem.filename;
  const fileExtension = getFileExtension(fileName).toLowerCase();
  const destinationFolder = rules[fileExtension] || 'Other';
  
  console.log('Extension:', fileExtension);
  console.log('Folder:', destinationFolder);
  
  const suggestedPath = destinationFolder + '/' + fileName;
  console.log('Suggesting:', suggestedPath);
  suggest({ filename: suggestedPath });
});

function getFileExtension(fileName) {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

// Message handler - simple and direct
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log('Message received:', message.type);
  
  switch (message.type) {
    case 'getStatus':
      sendResponse({
        enabled: extensionEnabled,
        ruleCount: Object.keys(rules).length
      });
      break;
      
    case 'toggleEnabled':
      extensionEnabled = !extensionEnabled;
      saveSettings();
      sendResponse({ enabled: extensionEnabled });
      break;
      
    case 'getRules':
      sendResponse({ rules: rules });
      break;
      
    case 'saveRules':
      rules = message.rules || {};
      saveSettings();
      sendResponse({ ok: true });
      break;
      
    case 'resetDefaults':
      initializeDefaults();
      saveSettings();
      sendResponse({ ok: true });
      break;
      
    default:
      sendResponse({ error: 'Unknown message type' });
  }
  
  return true;
});

console.log('Background script ready');